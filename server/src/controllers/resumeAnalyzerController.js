"use strict";

const axios = require("axios");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const analyzeResume = async (req, res) => {
  try {
    const { targetCompany, targetRole } = req.body;
    let resumeText = req.body.resumeText;

    if (!targetCompany || !targetRole) {
      return res.status(400).json({
        success: false,
        message: "Target company and target role are required",
      });
    }

    if (!resumeText && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Either resume text or a PDF resume file is required",
      });
    }

    // Process PDF if resumeText is missing
    if (!resumeText && req.file) {
      try {
        const pdfData = await pdfParse(req.file.buffer);
        resumeText = pdfData.text.trim();
        
        if (!resumeText) {
          return res.status(400).json({
            success: false,
            message: "Uploaded PDF contains no readable text",
          });
        }
      } catch (parseError) {
        console.error("PDF Parsing error:", parseError);
        return res.status(400).json({
          success: false,
          message: "Failed to parse the PDF file. Please ensure it is a valid PDF.",
        });
      }
    }

    const port = process.env.PORT || 3000;
    const baseUrl = `http://localhost:${port}/api`;
    const authHeader = { Authorization: `Bearer ${req.headers.authorization?.split(" ")[1]}` };

    // Fetch data concurrently
    const [profileRes, topicsRes, weeklyRes] = await Promise.all([
      axios.get(`${baseUrl}/learning-profile`, { headers: authHeader }).catch(() => ({ data: { learningProfile: null } })),
      axios.get(`${baseUrl}/topics`, { headers: authHeader }).catch(() => ({ data: { topics: [] } })),
      axios.get(`${baseUrl}/weekly`, { headers: authHeader }).catch(() => ({ data: { analytics: null } }))
    ]);

    const profile = profileRes.data.learningProfile;
    const topics = topicsRes.data.topics || [];
    const weekly = weeklyRes.data.analytics;

    const totalSolved = profile?.dsaProfile?.totalSolved || 0;
    const strongTopics = profile?.dsaProfile?.strongTopics?.join(", ") || "None identified yet";
    const weakTopics = profile?.dsaProfile?.weakTopics?.join(", ") || "None identified yet";
    
    let weeklyConsistency = "Not enough data";
    if (weekly && weekly.goals) {
      weeklyConsistency = `${weekly.goals.completionPercentage}% goal completion, ${weekly.revisionsCompleted} revisions completed this week. Total weekly DSA time: ${weekly.timeSpentMinutes} mins.`;
    }

    const masteryString = topics.length > 0 
      ? topics.map(t => `${t.topic}: ${t.solvedProblems} solved (${t.masteryPercentage}% mastery)`).join("\n") 
      : "No detailed mastery data";

    const prompt = `You are an expert technical recruiter and hiring manager at ${targetCompany}.
You are reviewing a candidate for the role of ${targetRole}.

Below is the candidate's Resume:
---
${resumeText}
---

The candidate has been preparing using our platform (PrepPilot). Here is their current progress:
- Total DSA problems solved: ${totalSolved}
- Strong Topics: ${strongTopics}
- Weak Topics: ${weakTopics}
- Weekly Consistency: ${weeklyConsistency}
- Detailed Topic Mastery:
${masteryString}

Analyze the resume together with their PrepPilot progress. 
Generate a comprehensive analysis covering:
1. Overall Resume Score (0-100)
2. ATS Score (0-100)
3. Strengths
4. Weaknesses
5. Missing Skills (compare resume to role expectations)
6. Missing Projects (suggest project ideas if they lack practical experience)
7. Missing Keywords
8. Resume Improvements (specific actionable tips)
9. DSA Readiness (based on their PrepPilot progress vs ${targetCompany} standards)
10. Interview Readiness (overall)
11. Personalized Action Plan
12. Final Suggestions

CRITICAL RULES:
- Do NOT rewrite the resume. Only analyze it and provide feedback.
- Format the response beautifully using Markdown.
`;

    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const aiResponse = geminiResponse.data.candidates[0]?.content?.parts[0]?.text || "No analysis generated.";

    res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: {
        targetCompany,
        targetRole,
        analysis: aiResponse,
      },
    });

  } catch (error) {
    console.error("Resume analysis error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Server error while analyzing resume",
    });
  }
};

module.exports = { analyzeResume };
