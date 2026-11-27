const Review = require("../Model/ReviewSchema");
const User = require("../Model/user");
const Booking = require("../Model/BookingSchema");

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const doctorId = req.params.id;

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }

    const doctor = await User.findOne({
      _id: doctorId,
      role: { $in: ["doctor", "doctors"] },
    });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const visited = await Booking.findOne({
      doctor: doctorId,
      user: req.user._id,
      status: { $in: ["confirmed", "completed"] },
    });
    if (!visited) {
      return res.status(403).json({ message: "You can review a doctor after booking an appointment" });
    }

    const review = await Review.create({
      doctor: doctorId,
      user: req.user._id,
      rating: Number(rating),
      comment,
    });

    const stats = await Review.aggregate([
      { $match: { doctor: doctor._id } },
      { $group: { _id: "$doctor", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    doctor.averageRating = Number(stats[0].avg.toFixed(1));
    doctor.totalRating = stats[0].count;
    await doctor.save();

    const populated = await Review.findById(review._id).populate("user", "fullName profilePic");
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addReview };
