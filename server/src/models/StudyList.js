const mongoose = require("mongoose");

const studyListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Study list name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User",
    },
    problems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const StudyList = mongoose.model("StudyList", studyListSchema);

module.exports = StudyList;