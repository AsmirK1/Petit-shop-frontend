import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Business } from "../managementseller/utilities/type";

export const BusinessDirectory: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    (async () => {
      try {
        const API_BASE = import.meta.env.DEV ? "http://localhost:5062" : "";
        const res = await fetch(`${API_BASE}/api/businesses`);
        if (!res.ok) throw new Error("Failed to load businesses");
        const data: Business[] = await res.json();
        setBusinesses(data ?? []);
        const cats = Array.from(new Set((data ?? []).map((b) => b.category).filter(Boolean))).sort();
        setCategories(cats);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const filtered = businesses.filter((b) => {
    const matchesName = b.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === "All" || (b.category ?? "").toLowerCase() === selectedCategory.toLowerCase();
    return matchesName && matchesCategory;
  });
  // Directory should not allow adding to cart directly; users must view the shop page.

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Businesses</h2>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <input
          placeholder="Search businesses by name..."
          className="input input-bordered w-full max-w-md"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <label className="text-sm mr-2">Category</label>
          <select
            className="select select-bordered"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="italic text-base-content/60">No businesses match your search.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <div key={b.id} className="card shadow p-4 border border-base-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{b.name}</h3>
                  <p className="text-sm text-base-content/70">{b.category} • {b.city}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      try {
                        const s = localStorage.getItem('buyer_favorite_businesses');
                        const arr = s ? JSON.parse(s) : [];
                        const exists = arr.find((x: any) => String(x.id) === String(b.id));
                        if (exists) {
                          const updated = arr.filter((x: any) => String(x.id) !== String(b.id));
                          localStorage.setItem('buyer_favorite_businesses', JSON.stringify(updated));
                        } else {
                          arr.unshift({ id: b.id, name: b.name, city: b.city, category: b.category });
                          localStorage.setItem('buyer_favorite_businesses', JSON.stringify(arr));
                        }
                        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { role: 'buyer', user: JSON.parse(localStorage.getItem('buyer_user') || 'null') } }));
                      } catch { }
                    }}
                  >
                    Favorite
                  </button>
                  <Link to={`/business/${b.id}`} className="btn btn-sm btn-primary">View Shop</Link>
                </div>
              </div>
              {/* Small preview: show first page's first item title only (no add button) */}
              {b.pages && b.pages.length > 0 && b.pages[0].carts && b.pages[0].carts.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm">First item: {b.pages[0].carts[0].title} — ${Number(b.pages[0].carts[0].price).toFixed(2)}</div>
                </div>
              )}
              <div className="mt-3 text-sm text-base-content/70">
                Pages: {b.pages?.length ?? 0}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessDirectory;
