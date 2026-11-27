const User = require("../Model/user");
const generateToken = require("../Configs/utils");
const bcrypt = require("bcrypt");

const publicUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  profilePic: user.profilePic,
  gender: user.gender,
  phone: user.phone,
  bloodType: user.bloodType,
  specialization: user.specialization,
  qualifications: user.qualifications,
  experiences: user.experiences,
  bio: user.bio,
  about: user.about,
  ticketPrice: user.ticketPrice,
  timeSlots: user.timeSlots,
  location: user.location,
  hospital: user.hospital,
  averageRating: user.averageRating,
  totalRating: user.totalRating,
  isApproved: user.isApproved,
  isAvailable: user.isAvailable,
  medicalHistory: user.medicalHistory,
});

const signup = async (req, res) => {
  try {
    const { fullName, email, password, role, gender, phone = "", bloodType = "" } = req.body;

    if (!fullName || !email || !password || !gender) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const allowedRoles = ["patient", "doctor", "doctors"];
    const safeRole = allowedRoles.includes(role)
      ? (role === "doctors" ? "doctor" : role)
      : "patient";

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: safeRole,
      gender,
      phone,
      bloodType,
      profilePic: req.file ? req.file.path.replace(/\\/g, "/") : "",
      isApproved: safeRole === "doctor" ? "pending" : "approved",
    });

    const savedUser = await newUser.save();
    const token = generateToken(savedUser._id);

    res.status(201).json({
      ...publicUser(savedUser),
      token,
    });
  } catch (error) {
    console.error("Error in signup:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (user.isActive === false) return res.status(403).json({ message: "Account is inactive" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.status(200).json({
      ...publicUser(user),
      token,
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

const getMe = async (req, res) => {
  res.status(200).json({ success: true, data: publicUser(req.user) });
};

const updateMe = async (req, res) => {
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
      "timeSlots",
      "isAvailable",
      "medicalHistory",
    ];

    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    if (req.file) {
      updates.profilePic = req.file.path.replace(/\\/g, "/");
    }

    if (updates.ticketPrice !== undefined) {
      updates.ticketPrice = Number(updates.ticketPrice);
    }

    ["qualifications", "experiences", "timeSlots", "medicalHistory"].forEach((field) => {
      if (typeof updates[field] === "string") {
        try {
          updates[field] = JSON.parse(updates[field]);
        } catch {
          if (field !== "timeSlots" && field !== "medicalHistory") {
            updates[field] = updates[field].split(",").map((v) => v.trim()).filter(Boolean);
          }
        }
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({ success: true, data: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, login, logout, getMe, updateMe, publicUser };
