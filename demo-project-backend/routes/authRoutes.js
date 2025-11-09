import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import nodemailer from "nodemailer";
import { googleStrategy } from "../passport/googleStrategy.js";
import { db } from "../db.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

passport.use(googleStrategy);

// ----------- EMAIL VERIFICATION SETUP -----------
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// ----------- REGISTER USER -----------
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ error: "All fields required" });

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length > 0) return res.status(400).json({ error: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

        const user = {
            name,
            email,
            password_hash: hashedPassword,
            is_verified: 0,
            verification_token: token,
            google_id: null,
        };

        db.query("INSERT INTO users SET ?", user, (err, result) => {
            if (err) return res.status(500).json({ error: err });

            const verificationLink = `http://localhost:5000/auth/verify/${token}`;
            transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Verify your email",
                html: `<p>Click <a href="${verificationLink}">here</a> to verify your account.</p>`,
            });

            res.json({ message: "Registration successful, check your email to verify" });
        });
    });
});

// ----------- EMAIL VERIFICATION -----------
router.get("/verify/:token", (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        db.query(
            "UPDATE users SET is_verified = 1 WHERE email = ?",
            [decoded.email],
            (err) => {
                if (err) return res.status(500).send("Verification failed");
                res.send("Email verified! You can now login.");
            }
        );
    } catch (err) {
        res.status(400).send("Invalid or expired token");
    }
});

// ----------- LOGIN USER -----------
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(400).json({ error: "User not found" });

        const user = results[0];
        if (!user.is_verified) return res.status(400).json({ error: "Email not verified" });

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(400).json({ error: "Incorrect password" });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ message: "Login successful", token });
    });
});

// ----------- GOOGLE OAUTH -----------
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login", session: false }),
    (req, res) => {
    
        const token = jwt.sign(
            { id: req.user.id, email: req.user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
     
        
        res.redirect(
            `http://localhost:5173/oauth-success?token=${token}&name=${encodeURIComponent(req.user.name)}`
        );
    }
);

export default router;
