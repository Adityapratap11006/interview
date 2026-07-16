const express = require("express");
const router = express.Router();

const {
  createDailyGoal,
  getTodaysGoal,
  updateGoalProgress,
  getGoalHistory,
  deleteGoal,
} = require("../controllers/goalController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, createDailyGoal);
router.get("/today", protect, getTodaysGoal);
router.patch("/progress", protect, updateGoalProgress);
router.get("/history", protect, getGoalHistory);
router.delete("/:id", protect, deleteGoal);

module.exports = router;