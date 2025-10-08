import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");

        try {
            console.log("Email:", email);
            console.log("Password:", password);

            const response = await axios.post("http://localhost:5555/auth/login", { email, password });
            console.log("API CALL SUCCESSFUL");
            console.log("Response:", response.data);

            const token = response.data.token;
            localStorage.setItem("token", token);
            setToken(token);
            navigate("/");
            window.location.reload();
        } catch (error) {
            console.error("Error during login:", error);
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <section className="min-h-screen w-full flex flex-col items-center justify-center">
            <div className="p-4 rounded-md border-4 flex flex-col border-[#A571E9] w-1/3 space-y-4">
                <h2 className="font-bold">Login</h2>
                <form onSubmit={handleLogin} className="flex flex-col space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        className="p-2 border-2 border-slate-300 rounded-sm"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="p-2 border-2 border-slate-300 rounded-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="bg-[#A571E9] rounded-md text-white text-center w-full p-2" type="submit">
                        Login
                    </button>
                </form>
                <p className="text-slate-500 text-center">
                    or <a href="https://www.google.com" className="hover:underline hover:text-blue-500">Create an account</a>
                </p>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        </section>
    );
};

export default Login;
