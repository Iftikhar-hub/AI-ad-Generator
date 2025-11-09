import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { db } from "../db.js"; 
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "uploads/";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });


const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


router.post("/generate-ad", upload.single("media"), async (req, res) => {
    try {
        const { title, description, category, sub_category, price } = req.body;
        if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required" });
        }

        const media = req.file ? req.file.path : null;

        const prompt = `
Generate a short, catchy ad for:
Title: ${title}
Description: ${description}
Category: ${category}
Subcategory: ${sub_category}
Price: ${price}
Include 3 catchy lines and 5 relevant hashtags.
`;

        let aiText;

        try {
         
            const response = await client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
            });
            aiText = response.choices[0].message.content;

        } catch (apiError) {
            console.error(" AI Error:", apiError.response?.data || apiError.message);

          
            if (apiError.response?.status === 429) {
                aiText = "AI quota exceeded. This is a placeholder ad text.";
            } else {
                aiText = "Failed to generate AI text. This is a placeholder ad text.";
            }
        }

      
        const sql = `
      INSERT INTO ads (title, description, price, category, sub_category, media)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
        db.query(sql, [title, description, price, category, sub_category, media], (err, result) => {
            if (err) {
                console.error(" DB Error:", err);
                return res.status(500).json({ error: "Database error", details: err });
            }
            res.json({
                success: true,
                generatedText: aiText,
                mediaPath: media,
                adId: result.insertId,
            });
        });

    } catch (error) {
        console.error(" Unexpected Error:", error.message || error);
        res.status(500).json({ error: "Failed to generate ad", details: error.message });
    }
});

router.get("/ads", (req, res) => {
    const sql = "SELECT * FROM ads ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(" DB Error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.json(results);
    });
});

export default router;
