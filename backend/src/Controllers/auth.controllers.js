const User = require("../Model/user");

const signup = async (req, res) => {
    const { fullName, email, password, areYou, gender } = req.body;

    try {
        // 1. Validate required fields
        if (!fullName || !email || !password || !areYou || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // 3. Create new user
        const newUser = await User.create({
            fullName,
            email,
            password,  // later, hash password
            areYou,
            gender
        });

        // 4. Response
        return res.status(201).json({
            message: "User registered successfully",
            user: newUser,
        });

    } catch (error) {
        console.log("Error in signup", error);
        return res.status(500).json({ message: "Signup failed", error });
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
