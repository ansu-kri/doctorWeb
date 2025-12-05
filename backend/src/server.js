const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./Routes/routes')
const connectDB = require('./Configs/db')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json());
app.use("/api", authRoutes)

app.listen(PORT, () => {
    console.log(`server is runing on ${PORT}`)
    connectDB();
})