import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
   
    const user = {
      id: req.user.id,
      displayName: req.user.displayName,
      email: req.user.emails[0].value,
    };

 
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.redirect(`http://localhost:3000/oauth-success?token=${token}`);
  }
);

export default router;
