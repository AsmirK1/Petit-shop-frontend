import type { Business, Page, CartItem } from "./utilities/type";
import { PagePreview } from "./PagePreview";
import { Link } from "react-router-dom";
import { useState } from "react";

type Props = {
  business: Business;
  setBusinesses: React.Dispatch<React.SetStateAction<Business[]>>;
};

export const BusinessCard: React.FC<Props> = ({
  business,
  setBusinesses,
}) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(business.name);
  const [category, setCategory] = useState(business.category);
  const [country, setCountry] = useState(business.country);
  const [city, setCity] = useState(business.city);

  const apiBase = import.meta.env.DEV ? "http://localhost:5062" : (import.meta.env.VITE_API_URL || "");
  const sellerApiBase = import.meta.env.DEV ? "http://localhost:4000" : (import.meta.env.VITE_SELLER_API_URL || "");

  // Ensure business exists on ASP.NET backend and return asp id to use for PUT/DELETE
  const ensureAspBusiness = async (b: Business) => {
    // Determine candidate numeric id (accept numeric strings too)
    const rawMaybe = (b as any).id ?? (b as any).Id ?? (b as any).aspId ?? null;
    const maybeIdNum = rawMaybe != null && /^\d+$/.test(String(rawMaybe)) ? Number(rawMaybe) : null;
    // Only consider numeric ids that fit in 32-bit signed int (ASP.NET int)
    const isValidAspInt = maybeIdNum !== null && Math.abs(maybeIdNum) <= 2147483647;

    const token = localStorage.getItem('seller_token');
    const headers: Record<string,string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    if (isValidAspInt) {
      console.debug('ensureAspBusiness: checking existing numeric id', maybeIdNum);
      try {
        const check = await fetch(`${apiBase}/api/businesses/${maybeIdNum}`, { method: 'GET', headers });
        if (check.ok) {
          console.debug('ensureAspBusiness: id exists on server', maybeIdNum);
          return maybeIdNum;
        }
        console.debug('ensureAspBusiness: numeric id not found on server (will create):', maybeIdNum, check.status);
      } catch (e) {
        console.debug('ensureAspBusiness: GET check failed, will attempt create', e);
      }
    } else if (maybeIdNum !== null) {
      console.debug('ensureAspBusiness: numeric id out of ASP.NET int range, skipping GET and will create instead', maybeIdNum);
    }

    // Create the business on ASP.NET using seller token
    if (!token) throw new Error('You must be signed in as a seller to perform this action');

    console.debug('ensureAspBusiness: creating business on ASP.NET for local business', { name: b.name });
    const res = await fetch(`${apiBase}/api/businesses`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: b.name, category: b.category, country: b.country, city: b.city })
    });
    if (!res.ok) {
      const text = await res.text();
      let msg = text || 'Failed to create business on server';
      try { msg = JSON.parse(text).error ?? JSON.parse(text).message ?? text; } catch {}
      console.error('ensureAspBusiness: create failed', res.status, msg);
      throw new Error(msg);
    }
    const saved = await res.json();
    const newId = saved.id ?? saved.Id;
    try { (b as any).aspId = newId; } catch {}
    console.debug('ensureAspBusiness: created business on ASP.NET with id', newId);
    return newId;
  };

  // Ensure a Page exists on ASP.NET backend; returns the page id string
  const ensureAspPage = async (pageId: string | undefined, pageTitle: string | undefined, b: Business) => {
    const pid = pageId ?? (crypto && (crypto as any).randomUUID ? (crypto as any).randomUUID() : String(Date.now()));

    // Try to create the page on ASP.NET. If it already exists the POST may fail; in that case
    // check the management businesses list for the page id before giving up.
    const bizAspId = await ensureAspBusiness(b);
    const body = { id: pid, title: pageTitle ?? "", businessId: bizAspId };
    const createRes = await fetch(`${apiBase}/api/pages`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) });
    if (createRes.ok) return pid;
    if (createRes.status === 409) {
      // page already exists on server
      return pid;
    }

    // If creation failed for another reason, attempt to confirm existence via management endpoint
    try {
      const listRes = await fetch(`${apiBase}/api/management/businesses`, { method: 'GET', headers: authHeaders() });
      if (listRes.ok) {
        const list = await listRes.json();
        const found = (list || []).some((biz:any) => (biz.Pages || []).some((p:any) => (p.Id ?? p.id) === pid || (p.id ?? p.Id) === pid));
        if (found) return pid;
      }
    } catch (e) {
      // ignore and fall through to error handling below
    }

    const text = await createRes.text();
    let msg = text || 'Failed to ensure page on server';
    try { msg = JSON.parse(text).error ?? JSON.parse(text).message ?? text; } catch {}
    throw new Error(msg);
  };

  const authHeaders = (extra?: Record<string,string>) => {
    const token = localStorage.getItem("seller_token");
    return {
      ...(extra ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    };
  };

  const saveEdit = async () => {
    try {
      // ensure ASP.NET id exists for this business (sync if needed)
      const targetId = await ensureAspBusiness(business);

      const res = await fetch(`${apiBase}/api/businesses/${targetId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ name, category, country, city }),
      });
      if (!res.ok) {
        const text = await res.text();
        let msg = text || "Failed to update";
        try { msg = JSON.parse(text).error ?? JSON.parse(text).message ?? text; } catch { /* ignore */ }
        throw new Error(msg);
      }
      setBusinesses((prev) => prev.map((b) => (b.id === business.id ? { ...b, name, category, country, city } : b)));
      setEditing(false);
    } catch (e) {
      console.error(e);
      alert("Update failed");
    }
  };

  const deleteBusiness = async () => {
    if (!confirm("Delete this business?")) return;
    try {
      const targetId = await ensureAspBusiness(business);
      const res = await fetch(`${apiBase}/api/businesses/${targetId}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) {
        const text = await res.text();
        let msg = text || "Failed to delete";
        try { msg = JSON.parse(text).error ?? JSON.parse(text).message ?? text; } catch { /* ignore */ }
        throw new Error(msg);
      }
      // remove local express copy (best-effort)
      try {
        const sellerRes = await fetch(`${sellerApiBase}/seller/businesses/${business.id}`, { method: 'DELETE', headers: authHeaders() });
        if (!sellerRes.ok) console.debug('Failed to remove local seller copy', await sellerRes.text());
      } catch (e) { console.debug('Error removing local seller copy', e); }

      setBusinesses((prev) => prev.filter((b) => b.id !== business.id));
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const addPage = async () => {
    const newPage: Page = {
      id: crypto.randomUUID(),
      title: `Page ${(business.pages?.length ?? 0) + 1}`,
      carts: [],
    };

    try {
      // ensure seller is logged in
      const token = localStorage.getItem("seller_token");
      if (!token) return alert("You must be signed in as a seller to create a page.");

      // backend expects BusinessId as number
      const body = { id: newPage.id, title: newPage.title, businessId: Number(business.id) } as any;
      const headers = authHeaders();
      console.debug("Creating page", { url: `${apiBase}/api/pages`, headers, body });
      const res = await fetch(`${apiBase}/api/pages`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        let msg = text || "Failed to create page";
        try { msg = JSON.parse(text).error ?? JSON.parse(text).message ?? text; } catch { /* ignore */ }
        console.error("Create page failed", res.status, text);
        throw new Error(msg);
      }
      const saved = await res.json();
      // normalize ASP.NET PageDto to frontend Page shape (id lower-case, carts array)
      const normalizedPage: any = {
        id: saved.id ?? saved.Id,
        title: saved.title ?? saved.Title,
        businessId: saved.businessId ?? saved.BusinessId,
        carts: (saved.carts ?? saved.Carts ?? []).map((c: any) => ({
          id: c.id ?? c.Id,
          title: c.title ?? c.Title,
          price: c.price ?? c.Price,
          category: c.category ?? c.Category,
          image: c.image ?? c.Image,
          pageId: c.pageId ?? c.PageId
        }))
      };

      setBusinesses((prev) =>
        prev.map((b) => (b.id === business.id ? { ...b, pages: [...b.pages, normalizedPage] } : b))
      );
    } catch (e) {
      console.error(e);
      alert("Failed to add page");
    }
  };

  const addCartToPage = async (pageId: string, cart: CartItem) => {
    try {
      // ensure page exists on ASP.NET before creating cart item
      const ensuredPageId = await ensureAspPage(pageId, undefined, business);
      const body = { ...cart, pageId: ensuredPageId };
      const res = await fetch(`${apiBase}/api/cartitems`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to save cart item");
      const saved = await res.json();
      setBusinesses((prev) =>
        prev.map((b) =>
          b.id === business.id
            ? {
                ...b,
                pages: b.pages.map((p) =>
                  p.id === pageId ? { ...p, carts: [...p.carts, saved] } : p
                ),
              }
            : b
        )
      );
    } catch (e) {
      console.error(e);
      alert("Failed to save cart item");
    }
  };

  return (
    <div className="card bg-gradient-to-br from-base-200 to-base-100 shadow-lg p-6 border border-base-300">
      {!editing ? (
        <>
          <h2 className="font-bold text-xl text-primary mb-1">
            <Link to={`/MSeller/${business.id}`} className="hover:underline">{business.name}</Link>
          </h2>
          <p className="mb-2 text-base-content/70">
            <span className="font-medium">{business.category}</span>
            {business.city && <span> · {business.city}</span>}
          </p>

          <div className="flex gap-2 mb-2">
            <button className="btn btn-outline btn-accent btn-sm" onClick={() => setEditing(true)}>Edit</button>
            <button className="btn btn-outline btn-error btn-sm" onClick={deleteBusiness}>Delete</button>
            <button className="btn btn-outline btn-accent btn-sm ml-auto" onClick={addPage}>Add Page</button>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <input className="input input-bordered w-full" value={name} onChange={e => setName(e.target.value)} />
          <input className="input input-bordered w-full" value={category} onChange={e => setCategory(e.target.value)} />
          <div className="flex gap-2">
            <input className="input input-bordered flex-1" value={city} onChange={e => setCity(e.target.value)} placeholder="City" />
            <input className="input input-bordered flex-1" value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" />
          </div>
          <div className="flex gap-2">
            <button className="btn btn-success btn-sm" onClick={saveEdit}>Save</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-3">
        {(business.pages || []).map((page, __idx) => (
          <PagePreview
            key={page.id ?? `${business.id}-page-${__idx}`}
            page={page}
            onAddCart={(cart) => addCartToPage(page.id, cart)}
            onUpdatePage={async (id, title) => {
              try {
                // if id is falsy, treat as create (some pages originate locally without ASP id)
                const pid = id || (crypto && (crypto as any).randomUUID ? (crypto as any).randomUUID() : String(Date.now()));
                // ensure business exists on ASP.NET and get numeric business id
                const bizAspId = await ensureAspBusiness(business);

                if (!id) {
                  // create new page on ASP.NET
                  const createRes = await fetch(`${apiBase}/api/pages`, {
                    method: "POST",
                    headers: authHeaders(),
                    body: JSON.stringify({ id: pid, title, businessId: bizAspId })
                  });
                  if (!createRes.ok) throw new Error("Failed to create page");
                  const saved = await createRes.json();
                  const normalized = { id: saved.id ?? saved.Id, title: saved.title ?? saved.Title, businessId: saved.businessId ?? saved.BusinessId, carts: (saved.carts ?? saved.Carts ?? []).map((c:any)=>({ id: c.id??c.Id, title:c.title??c.Title, price:c.price??c.Price, category:c.category??c.Category, image:c.image??c.Image })) };
                  setBusinesses((prev) => prev.map((b) => (b.id === business.id ? { ...b, pages: [...b.pages, normalized] } : b)));
                } else {
                  const res = await fetch(`${apiBase}/api/pages/${id}`, {
                    method: "PUT",
                    headers: authHeaders(),
                    body: JSON.stringify({ id, title, businessId: bizAspId }),
                  });
                  if (!res.ok) throw new Error("Failed to update page");
                  setBusinesses((prev) =>
                    prev.map((b) =>
                      b.id === business.id
                        ? { ...b, pages: b.pages.map((p) => (p.id === id ? { ...p, title } : p)) }
                        : b
                    )
                  );
                }
              } catch (e) {
                console.error(e);
                alert("Failed to update page");
              }
            }}
            onDeletePage={async (id) => {
              if (!confirm("Delete this page?")) return;
              try {
                const res = await fetch(`${apiBase}/api/pages/${id}`, { method: "DELETE", headers: authHeaders() });
                if (!res.ok) throw new Error("Failed to delete page");
                setBusinesses((prev) =>
                  prev.map((b) => (b.id === business.id ? { ...b, pages: b.pages.filter((p) => p.id !== id) } : b))
                );
              } catch (e) {
                console.error(e);
                alert("Failed to delete page");
              }
            }}
            onUpdateCart={async (pageId, cartId, cart) => {
              try {
                const res = await fetch(`${apiBase}/api/cartitems/${cartId}`, {
                  method: "PUT",
                  headers: authHeaders(),
                  body: JSON.stringify({ ...cart, id: cartId, pageId }),
                });

                if (res.status === 404) {
                  // item not found on server; ensure page exists and try creating it instead
                  const pageObj = business.pages?.find(p => p.id === pageId) as any;
                  const ensuredPageId = await ensureAspPage(pageId, pageObj?.title, business);
                  const createRes = await fetch(`${apiBase}/api/cartitems`, {
                    method: "POST",
                    headers: authHeaders(),
                    body: JSON.stringify({ ...cart, id: cartId, pageId: ensuredPageId }),
                  });
                  if (!createRes.ok) throw new Error("Failed to create cart item on server");
                  const saved = await createRes.json();
                  const normalized = { id: saved.id ?? saved.Id, title: saved.title ?? saved.Title, price: saved.price ?? saved.Price, category: saved.category ?? saved.Category, image: saved.image ?? saved.Image, pageId: saved.pageId ?? saved.PageId };
                  setBusinesses((prev) =>
                    prev.map((b) =>
                      b.id === business.id
                        ? { ...b, pages: b.pages.map((p) => (p.id === pageId ? { ...p, carts: p.carts.map(c => c.id === cartId ? { ...c, ...normalized } : c) } : p)) }
                        : b
                    )
                  );
                  return;
                }

                if (!res.ok) throw new Error("Failed to update cart item");

                setBusinesses((prev) =>
                  prev.map((b) =>
                    b.id === business.id
                      ? { ...b, pages: b.pages.map((p) => (p.id === pageId ? { ...p, carts: p.carts.map(c => c.id === cartId ? { ...c, ...cart } : c) } : p)) }
                      : b
                  )
                );
              } catch (e) {
                console.error(e);
                alert("Failed to update cart item");
              }
            }}
            onDeleteCart={async (pageId, cartId) => {
              if (!confirm("Delete this cart item?")) return;
              try {
                const res = await fetch(`${apiBase}/api/cartitems/${cartId}`, { method: "DELETE", headers: authHeaders() });
                if (!res.ok) throw new Error("Failed to delete cart item");
                setBusinesses((prev) =>
                  prev.map((b) =>
                    b.id === business.id
                      ? { ...b, pages: b.pages.map(p => p.id === pageId ? { ...p, carts: p.carts.filter(c => c.id !== cartId) } : p) }
                      : b
                  )
                );
              } catch (e) {
                console.error(e);
                alert("Failed to delete cart item");
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};
