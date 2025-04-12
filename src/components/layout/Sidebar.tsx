import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, Calendar, ChevronLeft, ChevronRight, ClipboardList, LineChart, Home, Settings, StickyNote, LayoutDashboard, CheckSquare, FileText } from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  open,
  setOpen
}) => {
  const location = useLocation();
  const {
    user,
    profile
  } = useAuth();

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

  const navigation = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks", path: "/tasks", icon: CheckSquare },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Notes", path: "/notes", icon: FileText },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const businessName = profile?.businessName || "Cerebro AI";
  return <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <div className={cn("fixed inset-y-0 left-0 z-30 flex-shrink-0 transform flex-col overflow-y-auto bg-gray-900/90 backdrop-blur-md border-r border-white/10 transition-all duration-300 ease-in-out lg:relative", 
        open ? "w-64" : "w-[76px]")}>
        {/* Logo */}
        

        {/* User info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cerebro-purple flex items-center justify-center flex-shrink-0">
              <span className="text-white font-medium">
                {profile?.name?.charAt(0) || "S"}
              </span>
            </div>
            {open && (
              <div className="overflow-hidden">
                <p className="font-medium text-cerebro-soft truncate">{profile?.name || "Sifeddine Mebarki"}</p>
                <p className="text-sm text-cerebro-soft/60 truncate">{businessName}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map(item => (
            <Link key={item.path} to={item.path}>
              <Button 
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  location.pathname === item.path ? "bg-gray-800" : "hover:bg-gray-800"
                )}
              >
                {React.createElement(item.icon, { size: 20 })}
                <span className={cn("ml-3", !open && "hidden")}>
                  {item.name}
                </span>
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
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </Button>
        </div>
      </div>
    </>;
};

export default Sidebar;
