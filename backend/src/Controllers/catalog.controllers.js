const Specialty = require("../Model/Specialty");
const Service = require("../Model/Service");
const Contact = require("../Model/Contact");
const User = require("../Model/user");

const getSpecialties = async (req, res) => {
  const items = await Specialty.find({ isActive: true }).sort({ name: 1 });
  res.status(200).json({ success: true, data: items });
};

const getServices = async (req, res) => {
  const items = await Service.find({ isActive: true }).sort({ name: 1 });
  res.status(200).json({ success: true, data: items });
};

const getStats = async (req, res) => {
  const [doctors, patients] = await Promise.all([
    User.countDocuments({ role: { $in: ["doctor", "doctors"] }, isApproved: { $ne: "cancelled" }, isActive: { $ne: false } }),
    User.countDocuments({ role: "patient" }),
  ]);
  res.status(200).json({
    success: true,
    data: {
      doctors,
      patients,
    },
  });
};

const createContact = async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!email || !subject || !message) {
    return res.status(400).json({ message: "Email, subject, and message are required" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  const saved = await Contact.create({ name: name || "", email, subject, message });
  res.status(201).json({ success: true, data: { _id: saved._id } });
};

module.exports = { getSpecialties, getServices, getStats, createContact };
