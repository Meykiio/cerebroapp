
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Brain,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  LineChart,
  Home,
  LayoutGrid,
  Settings,
  StickyNote,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();
  const { user, profile } = useAuth();
  
  // Add localStorage to remember sidebar state
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-open");
    if (savedState !== null) {
      setOpen(savedState === "true");
    }
  }, []);

  // Save sidebar state to localStorage
  const toggleSidebar = () => {
    const newState = !open;
    setOpen(newState);
    localStorage.setItem("sidebar-open", String(newState));
  };
  
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
    { name: "Tasks", path: "/tasks", icon: <ClipboardList size={20} /> },
    { name: "Calendar", path: "/calendar", icon: <Calendar size={20} /> },
    { name: "KPI Metrics", path: "/metrics", icon: <LineChart size={20} /> },
    { name: "Notes", path: "/notes", icon: <StickyNote size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-72 flex-shrink-0 transform flex-col overflow-y-auto bg-gray-900/90 backdrop-blur-md border-r border-white/10 transition-all duration-300 ease-in-out lg:relative lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-cerebro-purple" />
            <span className="text-xl font-bold text-cerebro-soft">Cerebro</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="lg:hidden text-cerebro-soft hover:text-white hover:bg-white/10"
          >
            <ChevronLeft size={20} />
          </Button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cerebro-purple flex items-center justify-center">
              <span className="text-white font-medium">
                {profile?.name?.charAt(0) || "U"}
              </span>
            </div>
            <div>
              <p className="font-medium text-cerebro-soft">{profile?.name || "User"}</p>
              <p className="text-sm text-cerebro-soft/60">{profile?.business_name || "My Business"}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 font-normal",
                  location.pathname === item.path
                    ? "bg-cerebro-purple/20 text-cerebro-purple"
                    : "text-cerebro-soft/80 hover:text-cerebro-soft hover:bg-white/5"
                )}
              >
                {item.icon}
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Collapse button (desktop only) */}
        <div className="hidden lg:block p-4 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={toggleSidebar}
            className="w-full justify-center text-cerebro-soft hover:text-white hover:bg-white/5"
          >
            {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
