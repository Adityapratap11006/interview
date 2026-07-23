const express = require("express");
const router = express.Router();

const {
  createStudyList,
  getStudyLists,
  getStudyListById,
  updateStudyList,
  deleteStudyList,
  addProblemToStudyList,
  removeProblemFromStudyList,
} = require("../controllers/studyListController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, createStudyList);
router.get("/", protect, getStudyLists);
router.get("/:id", protect, getStudyListById);
router.patch("/:id", protect, updateStudyList);
router.delete("/:id", protect, deleteStudyList);
router.post("/:id/problems", protect, addProblemToStudyList);
router.delete("/:id/problems/:problemId", protect, removeProblemFromStudyList);

module.exports = router;
