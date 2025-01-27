import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import adminRoute from "./route/adminRoute.js"; 
import noticeRoute from "./route/noticeRoute.js";

const PORT = process.env.PORT || 8000;

const app = express();
dotenv.config();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

// Routes
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/notice", noticeRoute);


//test api
app.get("/", (req, res) => {
    res.send("Welcome to the server");
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });