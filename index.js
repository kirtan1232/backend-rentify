const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const AuthRouter = require("./routes/authRoutes");
const MobileRouter = require("./routes/mobileRoutes");
const protectedRouter = require("./routes/protectedRoutes");
const roomRoutes = require("./routes/roomRoutes");
const userRoutes = require("./routes/userRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const emailRoutes = require('./routes/emailRoutes');
const contactRoutes = require('./routes/contactRoutes');

require('dotenv').config();


const app = express();

connectDb();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Route handling
app.use("/api/auth", AuthRouter);
app.use("/api/v1/", MobileRouter);
app.use("/api/protected", protectedRouter);
app.use("/api/rooms", roomRoutes);  // Add room routes here
app.use("/api/user", userRoutes);
app.use('/api', wishlistRoutes);
app.use('/api/email', emailRoutes);
app.use('/api', contactRoutes);
app.use("/uploads", express.static("uploads"));

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
