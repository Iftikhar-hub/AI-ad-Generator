import express from "express";
import multer from "multer";
import path from "path";
import { db } from "../db.js";

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get("/", (req, res) => {
    const sql = "SELECT * FROM ads ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

router.post("/", upload.array("media"), (req, res) => {
    const { title, description, price, category, subCategory } = req.body;
    const mediaFiles = req.files?.map(file => file.filename).join(",") || "";

    const sql = "INSERT INTO ads (title, description, price, category, sub_category, media) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [title, description, price, category, subCategory, mediaFiles], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Ad posted successfully", adId: result.insertId });
    });
});

export default router;
