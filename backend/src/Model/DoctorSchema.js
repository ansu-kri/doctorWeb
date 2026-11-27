const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  photo: { type: String },
  photoPublicId: { type: String, default: "" },
  ticketPrice: { type: Number },
  role: { type: String },
  specialization: { type: String },
  qualifications: { type: Array },
  experiences: { type: Array },
  bio: { type: String },
  about: { type: String },
  timeSlots: { type: Array },
  reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  averageRating: { type: Number, default: 0 },
  totalRating: { type: Number, default: 0 },
  isApproved: {
    type: String,
    enum: ["pending", "approved", "cancelled"],
    default: "pending",
  },
});

module.exports = mongoose.model("Doctor", DoctorSchema);
