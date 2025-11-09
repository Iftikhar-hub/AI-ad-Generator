import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {
    const location = useLocation();
    const [message, setMessage] = useState("Verifying...");

    useEffect(() => {
        const token = new URLSearchParams(location.search).get("token");
        if (token) {
            axios.get(`http://localhost:5000/api/auth/verify/${token}`)
                .then(res => setMessage(res.data))
                .catch(err => setMessage(err.response?.data || "Verification failed"));
        } else {
            setMessage("No verification token found");
        }
    }, [location.search]);

    return <p style={{ textAlign: "center", marginTop: "50px" }}>{message}</p>;
}
