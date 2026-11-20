require("dotenv").config();

const connectDB = require("./src/Configs/db");
const app = require("./src/app");
const seedIfNeeded = require("./src/seed");

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  await seedIfNeeded();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

start();
