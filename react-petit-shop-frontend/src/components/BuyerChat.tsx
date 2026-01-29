import React, { useEffect, useState } from 'react'

// Allow configuring API base via Vite env `VITE_API_BASE`.
// Fallback in development to localhost:4000 where the Express AI server runs.
const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? 'http://localhost:4000' : '');

export const BuyerChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Array<{role:string,content:string}>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // load previous session if any
    try {
      const s = sessionStorage.getItem('buyer_chat');
      if (s) setMessages(JSON.parse(s));
    } catch { }
  }, []);

  useEffect(() => {
    try { sessionStorage.setItem('buyer_chat', JSON.stringify(messages)); } catch {}
  }, [messages]);

  const send = async () => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setText('');
    setLoading(true);
    try {
      const buyer = buyerUser ? JSON.parse(buyerUser) : null;
      const res = await fetch(`${API_BASE}/diff/ai/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, history: messages, buyer })
      });
      if (!res.ok) {
        const txt = await res.text();
        setMessages((m) => [...m, { role: 'assistant', content: 'Error: ' + txt }]);
      } else {
        const data = await res.json();
        const reply = data.reply ?? data?.raw?.choices?.[0]?.message?.content ?? 'No reply';
        setMessages((m) => [...m, { role: 'assistant', content: reply }]);
      }
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Network error' }]);
    } finally { setLoading(false); }
  };

  const buyerUser = typeof window !== 'undefined' ? localStorage.getItem('buyer_user') : null;
  if (!buyerUser) return null; // only show to buyers

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col items-end gap-2">
          {open && (
            <div className="w-80 bg-base-100 border shadow-lg rounded-lg p-3">
              <div className="h-56 overflow-auto mb-2">
                {messages.map((m, i) => (
                  <div key={i} className={`mb-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-2 rounded ${m.role === 'user' ? 'bg-primary text-white' : 'bg-base-200'}`}>{m.content}</div>
                  </div>
                ))}
                {loading && (
                  <div className="mb-2 text-left"><div className="inline-block p-2 rounded bg-base-200">Assistant is typing...</div></div>
                )}
              </div>
              <div className="flex gap-2">
                <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} className="input input-bordered flex-1" placeholder="Ask support..." />
                <button className="btn btn-primary" onClick={send} disabled={loading}>{loading ? '...' : 'Send'}</button>
              </div>
            </div>
          )}

          <button className="btn btn-circle btn-primary" onClick={() => setOpen((o) => !o)} aria-label="Open chat">{open ? '✕' : '💬'}</button>
        </div>
      </div>
    </>
  );
};

export default BuyerChat;
