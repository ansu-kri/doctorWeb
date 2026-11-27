const User = require("../Model/user");
const Booking = require("../Model/BookingSchema");
const Specialty = require("../Model/Specialty");
const Service = require("../Model/Service");
const bcrypt = require("bcrypt");
const { publicUser } = require("./auth.controllers");

const dashboard = async (req, res) => {
  try {
  const doctorRoles = { $in: ["doctor", "doctors"] };
  const [patients, doctors, appointments, pending, confirmed, cancelled, completed, recentAppointments, recentUsers] =
    await Promise.all([
      User.countDocuments({ role: "patient" }),
      User.countDocuments({ role: doctorRoles }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.countDocuments({ status: "cancelled" }),
      Booking.countDocuments({ status: "completed" }),
      Booking.find()
        .populate("doctor", "fullName specialization")
        .populate("user", "fullName email")
        .sort({ createdAt: -1 })
        .limit(5),
      User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

  const since = new Date();
  since.setDate(since.getDate() - 13);
  since.setHours(0, 0, 0, 0);

  const trend = await Booking.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      patients,
      doctors,
      appointments,
      status: { pending, confirmed, cancelled, completed },
      trend,
      recentAppointments,
      recentUsers,
    },
  });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listUsers = async (req, res) => {
  try {
    const { role, search, isActive, page = "1", limit = "20" } = req.query;
    const query = {};
    if (role === "doctor") query.role = { $in: ["doctor", "doctors"] };
    else if (role) query.role = role;
    if (isActive === "true") query.isActive = true;
    if (isActive === "false") query.isActive = false;
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { fullName: new RegExp(escaped, "i") },
        { email: new RegExp(escaped, "i") },
        { specialization: new RegExp(escaped, "i") },
      ];
    }
    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(limit) || 20));
    const [users, total] = await Promise.all([
      User.find(query).select("-password").sort({ createdAt: -1 }).skip((pageNumber - 1) * pageSize).limit(pageSize),
      User.countDocuments(query),
    ]);
    res.status(200).json({ success: true, data: users, pagination: { page: pageNumber, limit: pageSize, total, pages: Math.ceil(total / pageSize) } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      fullName, email, password, role, gender, specialization, hospital,
      location, ticketPrice, qualifications, experiences, bio, about,
      timeSlots, isAvailable,
    } = req.body;
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "Name, email, password, and role are required" });
    }
    if (!["patient", "doctor", "doctors", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const normalizedEmail = email.toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const normalizedRole = role === "doctors" ? "doctor" : role;
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashed,
      role: normalizedRole,
      gender: gender || "other",
      specialization: specialization || "",
      hospital: hospital || "",
      location: location || "",
      ticketPrice: ticketPrice === "" || ticketPrice === undefined ? 500 : Number(ticketPrice),
      qualifications: Array.isArray(qualifications) ? qualifications : [],
      experiences: Array.isArray(experiences) ? experiences : [],
      bio: bio || "",
      about: about || "",
      timeSlots: Array.isArray(timeSlots) ? timeSlots : [],
      isAvailable: typeof isAvailable === "boolean" ? isAvailable : true,
      isActive: true,
      isApproved: normalizedRole === "doctor" ? "approved" : "approved",
    });
    res.status(201).json({ success: true, data: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.password;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;
    if (updates.role === "doctors") updates.role = "doctor";
    if (updates.role && !["patient", "doctor", "admin"].includes(updates.role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (updates.email) {
      updates.email = updates.email.toLowerCase().trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      const duplicate = await User.findOne({ email: updates.email, _id: { $ne: req.params.id } });
      if (duplicate) return res.status(400).json({ message: "Email already exists" });
    }
    if (req.body.password) {
      if (String(req.body.password).length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      updates.password = await bcrypt.hash(req.body.password, 10);
    }
    if (updates.ticketPrice !== undefined) updates.ticketPrice = Number(updates.ticketPrice);
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({ message: "You cannot delete your own admin account" });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await Booking.deleteMany({
      $or: [{ user: user._id }, { doctor: user._id }],
    });
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listAppointments = async (req, res) => {
  try {
    const { status, search, page = "1", limit = "20" } = req.query;
    const query = {};
    if (status) query.status = status;
    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(limit) || 20));
    const [items, total] = await Promise.all([
      Booking.find(query)
        .populate("doctor", "fullName specialization ticketPrice")
        .populate("user", "fullName email phone")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize),
      Booking.countDocuments(query),
    ]);
    const filtered = search
      ? items.filter((item) =>
          `${item.patientName} ${item.doctor?.fullName || ""} ${item.user?.email || ""}`
            .toLowerCase()
            .includes(String(search).toLowerCase())
        )
      : items;
    res.status(200).json({
      success: true,
      data: filtered,
      pagination: { page: pageNumber, limit: pageSize, total, pages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid appointment status" });
    }
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate("doctor", "fullName specialization").populate("user", "fullName email");
    if (!booking) return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listSpecialties = async (req, res) => {
  const items = await Specialty.find().sort({ name: 1 });
  res.status(200).json({ success: true, data: items });
};

const saveSpecialty = async (req, res) => {
  const { name, description, icon, isActive } = req.body;
  if (!name || !description) return res.status(400).json({ message: "Name and description required" });
  if (req.params.id) {
    const item = await Specialty.findByIdAndUpdate(
      req.params.id,
      { name, description, icon, isActive },
      { new: true, runValidators: true }
    );
    return res.status(200).json({ success: true, data: item });
  }
  const item = await Specialty.create({ name, description, icon, isActive });
  res.status(201).json({ success: true, data: item });
};

const deleteSpecialty = async (req, res) => {
  await Specialty.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true });
};

const listServices = async (req, res) => {
  const items = await Service.find().sort({ name: 1 });
  res.status(200).json({ success: true, data: items });
};

const saveService = async (req, res) => {
  const { name, description, category, icon, isActive } = req.body;
  if (!name || !description) return res.status(400).json({ message: "Name and description required" });
  if (req.params.id) {
    const item = await Service.findByIdAndUpdate(
      req.params.id,
      { name, description, category, icon, isActive },
      { new: true, runValidators: true }
    );
    return res.status(200).json({ success: true, data: item });
  }
  const item = await Service.create({ name, description, category, icon, isActive });
  res.status(201).json({ success: true, data: item });
};

const deleteService = async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true });
};

module.exports = {
  dashboard,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  listAppointments,
  updateAppointment,
  listSpecialties,
  saveSpecialty,
  deleteSpecialty,
  listServices,
  saveService,
  deleteService,
};
