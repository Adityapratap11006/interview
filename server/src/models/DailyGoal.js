const mongoose = require("mongoose");

const dailyGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User",
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: () => new Date(),
    },
    problemsTarget: {
      type: Number,
      default: 0,
      min: [0, "Problems target cannot be negative"],
    },
    problemsCompleted: {
      type: Number,
      default: 0,
      min: [0, "Problems completed cannot be negative"],
    },
    timeTargetMinutes: {
      type: Number,
      default: 0,
      min: [0, "Time target cannot be negative"],
    },
    timeCompletedMinutes: {
      type: Number,
      default: 0,
      min: [0, "Time completed cannot be negative"],
    },
    revisionTarget: {
      type: Number,
      default: 0,
      min: [0, "Revision target cannot be negative"],
    },
    revisionCompleted: {
      type: Number,
      default: 0,
      min: [0, "Revision completed cannot be negative"],
    },
    status: {
      type: String,
      enum: {
        values: ["Active", "Completed"],
        message: "Status must be either Active or Completed",
      },
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const DailyGoal = mongoose.model("DailyGoal", dailyGoalSchema);

module.exports = DailyGoal;