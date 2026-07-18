"use strict";

const axios = require("axios");
const Problem = require("../models/Problem");

const generateStudyPlan = async (req, res) => {
  try {
    const { targetCompany, targetRole, availableHoursPerDay, targetInterviewDate, focusAreas } = req.body;
    const userId = req.user._id;

    if (!targetCompany || !targetRole || !availableHoursPerDay || !targetInterviewDate || !focusAreas) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields for study plan generation",
      });
    }

    const port = process.env.PORT || 3000;
    const baseUrl = `http://localhost:${port}/api`;
    const authHeader = { Authorization: `Bearer ${req.headers.authorization?.split(" ")[1]}` };

    // Fetch all necessary data concurrently
    const [profileRes, topicsRes, weeklyRes, streakRes] = await Promise.all([
      axios.get(`${baseUrl}/learning-profile`, { headers: authHeader }).catch(() => ({ data: { learningProfile: null } })),
      axios.get(`${baseUrl}/topics`, { headers: authHeader }).catch(() => ({ data: { topics: [] } })),
      axios.get(`${baseUrl}/weekly`, { headers: authHeader }).catch(() => ({ data: { analytics: null } })),
      axios.get(`${baseUrl}/streak`, { headers: authHeader }).catch(() => ({ data: { currentStreak: 0 } }))
    ]);

    const profile = profileRes.data.learningProfile;
    const topics = topicsRes.data.topics || [];
    const weekly = weeklyRes.data.analytics;
    const currentStreak = streakRes.data.currentStreak || 0;

    // Fetch recently solved problems
    const recentProblems = await Problem.find({ user: userId, status: "Solved" })
      .sort({ updatedAt: -1 })
      .limit(5);

    const recentTopics = [...new Set(recentProblems.map((p) => p.topic))].join(", ");

    const totalSolved = profile?.dsaProfile?.totalSolved || 0;
    const strongTopics = profile?.dsaProfile?.strongTopics?.join(", ") || "None";
    const weakTopics = profile?.dsaProfile?.weakTopics?.join(", ") || "None";
    
    let weeklyConsistency = "Not enough data";
    if (weekly && weekly.goals) {
      weeklyConsistency = `${weekly.goals.completionPercentage}% goal completion, ${weekly.revisionsCompleted} revisions completed this week. Total weekly DSA time: ${weekly.timeSpentMinutes} mins.`;
    }

    const masteryString = topics.length > 0 
      ? topics.map(t => `${t.topic}: ${t.solvedProblems} solved (${t.masteryPercentage}% mastery)`).join("\n") 
      : "No detailed mastery data";

    const prompt = `You are an expert technical career coach and FAANG-level interviewer.
Create a highly personalized Study Plan for a candidate targeting ${targetCompany} for the role of ${targetRole}.

Candidate constraints:
- Available hours per day: ${availableHoursPerDay}
- Target interview date: ${targetInterviewDate}
- User's selected Focus Areas: ${focusAreas.join(", ")}

Candidate's current PrepPilot platform progress:
- Total DSA problems solved: ${totalSolved}
- Current daily learning streak: ${currentStreak} days
- Weekly Consistency: ${weeklyConsistency}
- Strong Topics: ${strongTopics}
- Weak Topics: ${weakTopics}
- Recently Practiced Topics: ${recentTopics || "None"}
- Detailed Topic Mastery:
${masteryString}

Generate a comprehensive, tailored study plan. The response MUST include:
1. Overall Preparation Level (assess where they stand now)
2. Priority Topics (based on their weaknesses and company expectations)
3. Recommended LeetCode Difficulty Split (e.g. 20% Easy, 60% Medium, 20% Hard)
4. Weekly Roadmap (from now until the target date)
5. Daily Schedule (breaking down their ${availableHoursPerDay} available hours)
6. Revision Schedule (how and when to review)
7. Mock Interview Schedule
8. System Design Schedule
9. Backend Practice Schedule (since it's relevant for typical SWE roles)
10. Suggested Projects (to bolster their resume)
11. Weekly Milestones
12. Common Mistakes to Avoid
13. Final Preparation Checklist

CRITICAL RULES:
- The plan MUST be realistic based on the exact ${availableHoursPerDay} hours per day.
- Factor in the specific timeline leading up to ${targetInterviewDate}.
- Format the response beautifully using Markdown. Do not include raw JSON.
`;

    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const aiResponse = geminiResponse.data.candidates[0]?.content?.parts[0]?.text || "No study plan generated.";

    res.status(200).json({
      success: true,
      message: "Study plan generated successfully",
      data: {
        studyPlan: aiResponse,
      },
    });

  } catch (error) {
    console.error("Study plan generation error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Server error while generating study plan",
    });
  }
};

module.exports = { generateStudyPlan };
