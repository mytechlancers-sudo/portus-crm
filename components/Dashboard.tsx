"use client";

export default function Dashboard({ leads, users, dark }: any) {
  const total = leads.length;
  const contacted = leads.filter((l: any) => l.status !== "new").length;
  const demos = leads.filter((l: any) => l.status === "demo").length;
  const won = leads.filter((l: any) => l.status === "won").length;

  const bg = dark ? "#0D1117" : "#F0F2FF";
  const cardBg = dark ? "#161B27" : "white";
  const border = dark ? "#1E2535" : "#E4E6F0";
  const textPrimary = dark ? "#F0F4FF" : "#0A0F2C";
  const textSecondary = dark ? "#4A5568" : "#9BA3B8";
  const rowBg = dark ? "#0D1117" : "#F7F8FF";

  const card = {
    background: cardBg,
    borderRadius: "16px",
    padding: "18px 20px",
    border: `1px solid ${border}`,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    marginBottom: "16px",
  };

  const cardTitle = {
    fontSize: "14px",
    fontWeight: 800,
    color: textPrimary,
    marginBottom: "14px",
  };

  return (
    <div style={{ flex: 1, overflowY: "auto" as const, padding: "20px", background: bg }}>
      <div style={{ fontSize: "20px", fontWeight: 800, color: textPrimary, marginBottom: "4px" }}>
        Good morning, Yaseen
      </div>
      <div style={{ fontSize: "13px", color: textSecondary, marginBottom: "20px" }}>
        Here is what is happening today
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "20px" }}>
        {[
          { label: "Total Leads", value: total, color: "#0057FF" },
          { label: "Contacted", value: contacted, color: "#7C3AED" },
          { label: "Demos Set", value: demos, color: "#B8860B" },
          { label: "Won", value: won, color: "#00856E" },
        ].map((k) => (
          <div key={k.label} style={{ background: cardBg, borderRadius: "16px", padding: "16px", border: `1px solid ${border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "28px", fontWeight: 900, color: k.color }}>{k.value.toLocaleString()}</div>
            <div style={{ fontSize: "11px", color: textSecondary, marginTop: "4px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Two col */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "16px" }}>
        {/* Left */}
        <div>
          {/* Scraper */}
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={cardTitle}>Scraper Status</div>
              <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "6px", fontWeight: 700, background: "#E8FBF7", color: "#00856E" }}>LIVE</span>
            </div>
            <div style={{ background: rowBg, borderRadius: "12px", padding: "14px", marginBottom: "10px", border: `1px solid ${border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: textPrimary }}>Pakistan - JCTrans</span>
                <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "6px", fontWeight: 700, background: "#E8FBF7", color: "#00856E" }}>RUNNING</span>
              </div>
              <div style={{ fontSize: "12px", color: textSecondary, marginBottom: "8px" }}>Page 14 / 450 - 287 leads today</div>
              <div style={{ background: border, borderRadius: "4px", height: "7px", overflow: "hidden" }}>
                <div style={{ background: "linear-gradient(135deg,#0057FF,#00C9A7)", height: "100%", width: "31%", borderRadius: "4px" }} />
              </div>
            </div>
            <div style={{ background: rowBg, borderRadius: "12px", padding: "14px", border: `1px solid ${border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: textPrimary }}>UAE - JCTrans</span>
                <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "6px", fontWeight: 700, background: "#F1F2F6", color: "#5A6072" }}>QUEUED</span>
              </div>
              <div style={{ fontSize: "12px", color: textSecondary }}>Starts after Pakistan - ~2.4k leads est.</div>
            </div>
          </div>

          {/* Recent Leads */}
          <div style={card}>
            <div style={cardTitle}>Recent Leads ({leads.slice(0, 5).length})</div>
            {leads.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px", color: textSecondary }}>
                <p style={{ fontSize: "13px" }}>No leads yet - run the scraper!</p>
              </div>
            ) : (
              leads.slice(0, 5).map((lead: any) => (
                <div key={lead.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "12px", background: rowBg, marginBottom: "6px", cursor: "pointer" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#0057FF,#00C9A7)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "13px", fontWeight: 800, flexShrink: 0 }}>
                    {(lead.company_name || "?")[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lead.company_name}</div>
                    <div style={{ fontSize: "11px", color: textSecondary }}>{lead.contact_name} - {lead.country}</div>
                  </div>
                  <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "6px", fontWeight: 700, background: "#EEF3FF", color: "#0057FF" }}>{lead.source || "JCTrans"}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right */}
        <div>
          <div style={card}>
            <div style={cardTitle}>Today Tasks</div>
            {[
              { label: "Call: S.Z Shipping", time: "2:00 PM - Jawad", color: "#0057FF" },
              { label: "Demo: Pak Gulf Intl", time: "4:30 PM - Yaseen", color: "#B8860B" },
              { label: "WhatsApp: 47 leads", time: "Auto - n8n - 6 PM", color: "#00856E" },
              { label: "Quote: AIM Supply", time: "Pending send", color: "#7C3AED" },
            ].map((t, i) => (
              <div key={i} style={{ background: rowBg, borderRadius: "10px", padding: "11px 13px", borderLeft: `3px solid ${t.color}`, marginBottom: "8px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: textPrimary }}>{t.label}</div>
                <div style={{ fontSize: "11px", color: textSecondary, marginTop: "2px" }}>{t.time}</div>
              </div>
            ))}
          </div>

          <div style={card}>
            <div style={cardTitle}>Team ({users.length})</div>
            {users.slice(0, 4).map((u: any) => (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg,#0057FF,#00C9A7)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "11px", fontWeight: 800, flexShrink: 0 }}>
                  {u.avatar_initials || u.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: textPrimary }}>{u.name}</div>
                  <div style={{ fontSize: "11px", color: textSecondary }}>{u.role.replace("_", " ")}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
