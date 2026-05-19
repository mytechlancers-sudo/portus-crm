"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Reports({ users, dark }: any) {
  const [activities, setActivities] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const { data: acts } = await supabase.from("activities").select("*");
    if (acts) setActivities(acts);
    const { data: rpts } = await supabase.from("call_reports").select("*");
    if (rpts) setReports(rpts);
  }

  const bg = dark ? "#0D1117" : "#F0F2FF";
  const cardBg = dark ? "#161B27" : "white";
  const border = dark ? "#1E2535" : "#E4E6F0";
  const textPrimary = dark ? "#F0F4FF" : "#0A0F2C";
  const textSecondary = dark ? "#8892A4" : "#6B7280";
  const rowBg = dark ? "#0D1117" : "#F7F8FF";

  const card = { background: cardBg, borderRadius: "16px", padding: "18px 20px", border: `1px solid ${border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" };

  const byUser = users.map((u: any) => {
    const ua = activities.filter((a: any) => a.user_id === u.id);
    const calls = ua.filter((a: any) => a.type === "call").length;
    const connected = ua.filter((a: any) => a.type === "call" && a.status === "completed").length;
    const meetings = ua.filter((a: any) => a.type === "meeting").length;
    const ur = reports.filter((r: any) => r.user_id === u.id);
    const closes = ur.reduce((s: number, r: any) => s + (r.closes || 0), 0);
    const revenue = ur.reduce((s: number, r: any) => s + (r.revenue_closed || 0), 0);
    const connectRate = calls > 0 ? Math.round((connected / calls) * 100) : 0;
    return { ...u, calls, connected, connectRate, meetings, closes, revenue };
  });

  const totalCalls = byUser.reduce((s: number, u: any) => s + u.calls, 0);
  const avgConnect = byUser.length > 0 ? Math.round(byUser.reduce((s: number, u: any) => s + u.connectRate, 0) / byUser.length) : 0;
  const totalCloses = byUser.reduce((s: number, u: any) => s + u.closes, 0);
  const totalRevenue = byUser.reduce((s: number, u: any) => s + u.revenue, 0);

  const colors = ["linear-gradient(135deg,#0057FF,#00C9A7)", "linear-gradient(135deg,#00C9A7,#00856E)", "linear-gradient(135deg,#FFB020,#B8860B)", "linear-gradient(135deg,#7C3AED,#6D28D9)"];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px", background: bg }}>
      <div style={{ fontSize: "20px", fontWeight: 800, color: textPrimary, marginBottom: "4px" }}>Sales Reports</div>
      <div style={{ fontSize: "13px", color: textSecondary, marginBottom: "20px" }}>Track performance - calls, connect rates, monthly closes</div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "20px" }}>
        {[
          { label: "Total Calls", value: totalCalls, color: "#0057FF" },
          { label: "Avg Connect Rate", value: `${avgConnect}%`, color: "#00856E" },
          { label: "Total Closes", value: totalCloses, color: "#B8860B" },
          { label: "Revenue", value: `$${totalRevenue}`, color: "#7C3AED" },
        ].map((k) => (
          <div key={k.label} style={{ background: cardBg, borderRadius: "16px", padding: "16px", border: `1px solid ${border}` }}>
            <div style={{ fontSize: "26px", fontWeight: 900, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: "11px", color: textSecondary, marginTop: "4px", fontWeight: 700, textTransform: "uppercase" }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* 3 cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "20px" }}>
        {/* Daily Calls */}
        <div style={card}>
          <div style={{ fontSize: "12px", fontWeight: 800, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>Daily Calls</div>
          {byUser.map((u: any, i: number) => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: colors[i % 4], display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "10px", fontWeight: 800, flexShrink: 0 }}>
                {u.avatar_initials || u.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: textPrimary }}>{u.name.split(" ")[0]}</span>
                  <span style={{ fontSize: "12px", fontWeight: 900, color: "#0057FF" }}>{u.calls}</span>
                </div>
                <div style={{ background: border, borderRadius: "3px", height: "5px", overflow: "hidden" }}>
                  <div style={{ background: colors[i % 4], height: "100%", width: `${Math.min((u.calls / Math.max(totalCalls, 1)) * 100, 100)}%`, borderRadius: "3px" }} />
                </div>
                <div style={{ fontSize: "10px", color: textSecondary, marginTop: "2px" }}>{u.connected} connected</div>
              </div>
            </div>
          ))}
        </div>

        {/* Connect Rate */}
        <div style={card}>
          <div style={{ fontSize: "12px", fontWeight: 800, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>Connect Rate</div>
          {byUser.map((u: any, i: number) => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: colors[i % 4], display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "10px", fontWeight: 800, flexShrink: 0 }}>
                {u.avatar_initials || u.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: textPrimary }}>{u.name.split(" ")[0]}</span>
                  <span style={{ fontSize: "12px", fontWeight: 900, color: u.connectRate >= 60 ? "#00856E" : u.connectRate >= 40 ? "#B8860B" : "#C0384A" }}>{u.connectRate}%</span>
                </div>
                <div style={{ background: border, borderRadius: "3px", height: "5px", overflow: "hidden" }}>
                  <div style={{ background: colors[i % 4], height: "100%", width: `${u.connectRate}%`, borderRadius: "3px" }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Closes */}
        <div style={card}>
          <div style={{ fontSize: "12px", fontWeight: 800, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>Monthly Closes</div>
          {byUser.map((u: any, i: number) => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: colors[i % 4], display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "10px", fontWeight: 800, flexShrink: 0 }}>
                {u.avatar_initials || u.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: textPrimary }}>{u.name.split(" ")[0]}</span>
                  <span style={{ fontSize: "12px", fontWeight: 900, color: "#00856E" }}>{u.closes}</span>
                </div>
                <div style={{ background: border, borderRadius: "3px", height: "5px", overflow: "hidden" }}>
                  <div style={{ background: colors[i % 4], height: "100%", width: `${Math.min(u.closes * 20, 100)}%`, borderRadius: "3px" }} />
                </div>
                <div style={{ fontSize: "10px", color: textSecondary, marginTop: "2px" }}>${u.revenue}/mo</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Table */}
      <div style={card}>
        <div style={{ fontSize: "14px", fontWeight: 800, color: textPrimary, marginBottom: "16px" }}>Monthly Summary</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: rowBg }}>
              {["Salesperson", "Total Calls", "Connect %", "Demos", "Closes", "Revenue"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: h === "Salesperson" ? "left" : "center", fontSize: "10px", fontWeight: 800, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {byUser.map((u: any, i: number) => (
              <tr key={u.id} style={{ borderBottom: `1px solid ${border}` }}>
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: colors[i % 4], display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "10px", fontWeight: 800 }}>{u.avatar_initials || u.name[0]}</div>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: textPrimary }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: "12px", textAlign: "center", fontWeight: 700, color: textPrimary }}>{u.calls}</td>
                <td style={{ padding: "12px", textAlign: "center", fontWeight: 900, color: u.connectRate >= 60 ? "#00856E" : u.connectRate >= 40 ? "#B8860B" : "#C0384A" }}>{u.connectRate}%</td>
                <td style={{ padding: "12px", textAlign: "center", fontWeight: 700, color: textPrimary }}>{u.meetings}</td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <span style={{ background: "#EEF3FF", color: "#0057FF", fontWeight: 800, padding: "2px 8px", borderRadius: "6px", fontSize: "12px" }}>{u.closes}</span>
                </td>
                <td style={{ padding: "12px", textAlign: "center", fontWeight: 800, color: "#00856E" }}>{u.revenue > 0 ? `$${u.revenue}/mo` : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
