"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const fields = [
  { key: "can_read", label: "Read" },
  { key: "can_write", label: "Write" },
  { key: "can_delete", label: "Delete" },
  { key: "can_scraper", label: "Scraper" },
  { key: "can_reports", label: "Reports" },
  { key: "can_admin", label: "Admin" },
];

const defaults: any = {
  super_admin: { can_read: true, can_write: true, can_delete: true, can_scraper: true, can_reports: true, can_admin: true },
  manager: { can_read: true, can_write: true, can_delete: false, can_scraper: true, can_reports: true, can_admin: false },
  sales_rep: { can_read: true, can_write: true, can_delete: false, can_scraper: false, can_reports: true, can_admin: false },
  viewer: { can_read: true, can_write: false, can_delete: false, can_scraper: false, can_reports: false, can_admin: false },
};

const colors = [
  "linear-gradient(135deg,#0057FF,#00C9A7)",
  "linear-gradient(135deg,#00C9A7,#00856E)",
  "linear-gradient(135deg,#FFB020,#B8860B)",
  "linear-gradient(135deg,#7C3AED,#6D28D9)",
];

export default function Permissions({ users, refetch, dark }: any) {
  const [saving, setSaving] = useState(false);
  const [perms, setPerms] = useState<any>({});

  const bg = dark ? "#0D1117" : "#F0F2FF";
  const cardBg = dark ? "#161B27" : "white";
  const border = dark ? "#1E2535" : "#E4E6F0";
  const textPrimary = dark ? "#F0F4FF" : "#0A0F2C";
  const textSecondary = dark ? "#8892A4" : "#6B7280";
  const rowBg = dark ? "#0D1117" : "#F7F8FF";

  async function saveAll() {
    setSaving(true);
    for (const [userId, changes] of Object.entries(perms)) {
      await supabase.from("permissions").upsert({ user_id: userId, ...(changes as any), updated_at: new Date().toISOString() });
    }
    setSaving(false);
    setPerms({});
    refetch();
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px", background: bg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: textPrimary, marginBottom: "4px" }}>Permissions</div>
          <div style={{ fontSize: "13px", color: textSecondary }}>Control what each team member can access</div>
        </div>
        <button onClick={saveAll} disabled={saving || Object.keys(perms).length === 0}
          style={{ padding: "10px 20px", background: "linear-gradient(135deg,#0057FF,#00C9A7)", color: "white", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "13px", cursor: "pointer", opacity: Object.keys(perms).length === 0 ? 0.5 : 1 }}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
      <div style={{ background: cardBg, borderRadius: "16px", border: "1px solid " + border, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: rowBg }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "10px", fontWeight: 800, color: textSecondary, textTransform: "uppercase" }}>Member</th>
              {fields.map(f => (
                <th key={f.key} style={{ padding: "12px 8px", textAlign: "center", fontSize: "10px", fontWeight: 800, color: textSecondary, textTransform: "uppercase" }}>{f.label}</th>
              ))}
              <th style={{ padding: "12px 16px", textAlign: "center", fontSize: "10px", fontWeight: 800, color: textSecondary, textTransform: "uppercase" }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any, i: number) => {
              const up = { ...defaults[user.role] || defaults.viewer, ...perms[user.id] };
              const isAdmin = user.role === "super_admin";
              return (
                <tr key={user.id} style={{ borderBottom: "1px solid " + border }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: colors[i % 4], display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "11px", fontWeight: 800 }}>
                        {user.avatar_initials || user.name[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: textPrimary }}>{user.name}</div>
                        <div style={{ fontSize: "11px", color: textSecondary }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  {fields.map(f => (
                    <td key={f.key} style={{ padding: "14px 8px", textAlign: "center" }}>
                      <div
                        onClick={() => {
                          if (isAdmin) return;
                          setPerms((prev: any) => ({ ...prev, [user.id]: { ...prev[user.id], [f.key]: !up[f.key] } }));
                        }}
                        style={{ width: "38px", height: "22px", borderRadius: "11px", background: up[f.key] ? "#0057FF" : border, cursor: isAdmin ? "not-allowed" : "pointer", position: "relative", margin: "0 auto", transition: "background 0.2s" }}
                      >
                        <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "white", position: "absolute", top: "2px", left: up[f.key] ? "18px" : "2px", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                      </div>
                    </td>
                  ))}
                  <td style={{ padding: "14px 16px", textAlign: "center" }}>
                    <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "6px", fontWeight: 700, background: user.role === "super_admin" ? "#EEF3FF" : user.role === "manager" ? "#FFF6E8" : "#E8FBF7", color: user.role === "super_admin" ? "#0057FF" : user.role === "manager" ? "#B8860B" : "#00856E" }}>
                      {user.role.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
