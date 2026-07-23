const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Problem title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    leetcodeLink: {
      type: String,
      required: [true, "LeetCode link is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return (
            v === "" ||
            /^(https?:\/\/)?(www\.)?leetcode\.com\/problems\/[a-zA-Z0-9-]+$/.
              test(v)
          );
        },
        message: "Invalid LeetCode link format",
      },
    },
    difficulty: {
      type: String,
      required: [true, "Difficulty is required"],
      enum: {
        values: ["Easy", "Medium", "Hard"],
        message: "Difficulty must be Easy, Medium, or Hard",
      },
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
      trim: true,
      maxlength: [50, "Topic cannot exceed 50 characters"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ["Not Started", "In Progress", "Solved"],
        message: "Status must be one of: Not Started, In Progress, Solved",
      },
      default: "Not Started",
    },
    notes: {
      type: String,
      default: "",
    },
    timeSpentMinutes: {
      type: Number,
      default: 0,
      min: [0, "Time spent cannot be negative"],
    },
    language: {
      type: String,
      default: "",
      trim: true,
    },
    attemptCount: {
      type: Number,
      default: 1,
      min: [1, "Attempt count must be at least 1"],
    },
    revisionCount: {
      type: Number,
      default: 0,
      min: [0, "Revision count cannot be negative"],
    },
    solvedAt: {
      type: Date,
      default: null,
    },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User ID is required"],
    ref: "User",
  },
  },
  {
    timestamps: true,
  }
);

const Problem = mongoose.model("Problem", problemSchema);

module.exports = Problem;