import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Business } from "./utilities/type";
import { BusinessCard } from "./BusinessCard";
import { CreateBusinessForm } from "./CreateBusinessForm";

export const ManagementSeller: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    const apiBase = import.meta.env.DEV ? "http://localhost:5062" : (import.meta.env.VITE_API_URL || "");
    // use same dev seller API port as SellerChat (4000)
    const sellerApiBase = import.meta.env.DEV ? "http://localhost:4000" : (import.meta.env.VITE_SELLER_API_URL || "");
    const token = localStorage.getItem("seller_token");
    const headers: Record<string,string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    // Fetch management (ASP.NET) businesses
    const mgmtFetch = fetch(`${apiBase}/api/management/businesses`, { headers })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          console.error("Management businesses fetch failed", res.status, text);
          return [];
        }
        return res.json();
      })
      .catch(() => []);

    // Fetch seller-created businesses from express seller service and merge
    const sellerFetch = fetch(`${sellerApiBase}/seller/businesses`, { headers })
      .then(async (res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .catch(() => []);

    Promise.all([mgmtFetch, sellerFetch]).then(([mgmt, seller]) => {
      // helper to normalize pages/carts shape from ASP.NET DTOs (Id/Title/Carts) and Express shapes
      const normalizeBusiness = (raw: any) => {
        if (!raw) return raw;
        const pagesRaw = raw.pages ?? raw.Pages ?? [];
        const pages = Array.isArray(pagesRaw)
          ? pagesRaw.map((p: any) => ({
              id: p.id ?? p.Id ?? (p.Id ?? p.id) ?? (p.id && String(p.id)),
              title: p.title ?? p.Title ?? "",
              businessId: p.businessId ?? p.BusinessId ?? raw.id ?? raw.Id,
              carts: (p.carts ?? p.Carts ?? []).map((c: any) => ({
                id: c.id ?? c.Id ?? (c.Id ?? c.id) ?? (c.id && String(c.id)),
                title: c.title ?? c.Title ?? "",
                price: c.price ?? c.Price ?? 0,
                category: c.category ?? c.Category ?? "",
                image: c.image ?? c.Image ?? null,
                pageId: c.pageId ?? c.PageId ?? p.id ?? p.Id
              }))
            }))
          : [];

        return {
          id: raw.id ?? raw.Id,
          name: raw.name ?? raw.Name,
          category: raw.category ?? raw.Category,
          country: raw.country ?? raw.Country,
          city: raw.city ?? raw.City,
          pages
        };
      };

      // merge by id (seller items may not have id; keep order)
      const map = new Map();
      (Array.isArray(mgmt) ? mgmt : []).forEach((b: any) => { const n = normalizeBusiness(b); if (n && n.id) map.set(String(n.id), n); else map.set(JSON.stringify(n), n); });
      // Merge seller local businesses but do not overwrite existing management (server) entries.
      (Array.isArray(seller) ? seller : []).forEach((b: any) => {
        const n = normalizeBusiness(b);
        if (!n) return;
        const key = n && n.id ? String(n.id) : JSON.stringify(n);
        if (!map.has(key)) {
          map.set(key, n);
        }
      });
      setBusinesses(Array.from(map.values()));
    }).catch(() => setBusinesses([]));
  }, []);

  const addBusiness = (business: Business) => {
    setBusinesses((prev) => [...prev, business]);
    setShowForm(false);
  };

  return (
    <section className="container mx-auto px-4 py-10 min-h-[60vh] flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <h1 className="text-3xl font-bold text-primary drop-shadow">Manage Your Businesses</h1>
        <button
          className="btn btn-accent btn-lg shadow-md"
          onClick={() => setShowForm(true)}
        >
          Create Business
        </button>
        <Link to="/MSeller/chat" className="btn btn-outline btn-lg shadow-md">
          Seller Assistant
        </Link>
      </div>

      {showForm && (
        <div className="bg-base-100 rounded-xl shadow-lg p-6 border border-base-200">
          <CreateBusinessForm onCreate={addBusiness} />
        </div>
      )}

      <div className="flex flex-col gap-4">
        {businesses.length === 0 ? (
          <div className="col-span-full text-center text-lg text-base-content/60 py-12">
            No businesses yet. Click <span className="font-semibold text-accent">Create Business</span> to get started!
          </div>
        ) : (
          businesses.map((business) => (
            <div key={business.id}>
              <BusinessCard
                business={business}
                setBusinesses={setBusinesses}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
};
