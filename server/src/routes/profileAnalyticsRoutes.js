const express = require("express");
const router = express.Router();

const { getLearningProfile } = require("../controllers/profileAnalyticsController");
const protect = require("../middleware/authMiddleware");

router.get("/learning-profile", protect, getLearningProfile);

module.exports = router;