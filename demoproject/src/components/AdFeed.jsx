import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdFeed() {
    const [ads, setAds] = useState([]);

    const fetchAds = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/ads");
           
            const adsWithSocial = res.data.map(ad => ({
                ...ad,
                sentToWhatsApp: true,
                postedToMeta: true,
            }));
            setAds(adsWithSocial);
        } catch (err) {
            console.error("Error fetching ads:", err);
        }
    };

    useEffect(() => {
        fetchAds();
    }, []);

    if (!ads.length) return <p style={{ textAlign: "center", marginTop: "20px" }}>No ads yet</p>;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
            {ads.map((ad) => (
                <div className="card" key={ad.id} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
                    <h3 style={{ color: "#3f51b5" }}>{ad.title}</h3>
                    <p>{ad.description}</p>
                    {ad.media && <img src={`http://localhost:5000/${ad.media}`} alt="Ad media" style={{ maxWidth: "100%", marginTop: "10px", borderRadius: "5px" }} />}

                    {/* Social Media badges */}
                    <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                        {ad.sentToWhatsApp && <span style={{ backgroundColor: "#25D366", color: "#fff", padding: "3px 8px", borderRadius: "5px", fontSize: "12px" }}>Sent to WhatsApp</span>}
                        {ad.postedToMeta && <span style={{ backgroundColor: "#3b5998", color: "#fff", padding: "3px 8px", borderRadius: "5px", fontSize: "12px" }}>Posted to FB/Instagram</span>}
                    </div>
                </div>
            ))}
        </div>
    );
}
