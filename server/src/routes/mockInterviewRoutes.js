"use strict";

const express = require("express");
const router = express.Router();

const { generateMockInterview } = require("../controllers/mockInterviewController");
const protect = require("../middleware/authMiddleware");

router.post("/mock-interview", protect, generateMockInterview);

module.exports = router;
