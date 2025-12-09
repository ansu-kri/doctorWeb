const User = require("../Model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const speakeasy = require("speakeasy");
// const upload = require("../services/fileUpload");


const signup = async (req, res) => {
    try {
        const { fullName, email, password, areYou, gender } = req.body;

        // Validate required fields
        if (!fullName || !email || !password || !areYou || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if email is already taken
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Profile Picture handling (AWS S3 or Multer)
        const profilePicture = req.file ? req.file.location : null;

        // Create user
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            areYou,
            gender,
            profilePicture
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                areYou: newUser.areYou,
                gender: newUser.gender,
                password: newUser.password,
                profilePicture: newUser.profilePicture
            }
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Signup failed", error });
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
