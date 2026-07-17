"use strict";

const axios = require("axios");
const Problem = require("../models/Problem");

const generateAiHint = async (req, res) => {
  try {
    const { problemId, userCode, userApproach } = req.body;
    const userId = req.user._id;

    if (!problemId) {
      return res.status(400).json({
        success: false,
        message: "Problem ID is required",
      });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    if (!problem.user.equals(userId)) {
      return res.status(403).json({\n        success: false,\n        message: "Access denied",\n      });\n    }

    const learningProfileResponse = await axios.get(
      `http://localhost:3000/api/learning-profile`,
      {
        headers: { Authorization: `Bearer ${req.headers.authorization.split(" ")[1]}` },
      }
    );

    const learningProfile = learningProfileResponse.data.learningProfile;

    const prompt = `You are an experienced DSA mentor.

The student has solved ${learningProfile.dsaProfile.totalSolved} problems.

Strong topics:
${learningProfile.dsaProfile.strongTopics.join(", ")}

Weak topics:
${learningProfile.dsaProfile.weakTopics.join(", ")}

Current problem:

Title:
${problem.title}

Difficulty:
${problem.difficulty}

Topic:
${problem.topic}

Notes:
${problem.notes}

Status:
${problem.status}

Attempt count:
${problem.attemptCount}

Revision count:
${problem.revisionCount}

Student approach:
${userApproach || "Not provided"}

Student code:
${userCode || "Not provided"}

Provide:
- Hint Level 1
- Hint Level 2
- Hint Level 3
- Common mistake
- Concept to revise

Do NOT reveal the final algorithm or complete code.

Never reveal the full solution.
Never provide complete code.
Give progressive hints.
Encourage independent thinking.
Explain concepts if needed.
Mention common mistakes.
Personalize hints using weak/strong topics.`;

    try {
      const geminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,\n        {\n          contents: [{ parts: [{ text: prompt }] }]\n        }\n      );\n\n      const aiResponse = geminiResponse.data.candidates[0]?.content?.parts[0]?.text || "No response from AI.";

      res.status(200).json({\n        success: true,\n        message: "AI hints generated successfully",\n        data: {\n          problem: {\n            id: problem._id,\n            title: problem.title,\n            difficulty: problem.difficulty,\n            topic: problem.topic,\n          },\n          aiResponse,\n        },\n      });\n    } catch (geminiError) {\n      console.error("Gemini API error:", geminiError.response?.data || geminiError.message);\n\n      return res.status(500).json({\n        success: false,\n        message: "Failed to generate AI hints",\n      });\n    }\n  } catch (error) {\n    console.error("Generate AI hint error:", error);\n\n    if (error.code === 404) {\n      return res.status(404).json({\n        success: false,\n        message: "Problem not found",\n      });\n    }\n\n    return res.status(500).json({\n      success: false,\n      message: "Server error while generating AI hint",\n    });\n  }\n};\n\nmodule.exports = { generateAiHint };