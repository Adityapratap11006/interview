const mongoose = require("mongoose");

const companySheetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sheet name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
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

const CompanySheet = mongoose.model("CompanySheet", companySheetSchema);

module.exports = CompanySheet;