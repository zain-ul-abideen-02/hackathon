import React, { useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "../Config/Auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css"; // ✅ connected CSS file here

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/dashboard");
    });
    return () => unsub();
  }, [navigate]);

  // Email login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !pass) return toast.warn("Please fill in all fields!");

    try {
      setLoading(true);
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, pass);
      toast.success("Login successful!");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      toast.error(err.message.replace("Firebase:", "").trim());
    } finally {
      setLoading(false);
    }
  };

  // Google login (optional)
  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, provider);
      toast.success(`Welcome back, ${res.user.displayName}!`);
      setTimeout(() => navigate("/dashboard"), 800);
    } catch {
      toast.error("Google sign-in failed. Try again.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Welcome Back 👋</h2>

      <form className="login-form" onSubmit={handleLogin}>
        <div className="input-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="alternate-text">
        Don’t have an account?{" "}
        <Link to="/signup" className="alternate-link">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default Login;
