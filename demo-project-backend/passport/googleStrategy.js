import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "../db.js";
import dotenv from "dotenv";

dotenv.config();

export const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;

            db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
                if (err) return done(err);

                if (results.length > 0) {
                   
                    return done(null, results[0]);
                } else {
                 
                    const newUser = {
                        name: profile.displayName,
                        email,
                        password_hash: null,   
                        is_verified: 1,        
                        google_id: profile.id, 
                        verification_token: null,
                    };

                    db.query("INSERT INTO users SET ?", newUser, (err, result) => {
                        if (err) return done(err);
                        newUser.id = result.insertId;
                        return done(null, newUser);
                    });
                }
            });
        } catch (error) {
            done(error, null);
        }
    }
);
