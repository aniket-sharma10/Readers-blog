import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/Dash-Sidebar";
import DashProfile from "../components/Dash-Profile";
import DashPosts from "../components/Dash-Posts";
import DashUsers from "../components/Dash-Users";
import DashComments from "../components/Dash-Comments";
import DashComponent from "../components/Dash-Component";

function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get("tab");
    if(tab){
      setTab(tab)
    }
  }, [location.search]);
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div><DashSidebar /></div>

      {tab === 'profile' && <DashProfile />}
      {tab === 'posts' && <DashPosts />}
      {tab === 'users' && <DashUsers />}
      {tab === 'comments' && <DashComments />}
      {tab === 'dash' && <DashComponent />}
    </div>
  );
}

export default Dashboard;
