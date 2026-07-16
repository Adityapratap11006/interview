const express = require("express");
const router = express.Router();

const { getHeatmap } = require("../controllers/heatmapController");
const protect = require("../middleware/authMiddleware");

router.get("/heatmap", protect, getHeatmap);

module.exports = router;