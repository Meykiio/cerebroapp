
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import GeminiAssistant from "../gemini/GeminiAssistant";
import { startReminderCheck, requestNotificationPermissions } from "@/services/notificationService";

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [assistantOpen, setAssistantOpen] = useState(false);

  // Set up the reminder check system when the dashboard loads
  useEffect(() => {
    // Request notification permissions
    requestNotificationPermissions();
    
    // Start checking for reminders
    const reminderInterval = startReminderCheck();
    
    // Clean up interval on unmount
    return () => {
      clearInterval(reminderInterval);
    };
  }, []);

  return (
    <div className="flex h-screen bg-cerebro-dark overflow-hidden">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          toggleAssistant={() => setAssistantOpen(!assistantOpen)}
        />
        
        <main className="flex-1 overflow-y-auto bg-cerebro-dark bg-neural-pattern">
          <div className="container mx-auto py-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Gemini Assistant Panel */}
      <GeminiAssistant open={assistantOpen} setOpen={setAssistantOpen} />
    </div>
  );
};

export default DashboardLayout;
