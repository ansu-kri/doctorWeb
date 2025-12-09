// const express = require("express");
// const dotenv = require("dotenv");
// const authRoutes = require("./Routes/routes");
// const connectDB = require("./Configs/db");
// const path = require("path");

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());

// // Routes
// app.use("/api", authRoutes);

// // Serve uploaded images
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//     connectDB();
// });


const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./Routes/routes");
const connectDB = require("./Configs/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});