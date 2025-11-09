import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import aiRoutes from "./routes/aiRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import passport from "passport";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(passport.initialize());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", aiRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => res.send(" Backend running!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
