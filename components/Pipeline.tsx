"use client";
import { supabase } from "@/lib/supabase";

const stages = [
  { id: "new", label: "New", color: "#9BA3B8" },
  { id: "contacted", label: "Contacted", color: "#0057FF" },
  { id: "demo", label: "Demo Set", color: "#B8860B" },
  { id: "quoted", label: "Quoted", color: "#7C3AED" },
  { id: "won", label: "Won", color: "#00856E" },
  { id: "lost", label: "Lost", color: "#C0384A" },
];

export default function Pipeline({ leads, dark }: any) {
  const bg = dark ? "#0D1117" : "#F0F2FF";
  const cardBg = dark ? "#161B27" : "white";
  const border = dark ? "#1E2535" : "#E4E6F0";
  const textPrimary = dark ? "#F0F4FF" : "#0A0F2C";
  const textSecondary = dark ? "#8892A4" : "#6B7280";
  const rowBg = dark ? "#0D1117" : "#F7F8FF";

  return (
    <div style={{ flex: 1, overflow: "hidden", padding: "20px", background: bg, display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: "20px", fontWeight: 800, color: textPrimary, marginBottom: "4px" }}>Sales Pipeline</div>
      <div style={{ fontSize: "13px", color: textSecondary, marginBottom: "16px" }}>Track every deal from first contact to close</div>
      <div style={{ display: "flex", gap: "12px", overflowX: "auto", flex: 1 }}>
        {stages.map((stage) => {
          const sl = leads.filter((l: any) => (l.status || "new") === stage.id);
          return (
            <div key={stage.id} style={{ minWidth: "190px", background: cardBg, borderRadius: "14px", border: "1px solid " + border, padding: "13px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, color: stage.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>{stage.label}</span>
                <span style={{ background: rowBg, color: textSecondary, fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "7px" }}>{sl.length}</span>
              </div>
              <div style={{ overflowY: "auto", flex: 1 }}>
                {sl.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "20px", color: textSecondary, fontSize: "12px" }}>Empty</div>
                ) : sl.slice(0, 8).map((lead: any) => (
                  <div key={lead.id} style={{ background: rowBg, border: "1.5px solid " + border, borderRadius: "10px", padding: "10px 12px", marginBottom: "8px", cursor: "pointer" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.company_name}</div>
                    <div style={{ fontSize: "10px", color: textSecondary, marginTop: "2px" }}>{lead.country} - {lead.source}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
