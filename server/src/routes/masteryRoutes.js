const express = require("express");
const router = express.Router();

const { getTopicMastery } = require("../controllers/masteryController");
const protect = require("../middleware/authMiddleware");

router.get("/topics", protect, getTopicMastery);

module.exports = router;