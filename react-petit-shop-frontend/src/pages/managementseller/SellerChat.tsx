import React, { useState } from "react";

export const SellerChat: React.FC = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ from: string; text: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [createdBusiness, setCreatedBusiness] = useState<any>(null);

  const sellerApiBase = import.meta.env.DEV ? "http://localhost:4000" : (import.meta.env.VITE_SELLER_API_URL || "");

  async function send() {
    if (!message.trim()) return;
    const userMsg = message.trim();
    setMessages((m) => [...m, { from: 'you', text: userMsg }]);
    setMessage("");
    setLoading(true);
    try {
      const token = localStorage.getItem('seller_token');
      const headers: Record<string,string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const resp = await fetch(`${sellerApiBase}/seller/ai/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: userMsg, history: [] , seller: { name: localStorage.getItem('seller_name') || null } })
      });
      const text = await resp.text();
      let data: any = null;
      try { data = text ? JSON.parse(text) : null; } catch (e) { data = { rawText: text }; }
      if (!resp.ok) {
        const errMsg = (data && (data.error || data.message)) || text || `HTTP ${resp.status}`;
        setMessages((m) => [...m, { from: 'ai', text: `Error: ${errMsg}` }]);
        setLoading(false);
        return;
      }
      const reply = data?.reply || (data?.raw ? JSON.stringify(data.raw) : (data?.rawText ? data.rawText : 'No reply'));
      setMessages((m) => [...m, { from: 'ai', text: reply }]);
      if (data?.created) {
        setCreatedBusiness(data.created);
      }
    } catch (e) {
      console.error('seller chat send error', e);
      setMessages((m) => [...m, { from: 'ai', text: `Error contacting seller AI: ${e?.message || e}` }]);
    } finally { setLoading(false); }
  }

  return (
    <section className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Seller Assistant</h2>
      <div className="bg-base-100 border rounded p-4 max-w-2xl">
        <div className="flex flex-col gap-3 mb-4">
          {messages.length === 0 && <div className="text-base-content/60">Start by asking a question or request to create a business.</div>}
          {messages.map((m, i) => (
            <div key={i} className={`p-3 rounded ${m.from === 'you' ? 'bg-primary/10 self-end' : 'bg-base-200'}`}>
              <div className="text-sm text-primary/80 font-semibold">{m.from === 'you' ? 'You' : 'AI'}</div>
              <div className="whitespace-pre-wrap">{m.text}</div>
            </div>
          ))}
        </div>

        {createdBusiness && (
          <div className="mb-4 p-3 border-l-4 border-success bg-success/10 rounded">
            <div className="font-semibold">Created business:</div>
            <pre className="text-sm">{JSON.stringify(createdBusiness, null, 2)}</pre>
          </div>
        )}

        <div className="flex gap-2">
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            className="input flex-1"
            placeholder="Ask the seller assistant or request a new business"
          />
          <button className="btn btn-primary" onClick={send} disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
        </div>
      </div>
    </section>
  );
};

export default SellerChat;
