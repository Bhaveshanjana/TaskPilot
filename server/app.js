import dotenv from "dotenv";
dotenv.config();

import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";

import express from "express";
const app = express();
import cors from "cors";

import cookiParser from "cookie-parser";
import connectTodb from "./db/db.js";

connectTodb();

app.use(cookiParser());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json("hello there");
});

app.use("/users", userRoutes);
app.use("/projects", projectRoutes);

export default app;
