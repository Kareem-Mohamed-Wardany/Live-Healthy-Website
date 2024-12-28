const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
  },
  vip: {
    level: {
      type: String,
      default: "Basic",
    },
    expireDate: {
      type: String,
      default: null,
    },
  },
  centerID: {
    type: Schema.Types.ObjectId,
    ref: "Radiology Center",
  },
  docData: {
    university: {
      type: String,
    },
    IDFront: {
      type: String,
    },
    IDBack: {
      type: String,
    },
    ProfFront: {
      type: String,
    },
    ProfBack: {
      type: String,
    },
    verified: {
      type: Boolean,
    },
  },
  suspension: {
    suspensionType: { type: String },
    suspensionDate: { type: Date },
    suspensionReason: { type: String },
  },
  healthStatus: {
    bloodType: { type: String },
    smoker: { type: Boolean },
    HeartDiseases: { type: Boolean },
    Diabetes: { type: Boolean },
    Cancer: { type: Boolean },
    Obesity: { type: Boolean },
    Hypertension: { type: Boolean },
    Allergies: { type: Boolean },
  },
});

module.exports = mongoose.model("User", userSchema);
