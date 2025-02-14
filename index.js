const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const AuthRouter = require("./routes/authRoutes");
const protectedRouter = require("./routes/protectedRoutes");

const app = express();

connectDb();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use("/api/auth", AuthRouter);
app.use("/api/protected", protectedRouter);

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
