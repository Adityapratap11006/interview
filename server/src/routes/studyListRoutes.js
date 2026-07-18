const express = require("express");
const router = express.Router();

const {
  createStudyList,
  getStudyLists,
  getStudyListById,
  addProblemToStudyList,
  removeProblemFromStudyList,
} = require("../controllers/studyListController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, createStudyList);
router.get("/", protect, getStudyLists);
router.get("/:id", protect, getStudyListById);
router.patch("/:id/add-problem", protect, addProblemToStudyList);
router.patch("/:id/remove-problem", protect, removeProblemFromStudyList);

module.exports = router;