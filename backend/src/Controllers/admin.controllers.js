const User = require("../Model/user");
const Booking = require("../Model/BookingSchema");
const Specialty = require("../Model/Specialty");
const Service = require("../Model/Service");
const bcrypt = require("bcrypt");
const { publicUser } = require("./auth.controllers");

const dashboard = async (req, res) => {
  const [patients, doctors, appointments, pending, confirmed, cancelled, completed] =
    await Promise.all([
      User.countDocuments({ role: "patient" }),
      User.countDocuments({ role: "doctors" }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.countDocuments({ status: "cancelled" }),
      Booking.countDocuments({ status: "completed" }),
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
    },
  });
};

const listUsers = async (req, res) => {
  const { role, search } = req.query;
  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { fullName: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
      { specialization: new RegExp(search, "i") },
    ];
  }
  const users = await User.find(query).select("-password").sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: users });
};

const createUser = async (req, res) => {
  const { fullName, email, password, role, gender, specialization, hospital, location, ticketPrice } =
    req.body;
  if (!fullName || !email || !password || !role) {
    return res.status(400).json({ message: "Name, email, password, and role are required" });
  }
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    password: hashed,
    role,
    gender: gender || "other",
    specialization: specialization || "",
    hospital: hospital || "",
    location: location || "",
    ticketPrice: Number(ticketPrice) || 500,
    isApproved: role === "doctors" ? "approved" : "approved",
  });
  res.status(201).json({ success: true, data: publicUser(user) });
};

const updateUser = async (req, res) => {
  const updates = { ...req.body };
  delete updates.password;
  if (req.body.password) {
    updates.password = await bcrypt.hash(req.body.password, 10);
  }
  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ success: true, data: user });
};

const deleteUser = async (req, res) => {
  if (String(req.params.id) === String(req.user._id)) {
    return res.status(400).json({ message: "You cannot delete your own admin account" });
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true });
};

const listAppointments = async (req, res) => {
  const { status, search } = req.query;
  const query = {};
  if (status) query.status = status;
  const items = await Booking.find(query)
    .populate("doctor", "fullName specialization ticketPrice")
    .populate("user", "fullName email phone")
    .sort({ createdAt: -1 });

  const filtered = search
    ? items.filter((item) =>
        `${item.patientName} ${item.doctor?.fullName || ""} ${item.user?.email || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : items;

  res.status(200).json({ success: true, data: filtered });
};

const updateAppointment = async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate("doctor", "fullName specialization")
    .populate("user", "fullName email");
  if (!booking) return res.status(404).json({ message: "Appointment not found" });
  res.status(200).json({ success: true, data: booking });
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
