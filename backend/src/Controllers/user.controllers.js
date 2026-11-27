const User = require("../Model/user");
const Booking = require("../Model/BookingSchema");
const Review = require("../Model/ReviewSchema");
const { publicUser } = require("./auth.controllers");
const { generateSlotsForDate, startOfDay } = require("../utils/slots");

const doctorFilter = { role: { $in: ["doctor", "doctors"] }, isApproved: { $ne: "cancelled" }, isActive: { $ne: false } };

const getAlldoctors = async (req, res) => {
  try {
    const { search, specialization, location, available } = req.query;
    const query = { ...doctorFilter };

    if (specialization) {
      query.specialization = new RegExp(specialization, "i");
    }
    if (location) {
      query.$or = [
        { location: new RegExp(location, "i") },
        { hospital: new RegExp(location, "i") },
      ];
    }
    if (available === "true") query.isAvailable = true;
    if (search) {
      query.$and = [
        ...(query.$and || []),
        {
          $or: [
            { fullName: new RegExp(search, "i") },
            { specialization: new RegExp(search, "i") },
            { hospital: new RegExp(search, "i") },
            { location: new RegExp(search, "i") },
          ],
        },
      ];
    }

    const doctors = await User.find(query)
      .select("-password -profilePicPublicId")
      .sort({ averageRating: -1 });
    res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findOne({
      _id: req.params.id,
      role: { $in: ["doctor", "doctors"] },
    }).select("-password -profilePicPublicId");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const reviews = await Review.find({ doctor: doctor._id })
      .populate("user", "fullName profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { ...publicUser(doctor), reviews } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date is required" });

    const doctor = await User.findOne({
      _id: req.params.id,
      role: { $in: ["doctor", "doctors"] },
    });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const requested = startOfDay(date);
    const today = startOfDay(new Date());
    if (requested < today) {
      return res.status(200).json({ success: true, data: [] });
    }

    const allSlots = generateSlotsForDate(doctor.timeSlots, requested);
    const nextDay = new Date(requested);
    nextDay.setDate(nextDay.getDate() + 1);

    const booked = await Booking.find({
      doctor: doctor._id,
      appointmentDate: { $gte: requested, $lt: nextDay },
      status: { $in: ["pending", "confirmed"] },
    }).select("timeSlot");

    const taken = new Set(booked.map((b) => b.timeSlot));
    const open = allSlots.filter((slot) => !taken.has(slot));

    res.status(200).json({ success: true, data: open });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAlldoctors, getDoctorById, getAvailability };
