"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Quotations({ leads, dark }: any) {
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [items, setItems] = useState([
    { description: "Portus ERP Standard Plan", qty: 1, price: 99 },
    { description: "Setup and Onboarding Fee", qty: 1, price: 200 },
  ]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const bg = dark ? "#0D1117" : "#F0F2FF";
  const cardBg = dark ? "#161B27" : "white";
  const border = dark ? "#1E2535" : "#E4E6F0";
  const textPrimary = dark ? "#F0F4FF" : "#0A0F2C";
  const textSecondary = dark ? "#8892A4" : "#6B7280";
  const inp = { width: "100%", border: "1px solid " + border, borderRadius: "10px", padding: "9px 12px", fontSize: "13px", color: textPrimary, background: cardBg, outline: "none", fontFamily: "inherit" };

  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  async function sendQuote() {
    if (!selectedLead) return alert("Select a lead first!");
    setSending(true);
    const qNum = "Q-" + Date.now();
    const { data: q } = await supabase.from("quotations").insert({ lead_id: selectedLead.id, quote_number: qNum, status: "sent", total_amount: total, message, sent_at: new Date().toISOString() }).select().single();
    if (q) {
      await supabase.from("quote_items").insert(items.map(i => ({ quotation_id: q.id, description: i.description, quantity: i.qty, unit_price: i.price })));
      await supabase.from("activities").insert({ lead_id: selectedLead.id, type: "email", status: "completed", notes: "Quotation " + qNum + " sent - Total: $" + total, completed_at: new Date().toISOString() });
      await supabase.from("leads").update({ status: "quoted" }).eq("id", selectedLead.id);
    }
    setSending(false); setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px", background: bg }}>
      <div style={{ fontSize: "20px", fontWeight: 800, color: textPrimary, marginBottom: "4px" }}>Send Quotation</div>
      <div style={{ fontSize: "13px", color: textSecondary, marginBottom: "20px" }}>Build quote and send via email with PDF</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ background: cardBg, borderRadius: "16px", padding: "18px 20px", border: "1px solid " + border }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: textPrimary, marginBottom: "12px" }}>Select Client</div>
            <select onChange={(e) => setSelectedLead(leads.find((l: any) => l.id === e.target.value))} style={inp}>
              <option value="">-- Select a lead --</option>
              {leads.map((l: any) => <option key={l.id} value={l.id}>{l.company_name} - {l.contact_name}</option>)}
            </select>
            {selectedLead && (
              <div style={{ marginTop: "10px", padding: "10px 14px", background: "#EEF3FF", borderRadius: "10px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#0057FF" }}>{selectedLead.company_name}</div>
                <div style={{ fontSize: "11px", color: "#5A6072", marginTop: "2px" }}>{selectedLead.email}</div>
              </div>
            )}
          </div>

          <div style={{ background: cardBg, borderRadius: "16px", padding: "18px 20px", border: "1px solid " + border }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: textPrimary, marginBottom: "12px" }}>Line Items</div>
            {items.map((item, idx) => (
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 32px", gap: "8px", marginBottom: "8px" }}>
                <input value={item.description} onChange={(e) => { const n = [...items]; n[idx].description = e.target.value; setItems(n); }} style={inp} />
                <input type="number" value={item.qty} onChange={(e) => { const n = [...items]; n[idx].qty = parseInt(e.target.value); setItems(n); }} style={{ ...inp, textAlign: "center" }} />
                <input type="number" value={item.price} onChange={(e) => { const n = [...items]; n[idx].price = parseFloat(e.target.value); setItems(n); }} style={{ ...inp, textAlign: "right" }} />
                <button onClick={() => setItems(items.filter((_, i) => i !== idx))} style={{ background: "#FFF0F3", color: "#C0384A", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>x</button>
              </div>
            ))}
            <button onClick={() => setItems([...items, { description: "New Item", qty: 1, price: 0 }])} style={{ fontSize: "13px", fontWeight: 700, color: "#0057FF", background: "none", border: "none", cursor: "pointer", marginTop: "4px" }}>+ Add Item</button>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "12px", marginTop: "14px", paddingTop: "12px", borderTop: "1px solid " + border }}>
              <span style={{ fontSize: "13px", color: textSecondary, fontWeight: 600 }}>Total:</span>
              <span style={{ fontSize: "24px", fontWeight: 900, color: "#0057FF" }}>${total}</span>
            </div>
          </div>

          <div style={{ background: cardBg, borderRadius: "16px", padding: "18px 20px", border: "1px solid " + border }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: textPrimary, marginBottom: "12px" }}>Message</div>
            <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Dear Client, please find your Portus ERP quotation attached..." style={{ ...inp, resize: "none" }} />
          </div>

          <button onClick={sendQuote} disabled={sending} style={{ padding: "14px", background: "linear-gradient(135deg,#0057FF,#00C9A7)", color: "white", border: "none", borderRadius: "14px", fontWeight: 800, fontSize: "14px", cursor: "pointer" }}>
            {sending ? "Sending..." : "Send Quotation via Email (PDF)"}
          </button>

          {sent && (
            <div style={{ background: "#E8FBF7", border: "1.5px solid #B2EDE5", borderRadius: "14px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#00856E" }}>Quotation sent successfully!</div>
            </div>
          )}
        </div>

        <div style={{ background: cardBg, borderRadius: "16px", padding: "18px 20px", border: "1px solid " + border, height: "fit-content" }}>
          <div style={{ fontSize: "14px", fontWeight: 800, color: textPrimary, marginBottom: "12px" }}>Preview</div>
          <div style={{ background: dark ? "#0D1117" : "#F7F8FF", borderRadius: "12px", padding: "14px", border: "1px solid " + border }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px solid " + border }}>
              <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg,#0057FF,#00C9A7)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: "12px" }}>P</div>
              <div style={{ fontWeight: 800, fontSize: "13px", color: textPrimary }}>Portus ERP</div>
            </div>
            {selectedLead && <div style={{ fontWeight: 700, color: textPrimary, fontSize: "13px", marginBottom: "10px" }}>{selectedLead.company_name}</div>}
            {items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid " + border, fontSize: "12px" }}>
                <span style={{ color: textSecondary }}>{item.description}</span>
                <span style={{ fontWeight: 700, color: textPrimary }}>${item.qty * item.price}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px" }}>
              <span style={{ fontWeight: 800, color: textPrimary }}>Total</span>
              <span style={{ fontWeight: 900, color: "#0057FF", fontSize: "18px" }}>${total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
