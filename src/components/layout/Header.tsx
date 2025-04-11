
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { BellIcon, Brain, LogOut, Menu, Moon, Search, Settings, User2 } from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
  toggleAssistant: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, toggleAssistant }) => {
  const { user, profile, logout } = useAuth();
  const [date, setDate] = useState(new Date());
  
  // Update date every minute
  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };
  
  return (
    <header className="bg-gray-900/90 backdrop-blur-md border-b border-white/10 py-3 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden text-cerebro-soft hover:text-white hover:bg-white/10"
          >
            <Menu size={20} />
          </Button>
          
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-cerebro-soft">{formatDate()}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5">
            <Search size={16} className="text-cerebro-soft/60" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent outline-none border-none text-sm text-cerebro-soft placeholder:text-cerebro-soft/60 w-48"
            />
          </div>
          
          {/* Assistant button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAssistant}
            className="text-cerebro-soft relative hover:text-cerebro-purple hover:bg-white/10"
          >
            <Brain size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-cerebro-cyan animate-pulse"></span>
          </Button>
          
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="text-cerebro-soft hover:text-white hover:bg-white/10 relative"
          >
            <BellIcon size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-cerebro-cyan"></span>
          </Button>
          
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8 bg-cerebro-purple">
                  <AvatarFallback>{profile?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-white/10 text-cerebro-soft">
              <div className="p-2 border-b border-white/10">
                <p className="font-semibold">{profile?.name || "User"}</p>
                <p className="text-sm text-cerebro-soft/70">{user?.email}</p>
              </div>
              <DropdownMenuItem className="cursor-pointer hover:bg-white/5">
                <User2 className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-white/5">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-white/5">
                <Moon className="mr-2 h-4 w-4" /> Theme
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-400 hover:bg-white/5 hover:text-red-400">
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
