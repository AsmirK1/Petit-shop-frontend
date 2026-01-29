import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BuyerAuth: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialMode = location.pathname.includes("register") ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode as any);

  // login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // register fields
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.DEV ? "http://localhost:5062" : "";

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || password.length < 1) {
      alert("Enter valid credentials");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/auth/buyer/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) {
        const text = await res.text();
        let errorMsg = "Login failed";
        
        if (res.status === 401) {
          errorMsg = "Invalid email or password";
        } else {
          try {
            const json = JSON.parse(text);
            errorMsg = json.error || json.message || json.title || errorMsg;
          } catch {
            // If response is not JSON, use status text
            errorMsg = text || `Login failed (${res.status})`;
          }
        }
        throw new Error(errorMsg);
      }
      
      const data = await res.json();
      localStorage.removeItem("seller_token");
      localStorage.removeItem("seller_user");
      if (data.token) localStorage.setItem("buyer_token", data.token);
      if (data.user) localStorage.setItem("buyer_user", JSON.stringify(data.user));
      try {
        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { role: 'buyer', user: data.user } }));
        // notify seller cleared (in case buyer login replaced seller session)
        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { role: 'seller', user: null } }));
      } catch { }
      alert("Logged in");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const submitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || password.length < 6) {
      alert("Provide a valid email and password (min 6 chars)");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/auth/buyer/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const text = await res.text();
        let msg = "Register failed";
        try { const j = JSON.parse(text); msg = j.error ?? j.detail ?? j.title ?? JSON.stringify(j); } catch {}
        throw new Error(msg);
      }
      alert("Registered — you can now log in");
      navigate("/auth/buyer");
      setMode("login");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <div className="flex gap-2 mb-4">
        <button className={`btn ${mode === "login" ? "btn-primary" : "btn-ghost"}`} onClick={() => { setMode("login"); navigate("/auth/buyer"); }}>Login</button>
        <button className={`btn ${mode === "register" ? "btn-primary" : "btn-ghost"}`} onClick={() => { setMode("register"); navigate("/auth/buyer/register"); }}>Register</button>
      </div>

      {mode === "login" ? (
        <form onSubmit={submitLogin} className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Buyer Login</h2>
          <input className="input input-bordered w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" className="input input-bordered w-full" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="text-sm text-right -mt-2">
            <button type="button" className="btn btn-link btn-xs" onClick={() => navigate('/auth/forgot')}>Forgot your password?</button>
          </div>
          <div className="flex justify-between items-center">
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
            <button type="button" className="btn btn-ghost" onClick={() => { setMode("register"); navigate("/auth/buyer/register"); }}>Register</button>
          </div>
        </form>
      ) : (
        <form onSubmit={submitRegister} className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Buyer Register</h2>
          <input className="input input-bordered w-full" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input input-bordered w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" className="input input-bordered w-full" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex justify-between items-center">
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Saving..." : "Register"}</button>
            <button type="button" className="btn btn-ghost" onClick={() => { setMode("login"); navigate("/auth/buyer"); }}>Have an account?</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BuyerAuth;
