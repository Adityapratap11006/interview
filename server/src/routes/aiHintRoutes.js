"use strict";

const express = require("express");
const router = express.Router();

const { generateAiHint } = require("../controllers/aiHintController");
const protect = require("../middleware/authMiddleware");

router.post("/hint", protect, generateAiHint);

module.exports = router;