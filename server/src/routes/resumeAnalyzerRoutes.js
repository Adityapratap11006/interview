"use strict";

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Configure multer for PDF uploads using memory storage (max 5MB)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "application/pdf" || path.extname(file.originalname).toLowerCase() === ".pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"));
    }
  },
});

const { analyzeResume } = require("../controllers/resumeAnalyzerController");
const protect = require("../middleware/authMiddleware");

// Handle multer errors
const uploadMiddleware = (req, res, next) => {
  upload.single("resume")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

router.post("/resume-analyzer", protect, uploadMiddleware, analyzeResume);

module.exports = router;
