const User = require("../Model/user");
const generateToken = require("../Configs/utils")
const bcrypt = require("bcrypt");


// ==================== SIGNUP ====================
const signup = async (req, res) => {
    const { 
    fullName, 
    email, 
    password, 
    phone, 
    role, 
    gender, 
    bloodType 
  } = req.body;

  try {
    // 1. Validation
    if (!fullName || !email || !password || !phone || !role || !gender || !bloodType ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 2. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phone,
      role,
      gender,
      bloodType,
      profilePic: req.file ? req.file.path : undefined,
    });

    const savedUser = await newUser.save();

    // 5. Generate JWT token
    const token = generateToken(savedUser._id);

    // 6. Send response
    res.status(201).json({
      _id: savedUser._id,
      fullName: savedUser.fullName,
      email: savedUser.email,
      profilePic: savedUser.profilePic,
      token,
    });
  } catch (error) {
    console.log("Error in signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check required fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // 2. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // 3. Match password (plain text – same as your signup)
        if (password !== user.password) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        // const isPasswordValid = await bcrypt.compare(password, employee.password);
        // 4. Success response
        return res.status(200).json({
            message: "Login successful",
            user,
        });

    } catch (error) {
        console.log("Error in login", error);
        return res.status(500).json({ message: "Login failed", error });
    }
};

module.exports = signup, login;



    // Generate JWT token
    // const jwtSecret = process.env.JWT_SECRET;
    // const token = jwt.sign(
    //   {
    //     id: employee._id,
    //     email: employee.email,
    //     employeeID: employee.employeeID,
    //     employeeName: employee.employeeName,
    //     department: employee.department,
    //     role: employee.isAdmin ? "admin" : employee.isItAdmin ? "itadmin" : employee.isoperationadmin ? "operationadmin" : "user",
    //     profilePicture: employee.profilePicture,
    //   },
    //   jwtSecret,
    //   { expiresIn: "3d" }
    // );
