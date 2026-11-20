const Booking = require("../Model/BookingSchema");
const User = require("../Model/user");
const { generateSlotsForDate, startOfDay } = require("../utils/slots");
const { notifyUser } = require("../utils/notify");

const isSlotOpen = async (doctor, date, timeSlot, ignoreId) => {
  const day = startOfDay(date);
  const slots = generateSlotsForDate(doctor.timeSlots, day);
  if (!slots.includes(timeSlot)) return false;

  const nextDay = new Date(day);
  nextDay.setDate(nextDay.getDate() + 1);

  const clash = await Booking.findOne({
    doctor: doctor._id,
    appointmentDate: { $gte: day, $lt: nextDay },
    timeSlot,
    status: { $in: ["pending", "confirmed"] },
    ...(ignoreId ? { _id: { $ne: ignoreId } } : {}),
  });

  return !clash;
};

const createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, timeSlot, consultationType, patientName, phone, notes } =
      req.body;

    if (!doctorId || !appointmentDate || !timeSlot || !patientName || !phone) {
      return res.status(400).json({ message: "Missing required booking fields" });
    }

    const doctor = await User.findOne({ _id: doctorId, role: "doctors" });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    if (!doctor.isAvailable) {
      return res.status(400).json({ message: "Doctor is not currently available" });
    }

    const requested = startOfDay(appointmentDate);
    if (requested < startOfDay(new Date())) {
      return res.status(400).json({ message: "Cannot book a past date" });
    }

    const open = await isSlotOpen(doctor, requested, timeSlot);
    if (!open) {
      return res.status(409).json({ message: "This time slot is no longer available" });
    }

    const booking = await Booking.create({
      doctor: doctor._id,
      user: req.user._id,
      ticketPrice: doctor.ticketPrice || 500,
      appointmentDate: requested,
      timeSlot,
      consultationType: consultationType === "online" ? "online" : "in-person",
      patientName,
      phone,
      notes: notes || "",
      status: "confirmed",
    });

    await notifyUser({
      user: req.user._id,
      title: "Appointment confirmed",
      message: `Your ${consultationType || "in-person"} visit with ${doctor.fullName} is booked for ${timeSlot}.`,
      appointment: booking._id,
    });
    await notifyUser({
      user: doctor._id,
      title: "New appointment",
      message: `${patientName} booked a ${timeSlot} slot.`,
      appointment: booking._id,
    });

    const populated = await Booking.findById(booking._id)
      .populate("doctor", "-password")
      .populate("user", "fullName email phone profilePic");

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const myAppointments = async (req, res) => {
  try {
    const filter =
      req.user.role === "doctors" ? { doctor: req.user._id } : { user: req.user._id };

    const items = await Booking.find(filter)
      .populate("doctor", "-password")
      .populate("user", "fullName email phone profilePic gender")
      .sort({ appointmentDate: 1, timeSlot: 1 });

    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Appointment not found" });

    const isOwner = String(booking.user) === String(req.user._id);
    const isDoctor = String(booking.doctor) === String(req.user._id);
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isDoctor && !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { status, appointmentDate, timeSlot } = req.body;

    if (status === "cancelled") {
      booking.status = "cancelled";
    } else if (appointmentDate && timeSlot) {
      const doctor = await User.findById(booking.doctor);
      const requested = startOfDay(appointmentDate);
      if (requested < startOfDay(new Date())) {
        return res.status(400).json({ message: "Cannot reschedule to a past date" });
      }
      const open = await isSlotOpen(doctor, requested, timeSlot, booking._id);
      if (!open) {
        return res.status(409).json({ message: "This time slot is no longer available" });
      }
      booking.appointmentDate = requested;
      booking.timeSlot = timeSlot;
      booking.status = "confirmed";
    } else if (status && isAdmin) {
      booking.status = status;
    } else {
      return res.status(400).json({ message: "Invalid update" });
    }

    await booking.save();

    await notifyUser({
      user: booking.user,
      title: booking.status === "cancelled" ? "Appointment cancelled" : "Appointment updated",
      message:
        booking.status === "cancelled"
          ? "Your appointment was cancelled."
          : `Your appointment is now ${booking.timeSlot} on ${startOfDay(booking.appointmentDate).toDateString()}.`,
      appointment: booking._id,
    });

    const populated = await Booking.findById(booking._id)
      .populate("doctor", "-password")
      .populate("user", "fullName email phone profilePic");

    res.status(200).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAppointment, myAppointments, updateAppointmentStatus };
