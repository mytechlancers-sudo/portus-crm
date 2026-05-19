"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import Leads from "@/components/Leads";
import Reports from "@/components/Reports";
import Quotations from "@/components/Quotations";
import Pipeline from "@/components/Pipeline";
import Permissions from "@/components/Permissions";
import Team from "@/components/Team";

export default function Home() {
  const [activePage, setActivePage] = useState("dashboard");
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    fetchData();
    const saved = localStorage.getItem("portus-theme");
    if (saved === "dark") setDark(true);
  }, []);

  async function fetchData() {
    setLoading(true);
    const [leadsRes, usersRes] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("users").select("*"),
    ]);
    if (leadsRes.data) setLeads(leadsRes.data as any);
    if (usersRes.data) setUsers(usersRes.data as any);
    setLoading(false);
  }

  function toggleTheme() {
    const newDark = !dark;
    setDark(newDark);
    localStorage.setItem("portus-theme", newDark ? "dark" : "light");
  }

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard leads={leads} users={users} dark={dark} />;
      case "leads": return <Leads leads={leads} users={users} refetch={fetchData} dark={dark} />;
      case "reports": return <Reports users={users} dark={dark} />;
      case "quotations": return <Quotations leads={leads} dark={dark} />;
      case "pipeline": return <Pipeline leads={leads} dark={dark} />;
      case "permissions": return <Permissions users={users} refetch={fetchData} dark={dark} />;
      case "team": return <Team users={users} refetch={fetchData} dark={dark} />;
      default: return <Dashboard leads={leads} users={users} dark={dark} />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: dark ? "#0D1117" : "#F0F2FF" }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} toggleTheme={toggleTheme} dark={dark} />
      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", background: dark ? "#0D1117" : "#F0F2FF" }}>
        {loading ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "40px", height: "40px", border: "4px solid #0057FF", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }}></div>
              <p style={{ fontSize: "14px", color: dark ? "#8892A4" : "#6B7280" }}>Loading Portus CRM...</p>
            </div>
          </div>
        ) : renderPage()}
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
