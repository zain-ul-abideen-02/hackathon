import React, { useEffect, useState, useRef } from "react";
import { onAuthStateChanged, getAuth, signOut } from "../Config/Auth";
import { db } from "../Config/Auth";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useNavigate } from "react-router-dom";
import { Send, LogOut } from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const messagesEndRef = useRef(null);
  const auth = getAuth();
  const navigate = useNavigate();

  // ✅ Auth Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/login");
      else setUserId(user.uid);
      setInitializing(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // ✅ Firestore Fetch
  useEffect(() => {
    if (!userId) return;
    const q = query(
      collection(db, "users", userId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [userId]);

  // ✅ Gemini Model
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-pro" });

  const handleSend = async () => {
    if (!input.trim() || !userId) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      await addDoc(collection(db, "users", userId, "messages"), {
        sender: "user",
        text: input,
        timestamp: serverTimestamp(),
      });

      const prompt =
        input +
        " — generate a startup pitch with headings: Name, Tagline, Pitch, Target Audience, and Landing Copy.";

      const result = await model.generateContent(prompt);
      const reply = result.response.text();

      await addDoc(collection(db, "users", userId, "messages"), {
        sender: "ai",
        text: reply,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
      await addDoc(collection(db, "users", userId, "messages"), {
        sender: "ai",
        text: "⚠️ Something went wrong! Please try again.",
        timestamp: serverTimestamp(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
      alert("Error logging out!");
    }
  };

  // ✅ Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (initializing) {
    return (
      <div className="home-container">
        <h1 className="home-title">Loading your dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* ✅ Fixed Navbar on Top */}
      <div
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          width: "100%",
          background: "rgba(28, 28, 43, 0.95)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 30px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          zIndex: 1000,
          backdropFilter: "blur(10px)",
        }}
      >
        <h2
          style={{
            color: "#fff",
            fontSize: "22px",
            fontWeight: "bold",
            letterSpacing: "0.5px",
          }}
        >
          PitchCraft 
        </h2>

        <button
          onClick={handleLogout}
          style={{
            background: "#e63946",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 0 10px rgba(230,57,70,0.4)",
            transition: "0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#d62839")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#e63946")}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* ✅ Chat Section */}
      <div className="form-container" style={{ maxWidth: "700px", marginTop: "40px" }}>
        <div
          className="response-container"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          {messages.length === 0 && !loading ? (
            <p style={{ textAlign: "center", color: "#aaa" }}>
              💬 No chats yet. Start typing below!
            </p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  marginBottom: "15px",
                }}
              >
                <p
                  style={{
                    display: "inline-block",
                    background:
                      msg.sender === "user" ? "#1a72ff" : "rgba(50,50,70,0.8)",
                    color: "#fff",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    maxWidth: "85%",
                    wordWrap: "break-word",
                    boxShadow:
                      msg.sender === "user"
                        ? "0 0 10px rgba(26,114,255,0.6)"
                        : "0 0 6px rgba(255,255,255,0.1)",
                  }}
                >
                  {msg.text}
                </p>
              </div>
            ))
          )}
          {loading && (
            <p style={{ color: "#aaa", fontStyle: "italic" }}>
              Gemini is thinking...
            </p>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ✅ Input */}
        <div className="input-group" style={{ marginTop: "25px" }}>
          <label htmlFor="idea" className="input-label">
            Type your idea or question:
          </label>
          <input
            id="idea"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your startup idea..."
            className="input-field"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="submit-button"
            style={{
              marginTop: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              width: "100%",
            }}
          >
            <Send size={18} />
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
