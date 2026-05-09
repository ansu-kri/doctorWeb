const express = require("express");
const cors = require("cors")
const dotenv = require("dotenv");
const authRoutes = require("./Routes/auth.routes");
const doctorsRoutes = require("./Routes/doctors.routes")

const app = express();

//CORS configuation (Production safe)
const allowedOrigins =[
    "http://localhost:3000", //local dev
    process.env.FRONTEND_URL, // production frontend
];

app.use(
    cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
//parse urlencoded form data(need for multer)
app.use(express.urlencoded({ extended: true}));
//serve uploads folder statically
app.use("/uploads", express.static("uploads"));

app.use("/api", authRoutes);
app.use("/api", doctorsRoutes);

module.exports = app;