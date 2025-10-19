import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "../Config/Auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signup.css"; // ✅ CSS connected here

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        navigate("/dashboard");
      }
    });
    return () => unsub();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !pass) {
      toast.warn("Please fill out all fields");
      return;
    }

    setLoading(true);
    const auth = getAuth();

    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      toast.success("Sign-up successful!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      const message =
        error.code === "auth/email-already-in-use"
          ? "Email already in use. Try logging in."
          : error.code === "auth/weak-password"
          ? "Password should be at least 6 characters."
          : "Sign-up failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      toast.success(`Welcome, ${result.user.displayName}!`);
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      toast.error("Google sign-in failed. Try again.");
    }
  };

  if (user) return null;

  return (
    <div className="signup-container">
      <ToastContainer position="top-center" autoClose={1000} />

      <h2 className="signup-title">Create Account 🚀</h2>

      <form className="signup-form" onSubmit={handleSubmit}>
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
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <p className="alternate-text">
        Already have an account?{" "}
        <Link to="/login" className="alternate-link">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Signup;
