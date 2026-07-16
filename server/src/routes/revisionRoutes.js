const express = require("express");
const router = express.Router();

const {
  createRevision,
  getRevisions,
  getDueRevisions,
  completeRevision,
  deleteRevision,
} = require("../controllers/revisionController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, createRevision);
router.get("/", protect, getRevisions);
router.get("/due", protect, getDueRevisions);
router.patch("/:id/complete", protect, completeRevision);
router.delete("/:id", protect, deleteRevision);

module.exports = router;