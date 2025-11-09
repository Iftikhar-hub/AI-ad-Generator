import { useState } from "react";
import axios from "axios";

export default function SignUp() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", formData);
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.error || "Sign-Up failed");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
            <h2>Sign-Up</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <button type="submit" style={{ marginTop: "10px" }}>Sign Up</button>
            </form>
            {message && <p style={{ marginTop: "15px", color: "green" }}>{message}</p>}
        </div>
    );
}
