const express = require("express");
const router = express.Router();

const {
  createCompanySheet,
  getCompanySheets,
  getCompanySheetById,
  addProblemToCompanySheet,
  removeProblemFromCompanySheet,
} = require("../controllers/companySheetController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, createCompanySheet);
router.get("/", protect, getCompanySheets);
router.get("/:id", protect, getCompanySheetById);
router.patch("/:id/add-problem", protect, addProblemToCompanySheet);
router.patch("/:id/remove-problem", protect, removeProblemFromCompanySheet);

module.exports = router;