
import React, { useState } from "react";
import { Bell, BellDot, ChevronDown, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import NotificationsDropdown from "./NotificationsDropdown";
interface HeaderProps {
  toggleSidebar: () => void;
  toggleAssistant: () => void;
}
const Header: React.FC<HeaderProps> = ({
  toggleSidebar,
  toggleAssistant
}) => {
  const {
    user,
    profile,
    logout
  } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const handleAvatarClick = () => {
    setShowUserMenu(!showUserMenu);
  };
  const handleSignOut = async () => {
    try {
      await logout();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = (): string => {
    if (!profile?.name) return "U";
    return profile.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };
  return <header className="bg-gray-900/80 border-b border-white/10 backdrop-blur-sm px-4 flex items-center justify-between z-30 relative py-[18px]">
      {/* Left section - Mobile Menu Toggle and Page Title */}
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={toggleSidebar}>
          <Menu className="h-5 w-5 text-cerebro-soft" />
        </Button>
      </div>
      
      {/* Right section - Actions and User Menu */}
      <div className="flex items-center space-x-2">
        {/* AI Assistant Button */}
        <Button variant="outline" data-gemini-toggle className="hidden sm:flex border-white/10" onClick={toggleAssistant}>
          <Sparkles className="mr-2 h-4 w-4 text-cerebro-purple" />
          <span>AI Assistant</span>
        </Button>
        
        {/* Notifications */}
        <NotificationsDropdown className="hidden sm:block" />
        
        {/* User Menu */}
        <div className="relative">
          <div className="flex items-center cursor-pointer" onClick={handleAvatarClick}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-cerebro-purple/30 text-cerebro-purple">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="ml-1 h-4 w-4 text-cerebro-soft/70" />
          </div>
          
          {/* User Dropdown */}
          {showUserMenu && <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-white/10 rounded-md shadow-lg z-50">
              <div className="p-3 border-b border-white/10">
                <p className="font-semibold">{profile?.name}</p>
                <p className="text-sm text-cerebro-soft/70 truncate">{user?.email}</p>
              </div>
              <div className="p-2">
                <Button variant="ghost" className="w-full justify-start text-left text-red-400 hover:text-red-300 hover:bg-red-950/30" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </div>}
        </div>
      </div>
    </header>;
};
export default Header;
