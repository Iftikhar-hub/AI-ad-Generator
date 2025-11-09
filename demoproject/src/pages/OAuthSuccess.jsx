import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const name = params.get("name");

        if (token) {
            localStorage.setItem("token", token);
            setUserEmail(name || "User"); 
            
        } else {
            navigate("/login");
        }
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2> Welcome, {userEmail}!</h2>
            <p>You have successfully logged in via Google.</p>
            
        </div>
    );
}
