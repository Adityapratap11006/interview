const mongoose = require("mongoose");

const revisionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User",
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Problem ID is required"],
      ref: "Problem",
    },
    nextRevisionDate: {
      type: Date,
      required: [true, "Next revision date is required"],
    },
    revisionCount: {
      type: Number,
      default: 0,
      min: [0, "Revision count cannot be negative"],
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Completed"],
        message: "Status must be either Pending or Completed",
      },
      default: "Pending",
    },
    lastRevisedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Revision = mongoose.model("Revision", revisionSchema);

module.exports = Revision;