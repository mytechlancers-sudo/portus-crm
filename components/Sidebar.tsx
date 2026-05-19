"use client";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "leads", label: "Leads", icon: "👥" },
  { id: "pipeline", label: "Pipeline", icon: "📊" },
  { id: "reports", label: "Reports", icon: "📈" },
  { id: "quotations", label: "Quotations", icon: "📄" },
  { id: "permissions", label: "Permissions", icon: "🔒" },
  { id: "team", label: "Team", icon: "👤" },
];

export default function Sidebar({ activePage, setActivePage, toggleTheme, dark }: any) {
  return (
    <div style={{
      width: "220px",
      minWidth: "220px",
      height: "100vh",
      background: "#0A0F2C",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid rgba(255,255,255,0.08)",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: "16px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <img
          src="https://portuspk.com/image/logoDSW.png"
          alt="Portus"
          style={{ height: "28px", filter: "brightness(0) invert(1)" }}
          onError={(e: any) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        <div style={{
          display: "none",
          width: "28px", height: "28px",
          background: "linear-gradient(135deg,#0057FF,#00C9A7)",
          borderRadius: "8px",
          alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: 900, fontSize: "14px"
        }}>P</div>
        <button
          onClick={toggleTheme}
          style={{
            background: "none", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px", width: "30px", height: "30px",
            cursor: "pointer", fontSize: "14px",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px", overflowY: "auto" }}>
        <p style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 10px 4px" }}>
          Main
        </p>
        {navItems.slice(0, 4).map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: "10px",
              padding: "8px 10px", borderRadius: "10px", fontSize: "13px",
              fontWeight: activePage === item.id ? 700 : 500, border: "none",
              cursor: "pointer", marginBottom: "2px", textAlign: "left",
              background: activePage === item.id ? "rgba(0,87,255,0.2)" : "transparent",
              color: activePage === item.id ? "white" : "rgba(255,255,255,0.5)",
              outline: activePage === item.id ? "1px solid rgba(0,87,255,0.35)" : "none",
            }}
          >
            <span>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.id === "leads" && (
              <span style={{
                background: "#0057FF", color: "white", fontSize: "10px",
                padding: "2px 6px", borderRadius: "6px", fontWeight: 700
              }}>9k</span>
            )}
          </button>
        ))}

        <p style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 10px 4px" }}>
          Admin
        </p>
        {navItems.slice(4).map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: "10px",
              padding: "8px 10px", borderRadius: "10px", fontSize: "13px",
              fontWeight: activePage === item.id ? 700 : 500, border: "none",
              cursor: "pointer", marginBottom: "2px", textAlign: "left",
              background: activePage === item.id ? "rgba(0,87,255,0.2)" : "transparent",
              color: activePage === item.id ? "white" : "rgba(255,255,255,0.5)",
              outline: activePage === item.id ? "1px solid rgba(0,87,255,0.35)" : "none",
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "8px 10px", borderRadius: "10px", cursor: "pointer"
        }}>
          <div style={{
            width: "30px", height: "30px", borderRadius: "50%",
            background: "linear-gradient(135deg,#0057FF,#00C9A7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: "11px", fontWeight: 800, flexShrink: 0
          }}>YI</div>
          <div>
            <div style={{ color: "white", fontSize: "12px", fontWeight: 700 }}>Yaseen Irfan</div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>Super Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}