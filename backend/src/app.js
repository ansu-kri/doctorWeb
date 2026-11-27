const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./Routes/auth.routes");
const doctorsRoutes = require("./Routes/doctors.routes");
const bookingRoutes = require("./Routes/booking.routes");
const catalogRoutes = require("./Routes/catalog.routes");
const adminRoutes = require("./Routes/admin.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Legacy files remain read-only until the Cloudinary migration has been reviewed.
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api", authRoutes);
app.use("/api", doctorsRoutes);
app.use("/api", bookingRoutes);
app.use("/api", catalogRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

module.exports = app;
