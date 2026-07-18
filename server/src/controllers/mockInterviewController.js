"use strict";

const axios = require("axios");
const Problem = require("../models/Problem");

const generateMockInterview = async (req, res) => {
  try {
    const { company, role, difficulty, duration } = req.body;
    const userId = req.user._id;

    if (!company || !role || !difficulty || !duration) {
      return res.status(400).json({
        success: false,
        message: "Company, role, difficulty, and duration are required",
      });
    }

    // Determine the base URL for internal API calls
    const port = process.env.PORT || 3000;
    const baseUrl = `http://localhost:${port}/api`;
    const authHeader = { Authorization: `Bearer ${req.headers.authorization?.split(" ")[1]}` };

    // Fetch learning profile and topic mastery concurrently
    const [learningProfileResponse, topicMasteryResponse] = await Promise.all([
      axios.get(`${baseUrl}/learning-profile`, { headers: authHeader }).catch(() => ({ data: { learningProfile: { dsaProfile: { totalSolved: 0, strongTopics: [], weakTopics: [] } } } })),
      axios.get(`${baseUrl}/topics`, { headers: authHeader }).catch(() => ({ data: { topics: [] } }))
    ]);

    const learningProfile = learningProfileResponse.data.learningProfile;
    const topicMastery = topicMasteryResponse.data.topics || [];

    // Fetch recently solved problems
    const recentProblems = await Problem.find({ user: userId, status: "Solved" })
      .sort({ updatedAt: -1 })
      .limit(5);

    const recentTopics = [...new Set(recentProblems.map((p) => p.topic))].join(", ");

    // Build Context
    const totalSolved = learningProfile?.dsaProfile?.totalSolved || 0;
    const strongTopics = learningProfile?.dsaProfile?.strongTopics?.join(", ") || "None identified yet";
    const weakTopics = learningProfile?.dsaProfile?.weakTopics?.join(", ") || "None identified yet";
    
    // Formatting Topic Mastery for prompt
    const masteryString = topicMastery.length > 0 
      ? topicMastery.map(t => `${t.topic}: ${t.solvedProblems} solved out of ${t.totalProblems} (${t.masteryPercentage}% mastery)`).join("\n") 
      : "No detailed mastery data";

    const prompt = `You are an expert technical interviewer for ${company}.
Conduct a mock interview for the role of ${role}.
The interview difficulty should be ${difficulty} and the expected duration is ${duration} minutes.

Candidate Context:
- Total DSA problems solved: ${totalSolved}
- Strong Topics: ${strongTopics}
- Weak Topics: ${weakTopics}
- Recently Practiced Topics: ${recentTopics || "None"}
- Detailed Topic Mastery:
${masteryString}

Based on this context, generate a personalized mock interview. 
The generated interview MUST include:
1. A brief professional introduction from the interviewer.
2. 5 to 8 DSA questions ordered from easiest to most difficult, tailored to the candidate's strong and weak topics as well as the company (${company}).
3. For each question, provide:
   - The Topic
   - The Difficulty
   - What the interviewer expects (time/space complexity, edge cases)
   - Follow-up questions
   - Progressive Hints (NOT solutions)
4. General interview tips for ${company}.
5. Final preparation advice based on the candidate's weak topics.

CRITICAL RULES:
- Do NOT provide complete code solutions.
- Do NOT reveal the final algorithm explicitly.
- Only generate the interview questions and structure.
- Format the response beautifully using Markdown.
`;

    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const aiResponse = geminiResponse.data.candidates[0]?.content?.parts[0]?.text || "No mock interview generated.";

    res.status(200).json({
      success: true,
      message: "Mock interview generated successfully",
      data: {
        company,
        role,
        interview: aiResponse,
      },
    });

  } catch (error) {
    console.error("Generate mock interview error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Server error while generating mock interview",
    });
  }
};

module.exports = { generateMockInterview };
