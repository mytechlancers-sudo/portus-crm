"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Leads({ leads, users, refetch, dark }: any) {
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState<any>(null);
  const [showFU, setShowFU] = useState(false);
  const [fuType, setFuType] = useState("Call");
  const [fuStatus, setFuStatus] = useState("Completed");
  const [fuNotes, setFuNotes] = useState("");
  const [fuDate, setFuDate] = useState("");
  const [saving, setSaving] = useState(false);

  const bg = dark ? "#0D1117" : "#F0F2FF";
  const cardBg = dark ? "#161B27" : "white";
  const border = dark ? "#1E2535" : "#E4E6F0";
  const textPrimary = dark ? "#F0F4FF" : "#0A0F2C";
  const textSecondary = dark ? "#8892A4" : "#6B7280";
  const inputBg = dark ? "#0D1117" : "#F7F8FF";

  const filtered = leads.filter((l: any) => {
    const matchSearch = !search ||
      l.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      l.contact_name?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase());
    const matchSource = filterSource === "all" || l.source === filterSource;
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchSearch && matchSource && matchStatus;
  });

  const statusColors: any = {
    new: { bg: "#F1F2F6", color: "#5A6072" },
    contacted: { bg: "#EEF3FF", color: "#0057FF" },
    demo: { bg: "#FFF6E8", color: "#B8860B" },
    quoted: { bg: "#F3EFFE", color: "#6D28D9" },
    won: { bg: "#E8FBF7", color: "#00856E" },
    lost: { bg: "#FFF0F3", color: "#C0384A" },
  };

  async function saveFollowUp() {
    if (!selected) return;
    setSaving(true);
    await supabase.from("activities").insert({
      lead_id: selected.id,
      type: fuType.toLowerCase(),
      status: fuStatus.toLowerCase(),
      notes: fuNotes,
      scheduled_at: fuDate || new Date().toISOString(),
      completed_at: fuStatus === "Completed" ? new Date().toISOString() : null,
    });
    await supabase.from("leads").update({ status: "contacted", updated_at: new Date().toISOString() }).eq("id", selected.id);
    setShowFU(false);
    setFuNotes("");
    setSaving(false);
    refetch();
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("leads").update({ status }).eq("id", id);
    refetch();
    if (selected?.id === id) setSelected({ ...selected, status });
  }

  const inp = {
    width: "100%", border: `1px solid ${border}`, borderRadius: "10px",
    padding: "9px 12px", fontSize: "13px", color: textPrimary,
    background: cardBg, outline: "none", fontFamily: "inherit",
  };

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", background: bg }}>
      {/* LIST */}
      <div style={{ width: selected ? "380px" : "100%", minWidth: selected ? "380px" : "auto", display: "flex", flexDirection: "column", overflow: "hidden", borderRight: selected ? `1px solid ${border}` : "none" }}>
        {/* Filters */}
        <div style={{ padding: "14px 16px", background: cardBg, borderBottom: `1px solid ${border}`, display: "flex", gap: "10px", alignItems: "center" }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            style={{ ...inp, flex: 1, padding: "8px 12px" }} />
          <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)}
            style={{ ...inp, width: "auto", padding: "8px 12px" }}>
            <option value="all">All Sources</option>
            <option value="JCTrans">JCTrans</option>
            <option value="GLA">GLA</option>
            <option value="PIFFA">PIFFA</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            style={{ ...inp, width: "auto", padding: "8px 12px" }}>
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="demo">Demo</option>
            <option value="quoted">Quoted</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
          <span style={{ fontSize: "12px", color: textSecondary, whiteSpace: "nowrap", fontWeight: 700 }}>{filtered.length} leads</span>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: textSecondary }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
              <p style={{ fontSize: "14px", fontWeight: 600 }}>No leads found</p>
            </div>
          ) : filtered.map((lead: any) => {
            const sc = statusColors[lead.status] || statusColors.new;
            return (
              <div key={lead.id} onClick={() => setSelected(lead)}
                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "14px", cursor: "pointer", marginBottom: "6px", border: `1.5px solid ${selected?.id === lead.id ? "#0057FF" : border}`, background: selected?.id === lead.id ? (dark ? "#161B27" : "#EEF3FF") : cardBg, transition: "all 0.15s" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg,#0057FF,#00C9A7)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "14px", fontWeight: 800, flexShrink: 0 }}>
                  {(lead.company_name || "?")[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.company_name}</div>
                  <div style={{ fontSize: "11px", color: textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.contact_name} - {lead.country}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                  <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "6px", fontWeight: 700, background: sc.bg, color: sc.color }}>{lead.status || "new"}</span>
                  <span style={{ fontSize: "10px", color: textSecondary }}>{lead.source}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAIL */}
      {selected && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: bg }}>
          {/* Header */}
          <div style={{ padding: "18px 20px", background: cardBg, borderBottom: `1px solid ${border}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "13px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg,#0057FF,#00C9A7)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "20px", fontWeight: 900 }}>
                  {(selected.company_name || "?")[0]}
                </div>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: textPrimary }}>{selected.company_name}</div>
                  <div style={{ display: "flex", gap: "6px", marginTop: "5px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "6px", fontWeight: 700, background: "#EEF3FF", color: "#0057FF" }}>{selected.status || "new"}</span>
                    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "6px", fontWeight: 700, background: "#E8FBF7", color: "#00856E" }}>{selected.source}</span>
                    {selected.country && <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "6px", fontWeight: 700, background: dark ? "#1E2535" : "#F1F2F6", color: textSecondary }}>{selected.country}</span>}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: textSecondary }}>X</button>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button onClick={() => setShowFU(!showFU)} style={{ padding: "9px 16px", borderRadius: "10px", background: "linear-gradient(135deg,#0057FF,#00C9A7)", color: "white", fontWeight: 700, fontSize: "13px", border: "none", cursor: "pointer" }}>Follow Up</button>
              <button onClick={() => updateStatus(selected.id, "demo")} style={{ padding: "9px 16px", borderRadius: "10px", background: "#FFF6E8", color: "#B8860B", border: "1.5px solid #F9E4A0", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>Set Demo</button>
              <button onClick={() => updateStatus(selected.id, "won")} style={{ padding: "9px 16px", borderRadius: "10px", background: "#E8FBF7", color: "#00856E", border: "1.5px solid #B2EDE5", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>Won</button>
              <button onClick={() => updateStatus(selected.id, "lost")} style={{ padding: "9px 16px", borderRadius: "10px", background: "#FFF0F3", color: "#C0384A", border: "1.5px solid #FFD0DA", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>Lost</button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
            {/* FU Form */}
            {showFU && (
              <div style={{ background: dark ? "#161B27" : "#EEF3FF", border: `2px dashed #0057FF`, borderRadius: "16px", padding: "16px", marginBottom: "16px" }}>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#0057FF", marginBottom: "12px" }}>New Follow Up</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                  <div>
                    <label style={{ fontSize: "10px", fontWeight: 800, color: textSecondary, display: "block", marginBottom: "4px", textTransform: "uppercase" }}>Type</label>
                    <select value={fuType} onChange={(e) => setFuType(e.target.value)} style={inp}>
                      <option>Call</option><option>WhatsApp</option><option>Email</option><option>Meeting</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", fontWeight: 800, color: textSecondary, display: "block", marginBottom: "4px", textTransform: "uppercase" }}>Status</label>
                    <select value={fuStatus} onChange={(e) => setFuStatus(e.target.value)} style={inp}>
                      <option>Completed</option><option>Pending</option><option>Missed</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={{ fontSize: "10px", fontWeight: 800, color: textSecondary, display: "block", marginBottom: "4px", textTransform: "uppercase" }}>Date & Time</label>
                    <input type="datetime-local" value={fuDate} onChange={(e) => setFuDate(e.target.value)} style={inp} />
                  </div>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={{ fontSize: "10px", fontWeight: 800, color: textSecondary, display: "block", marginBottom: "4px", textTransform: "uppercase" }}>Notes</label>
                    <textarea value={fuNotes} onChange={(e) => setFuNotes(e.target.value)} rows={2} placeholder="What happened?" style={{ ...inp, resize: "none" }} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <button onClick={saveFollowUp} disabled={saving} style={{ padding: "10px", background: "linear-gradient(135deg,#0057FF,#00C9A7)", color: "white", border: "none", borderRadius: "10px", fontWeight: 800, fontSize: "13px", cursor: "pointer" }}>
                    {saving ? "Saving..." : "Save Follow Up"}
                  </button>
                  <button onClick={() => setShowFU(false)} style={{ padding: "10px", background: cardBg, color: textSecondary, border: `1px solid ${border}`, borderRadius: "10px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div style={{ background: cardBg, borderRadius: "16px", padding: "16px 18px", border: `1px solid ${border}`, marginBottom: "12px" }}>
              <div style={{ fontSize: "13px", fontWeight: 800, color: textPrimary, marginBottom: "12px" }}>Contact Info</div>
              {[
                { label: "Contact", value: selected.contact_name },
                { label: "Mobile", value: selected.mobile },
                { label: "Email", value: selected.email },
                { label: "WhatsApp", value: selected.whatsapp },
                { label: "Website", value: selected.website },
              ].filter(f => f.value).map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${border}` }}>
                  <span style={{ fontSize: "12px", color: textSecondary, fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: textPrimary }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Quick Insights */}
            <div style={{ background: cardBg, borderRadius: "16px", padding: "16px 18px", border: `1px solid ${border}` }}>
              <div style={{ fontSize: "13px", fontWeight: 800, color: textPrimary, marginBottom: "12px" }}>Quick Insights</div>
              {[
                { label: "Current Software", value: selected.current_software },
                { label: "No of Users", value: selected.no_of_users },
                { label: "Employees", value: selected.employee_count },
                { label: "Source", value: selected.source },
                { label: "Founded", value: selected.founded_year },
              ].filter(f => f.value).map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${border}` }}>
                  <span style={{ fontSize: "12px", color: textSecondary, fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: textPrimary }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
