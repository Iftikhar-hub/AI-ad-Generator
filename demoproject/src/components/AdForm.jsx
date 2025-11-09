import React, { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography, Select, MenuItem, Card, CardContent, CircularProgress } from "@mui/material";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';

export default function AdForm({ onAdPosted }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        sub_category: "",
        price: "",
    });
    const [media, setMedia] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generatedText, setGeneratedText] = useState("");
    const [socialStatus, setSocialStatus] = useState({ whatsapp: false, meta: false });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setMedia(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSocialStatus({ whatsapp: false, meta: false });

        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => data.append(key, formData[key]));
            if (media) data.append("media", media);

            const res = await axios.post("http://localhost:5000/api/generate-ad", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setGeneratedText(res.data.generatedText);

            const adData = {
                id: res.data.adId,
                title: formData.title,
                description: formData.description,
                category: formData.category,
                sub_category: formData.sub_category,
                price: formData.price,
                media: res.data.mediaPath,
            };

         
            try {
                await axios.post("http://localhost:5000/api/social/send-whatsapp", adData);
                setSocialStatus(prev => ({ ...prev, whatsapp: true }));
            } catch (whatsappError) {
                console.error(" WhatsApp Error:", whatsappError);
            }

            try {
                await axios.post("http://localhost:5000/api/social/post-meta", adData);
                setSocialStatus(prev => ({ ...prev, meta: true }));
            } catch (metaError) {
                console.error(" Meta API Error:", metaError);
            }

            setFormData({ title: "", description: "", category: "", sub_category: "", price: "" });
            setMedia(null);
            if (onAdPosted) onAdPosted();

        } catch (err) {
            console.error("Error submitting ad:", err);
            alert("Failed to submit ad. Check backend logs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ maxWidth: 500, margin: "auto", mt: 3, p: 2, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h5" color="primary" gutterBottom>Create Advertisement</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField label="Title" name="title" value={formData.title} onChange={handleChange} required />
                    <TextField label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={3} required />
                    <Select name="category" value={formData.category} onChange={handleChange} displayEmpty required>
                        <MenuItem value=""><em>Select Category</em></MenuItem>
                        <MenuItem value="Electronics">Electronics</MenuItem>
                        <MenuItem value="Vehicles">Vehicles</MenuItem>
                        <MenuItem value="Real Estate">Real Estate</MenuItem>
                        <MenuItem value="Services">Services</MenuItem>
                    </Select>
                    <TextField label="Subcategory" name="sub_category" value={formData.sub_category} onChange={handleChange} required />
                    <TextField label="Price" name="price" type="number" value={formData.price} onChange={handleChange} step="0.01" required />
                    <input type="file" name="media" accept="image/*" onChange={handleFileChange} />
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : "Generate Ad"}
                    </Button>
                </Box>

                {generatedText && (
                    <Card sx={{ mt: 3, p: 2, backgroundColor: "#f5f5f5" }}>
                        <Typography variant="h6" gutterBottom>AI Generated Ad</Typography>
                        <Typography sx={{ mb: 2 }}>{generatedText}</Typography>

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Box sx={{
                                display: "flex", alignItems: "center", gap: 1,
                                color: socialStatus.whatsapp ? "green" : "gray"
                            }}>
                                <WhatsAppIcon /> {socialStatus.whatsapp ? "Sent to WhatsApp ✅" : "WhatsApp pending..."}
                            </Box>
                            <Box sx={{
                                display: "flex", alignItems: "center", gap: 1,
                                color: socialStatus.meta ? "green" : "gray"
                            }}>
                                <FacebookIcon /> {socialStatus.meta ? "Posted to FB/Instagram ✅" : "FB/Instagram pending..."}
                            </Box>
                        </Box>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
}
