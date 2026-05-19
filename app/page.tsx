"use client";
import { useEffect, useState } from "react";
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
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(
        `https://zapybyfohfjytyjzkhrn.supabase.co/rest/v1/leads?select=*&limit=1000`,
        {
          headers: {
            apikey: "sb_publishable_8sIG7KArM9GaX63hsxdcFg_8e5B5w2V",
            Authorization: "Bearer sb_publishable_8sIG7KArM9GaX63hsxdcFg_8e5B5w2V",
          },
        }
      );
      const leadsData = await res.json();
      setLeads(Array.isArray(leadsData) ? leadsData : []);

      const res2 = await fetch(
        `https://zapybyfohfjytyjzkhrn.supabase.co/rest/v1/users?select=*`,
        {
          headers: {
            apikey: "sb_publishable_8sIG7KArM9GaX63hsxdcFg_8e5B5w2V",
            Authorization: "Bearer sb_publishable_8sIG7KArM9GaX63hsxdcFg_8e5B5w2V",
          },
        }
      );
      const usersData = await res2.json();
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (e) {
      console.error(e);
    }
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