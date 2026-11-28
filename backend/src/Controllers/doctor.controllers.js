const User = require("../Model/user");
const Booking = require("../Model/BookingSchema");
const { startOfDay } = require("../utils/slots");

const getDoctorStats = async (req, res) => {
  try {
    const doctorId = req.user._id;

    const today = startOfDay(new Date());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      todaysAppointments,
      upcomingAppointments,
      pendingRequests,
      completedAppointments,
      cancelledAppointments,
      todaysList,
    ] = await Promise.all([
      Booking.countDocuments({
        doctor: doctorId,
        appointmentDate: { $gte: today, $lt: tomorrow },
      }),
      Booking.countDocuments({
        doctor: doctorId,
        appointmentDate: { $gte: tomorrow },
        status: { $in: ["pending", "confirmed"] },
      }),
      Booking.countDocuments({
        doctor: doctorId,
        status: "pending",
      }),
      Booking.countDocuments({
        doctor: doctorId,
        status: "completed",
      }),
      Booking.countDocuments({
        doctor: doctorId,
        status: "cancelled",
      }),
      Booking.find({
        doctor: doctorId,
        appointmentDate: { $gte: today, $lt: tomorrow },
      })
        .populate("user", "fullName email phone profilePic gender")
        .sort({ timeSlot: 1 }),
    ]);

    const uniqueUsers = await Booking.distinct("user", { doctor: doctorId });

    res.status(200).json({
      success: true,
      data: {
        totalPatients: uniqueUsers.length,
        todaysAppointments,
        upcomingAppointments,
        pendingRequests,
        completedAppointments,
        cancelledAppointments,
        todaysAppointmentsList: todaysList,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { status, search, date, page = "1", limit = "20" } = req.query;

    const query = { doctor: doctorId };

    if (status) query.status = status;
    if (date) {
      const day = startOfDay(date);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);
      query.appointmentDate = { $gte: day, $lt: nextDay };
    }

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(limit) || 20));

    const [items, total] = await Promise.all([
      Booking.find(query)
        .populate("user", "fullName email phone profilePic gender")
        .sort({ appointmentDate: 1, timeSlot: 1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize),
      Booking.countDocuments(query),
    ]);

    let filtered = items;
    if (search) {
      const escaped = String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      filtered = items.filter(
        (item) =>
          regex.test(item.patientName || "") ||
          regex.test(item.user.fullName || "") ||
          regex.test(item.user.email || "")
      );
    }

    res.status(200).json({
      success: true,
      data: filtered,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total: filtered.length,
        pages: Math.ceil(filtered.length / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorPatients = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { page = "1", limit = "20", search } = req.query;

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(limit) || 20));

    const appointments = await Booking.find({ doctor: doctorId })
      .populate("user", "fullName email phone profilePic gender")
      .sort({ appointmentDate: -1 });

    const patientMap = new Map();
    appointments.forEach((appt) => {
      const user = appt.user;
      if (!user) return;
      const key = String(user._id);
      if (!patientMap.has(key)) {
        patientMap.set(key, {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          profilePic: user.profilePic,
          gender: user.gender,
          totalAppointments: 0,
          statuses: [],
          lastAppointment: appt.appointmentDate,
        });
      }
      const p = patientMap.get(key);
      p.totalAppointments += 1;
      p.statuses.push(appt.status);
      if (new Date(appt.appointmentDate) > new Date(p.lastAppointment)) {
        p.lastAppointment = appt.appointmentDate;
      }
    });

    let patients = Array.from(patientMap.values());

    if (search) {
      const escaped = String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      patients = patients.filter(
        (p) => regex.test(p.fullName) || regex.test(p.email)
      );
    }

    const total = patients.length;
    const paginated = patients.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );

    res.status(200).json({
      success: true,
      data: paginated,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorAvailability = async (req, res) => {
  try {
    const doctor = await User.findById(req.user._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        timeSlots: doctor.timeSlots || [],
        isAvailable: doctor.isAvailable,
        isApproved: doctor.isApproved,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDoctorAvailability = async (req, res) => {
  try {
    const { timeSlots, isAvailable } = req.body;

    const doctor = await User.findById(req.user._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (timeSlots !== undefined) {
      if (!Array.isArray(timeSlots)) {
        return res.status(400).json({ message: "timeSlots must be an array" });
      }
      for (const slot of timeSlots) {
        if (!slot.day || !slot.startTime || !slot.endTime) {
          return res
            .status(400)
            .json({ message: "Each time slot must have day, startTime, and endTime" });
        }
        const start = slot.startTime.split(":").map(Number);
        const end = slot.endTime.split(":").map(Number);
        if (start[0] > end[0] || (start[0] === end[0] && start[1] >= end[1])) {
          return res
            .status(400)
            .json({ message: "Start time must be before end time" });
        }
      }
      doctor.timeSlots = timeSlots;
    }

    if (isAvailable !== undefined) {
      doctor.isAvailable = Boolean(isAvailable);
    }

    await doctor.save();

    res.status(200).json({
      success: true,
      data: {
        timeSlots: doctor.timeSlots,
        isAvailable: doctor.isAvailable,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const allowed = [
      "fullName",
      "phone",
      "gender",
      "bloodType",
      "bio",
      "about",
      "location",
      "hospital",
      "specialization",
      "qualifications",
      "experiences",
      "ticketPrice",
    ];

    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    if (updates.ticketPrice !== undefined) {
      updates.ticketPrice = Number(updates.ticketPrice);
    }

    ["qualifications", "experiences"].forEach((field) => {
      if (typeof updates[field] === "string") {
        try {
          updates[field] = JSON.parse(updates[field]);
        } catch {
          updates[field] = updates[field]
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);
        }
      }
    });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    delete updates.role;
    delete updates.isActive;
    delete updates.isApproved;
    delete updates.password;
    delete updates._id;

    Object.assign(user, updates);
    await user.save();

    const publicUser = (u) => ({
      _id: u._id,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      profilePic: u.profilePic,
      gender: u.gender,
      phone: u.phone,
      bloodType: u.bloodType,
      specialization: u.specialization,
      qualifications: u.qualifications,
      experiences: u.experiences,
      bio: u.bio,
      about: u.about,
      ticketPrice: u.ticketPrice,
      timeSlots: u.timeSlots,
      location: u.location,
      hospital: u.hospital,
      averageRating: u.averageRating,
      totalRating: u.totalRating,
      isApproved: u.isApproved,
      isAvailable: u.isAvailable,
    });

    res.status(200).json({
      success: true,
      data: publicUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDoctorStats,
  getDoctorAppointments,
  getDoctorPatients,
  getDoctorAvailability,
  updateDoctorAvailability,
  updateDoctorProfile,
};