import { useState } from "react";
import type { Business } from "./utilities/type";

type Props = {
  onCreate: (business: Business) => void;
};

const categories: string[] = [
  "Restaurant",
  "Shop",
  "Service",
  "Handmade",
  "Digital",
  "E-commerce",
  "Freelancer",
  "Other",
];

export const CreateBusinessForm: React.FC<Props> = ({ onCreate }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!name || !category) return;
    setLoading(true);
    setError(null);
    try {
      const apiBase = import.meta.env.DEV ? "http://localhost:5062" : (import.meta.env.VITE_API_URL || "");
      const token = localStorage.getItem("seller_token");
      
      // Check if user is logged in
      if (!token) {
        throw new Error("You must be logged in as a seller to create a business. Please log in first.");
      }
      
      const headers: Record<string,string> = { "Content-Type": "application/json" };
      headers["Authorization"] = `Bearer ${token}`;
      
      console.log("Creating business with:", { name, category, country, city });
      console.log("Token exists:", !!token);
      
      const response = await fetch(`${apiBase}/api/businesses`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name, category, country, city })
      });
      const text = await response.text();
      
      console.log("Response status:", response.status);
      console.log("Response text:", text);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Your session may have expired. Please log in again.");
        }
        let serverMsg = text;
        try { 
          const j = JSON.parse(text); 
          serverMsg = j.detail ?? j.title ?? JSON.stringify(j); 
        } catch {
          // Keep original text if parse fails
        }
        throw new Error(serverMsg || "Failed to save business");
      }
      const saved = text ? JSON.parse(text) : null;
      onCreate(saved);
      // Optionally reset form
      setName(""); setCategory(""); setCountry(""); setCity("");
    } catch (err) {
      console.error("Error creating business:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={e => { e.preventDefault(); submit(); }}
    >
      {error && <div className="alert alert-error">{error}</div>}
      <input
        className="input input-bordered"
        placeholder="Business name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <select
        className="select select-bordered"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <input
        className="input input-bordered"
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />

      <input
        className="input input-bordered mb-2"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button className="btn btn-success" type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Business"}
      </button>
    </form>
  );
};
