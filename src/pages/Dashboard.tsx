
import { Brain, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
        
        <div className="flex gap-2">
          <div className="relative max-w-xs">
            <Input
              placeholder="Ask Gemini something..."
              className="pr-10 bg-gray-800/50 border-white/10 w-full"
            />
            <Brain className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cerebro-purple" />
          </div>
          <Button className="bg-cerebro-purple hover:bg-cerebro-purple-dark">
            <Sparkles className="mr-2 h-4 w-4" />
            Assist
          </Button>
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
