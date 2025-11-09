export default function Login() {
    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:5000/api/auth/google";
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Login</h2>
            <button onClick={handleGoogleLogin} style={{ padding: "10px 20px", marginTop: "20px" }}>
                Login with Google
            </button>
        </div>
    );
}
