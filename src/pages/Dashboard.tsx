
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import TasksWidget from "@/components/dashboard/TasksWidget";
import CalendarWidget from "@/components/dashboard/CalendarWidget";
import KpiWidget from "@/components/dashboard/KpiWidget";
import NotesWidget from "@/components/dashboard/NotesWidget";

const Dashboard = () => {
  const { profile } = useAuth();
  
  return (
    <div className="space-y-6">
      {/* Hero section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-cerebro-soft">
            Welcome back, {profile?.name?.split(" ")[0] || "User"}
          </h1>
          <p className="text-cerebro-soft/70">Here's an overview of your productivity</p>
        </div>
      </div>
      
      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <TasksWidget />
        <CalendarWidget />
        <NotesWidget />
        <KpiWidget />
      </div>
    </div>
  );
};

export default Dashboard;
