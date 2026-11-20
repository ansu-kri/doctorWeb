const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    role: {
      type: String,
      enum: ["patient", "admin", "doctors"],
      default: "patient",
    },
    gender: { type: String, enum: ["male", "female", "other", ""], default: "" },
    bloodType: { type: String, default: "" },
    specialization: { type: String, default: "" },
    qualifications: { type: [String], default: [] },
    experiences: { type: [String], default: [] },
    bio: { type: String, default: "" },
    about: { type: String, default: "" },
    ticketPrice: { type: Number, default: 500 },
    timeSlots: {
      type: [
        {
          day: String,
          startTime: String,
          endTime: String,
        },
      ],
      default: [],
    },
    location: { type: String, default: "" },
    hospital: { type: String, default: "" },
    averageRating: { type: Number, default: 0 },
    totalRating: { type: Number, default: 0 },
    isApproved: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
    isAvailable: { type: Boolean, default: true },
    medicalHistory: {
      type: [
        {
          title: String,
          date: Date,
          notes: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
