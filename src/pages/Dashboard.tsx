import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import TasksWidget from "@/components/dashboard/TasksWidget";
import NotesWidget from "@/components/dashboard/NotesWidget";
import CalendarWidget from "@/components/dashboard/CalendarWidget";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white">Welcome back, {profile?.name?.split(" ")[0] || "User"}</h1>
        <p className="text-gray-400">Here's an overview of your productivity</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TasksWidget />
        <CalendarWidget />
        <NotesWidget />
      </div>
    </div>
  );
}
