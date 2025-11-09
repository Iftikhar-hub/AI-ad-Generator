import express from "express";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();


router.post("/send-whatsapp", async (req, res) => {
    try {
        const ad = req.body; 
        console.log(` Sending ad "${ad.title}" to WhatsApp channel...`);

       
        await new Promise((resolve) => setTimeout(resolve, 500));

        console.log(` Ad "${ad.title}" sent to WhatsApp`);
        res.json({ success: true, message: "Ad sent to WhatsApp" });
    } catch (error) {
        console.error(" WhatsApp Error:", error);
        res.status(500).json({ success: false, error: "Failed to send ad to WhatsApp" });
    }
});


router.post("/post-meta", async (req, res) => {
    try {
        const ad = req.body; 
        console.log(` Posting ad "${ad.title}" to FB/Instagram...`);

      
        await new Promise((resolve) => setTimeout(resolve, 500));

        console.log(` Ad "${ad.title}" posted to FB/Instagram`);
        res.json({ success: true, message: "Ad posted to FB/Instagram" });
    } catch (error) {
        console.error(" Meta API Error:", error);
        res.status(500).json({ success: false, error: "Failed to post ad to FB/Instagram" });
    }
});

export default router;
