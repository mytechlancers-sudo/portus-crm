"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const colors = [
  "linear-gradient(135deg,#0057FF,#00C9A7)",
  "linear-gradient(135deg,#00C9A7,#00856E)",
  "linear-gradient(135deg,#FFB020,#B8860B)",
  "linear-gradient(135deg,#7C3AED,#6D28D9)",
];

export default function Team({ users, refetch, dark }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("sales_rep");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const bg = dark ? "#0D1117" : "#F0F2FF";
  const cardBg = dark ? "#161B27" : "white";
  const border = dark ? "#1E2535" : "#E4E6F0";
  const textPrimary = dark ? "#F0F4FF" : "#0A0F2C";
  const textSecondary = dark ? "#8892A4" : "#6B7280";
  const inp = { width: "100%", border: "1px solid " + border, borderRadius: "10px", padding: "9px 12px", fontSize: "13px", color: textPrimary, background: cardBg, outline: "none", fontFamily: "inherit" };

  async function invite() {
    if (!name || !email) return alert("Name and email required!");
    setSaving(true);
    const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
    await supabase.from("users").insert({ name, email, role, avatar_initials: initials, is_active: true });
    setName(""); setEmail(""); setRole("sales_rep");
    setSaving(false); setDone(true);
    setTimeout(() => setDone(false), 3000);
    refetch();
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px", background: bg }}>
      <div style={{ fontSize: "20px", fontWeight: 800, color: textPrimary, marginBottom: "4px" }}>Team Members</div>
      <div style={{ fontSize: "13px", color: textSecondary, marginBottom: "20px" }}>{users.length} active members</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
        {users.map((u: any, i: number) => (
          <div key={u.id} style={{ background: cardBg, border: "1.5px solid " + border, borderRadius: "14px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: colors[i % 4], display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "14px", fontWeight: 800, flexShrink: 0 }}>
              {u.avatar_initials || u.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: textPrimary }}>{u.name}</div>
              <div style={{ fontSize: "11px", color: textSecondary }}>{u.email}</div>
            </div>
            <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "6px", fontWeight: 700, background: u.role === "super_admin" ? "#EEF3FF" : u.role === "manager" ? "#FFF6E8" : "#E8FBF7", color: u.role === "super_admin" ? "#0057FF" : u.role === "manager" ? "#B8860B" : "#00856E", whiteSpace: "nowrap" }}>
              {u.role.replace("_", " ")}
            </span>
          </div>
        ))}
      </div>

      <div style={{ background: dark ? "#161B27" : "#EEF3FF", border: "2px dashed #0057FF", borderRadius: "16px", padding: "20px" }}>
        <div style={{ fontSize: "14px", fontWeight: 800, color: "#0057FF", marginBottom: "14px" }}>Invite New Member</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
          <div>
            <label style={{ fontSize: "10px", fontWeight: 800, color: textSecondary, display: "block", marginBottom: "4px", textTransform: "uppercase" }}>Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ali Hassan" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: "10px", fontWeight: 800, color: textSecondary, display: "block", marginBottom: "4px", textTransform: "uppercase" }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ali@portuspk.com" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: "10px", fontWeight: 800, color: textSecondary, display: "block", marginBottom: "4px", textTransform: "uppercase" }}>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={inp}>
              <option value="sales_rep">Sales Rep</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>
        <button onClick={invite} disabled={saving} style={{ width: "100%", padding: "11px", background: "linear-gradient(135deg,#0057FF,#00C9A7)", color: "white", border: "none", borderRadius: "10px", fontWeight: 800, fontSize: "13px", cursor: "pointer" }}>
          {saving ? "Adding..." : "Add Team Member"}
        </button>
        {done && <div style={{ marginTop: "10px", background: "#E8FBF7", color: "#00856E", fontWeight: 700, fontSize: "13px", padding: "10px", borderRadius: "10px", textAlign: "center" }}>Member added!</div>}
      </div>
    </div>
  );
}
