
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellDot, BellRing, Check } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  description: string;
  date: Date;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

interface NotificationsDropdownProps {
  className?: string;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ className }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Sample notifications - in a real app, these would come from a global state or API
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Feature Available",
      description: "Try out our new Calendar integration with Google Calendar",
      date: new Date("2025-04-09T10:30:00"),
      read: false,
      type: "info"
    },
    {
      id: "2",
      title: "Weekly Report Ready",
      description: "Your KPI summary for the week is now available",
      date: new Date("2025-04-08T16:45:00"),
      read: false,
      type: "success"
    },
    {
      id: "3",
      title: "Upcoming Deadline",
      description: "Project proposal due tomorrow at 5 PM",
      date: new Date("2025-04-08T09:15:00"),
      read: true,
      type: "warning"
    }
  ]);

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };
  
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("Notification deleted");
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className={`relative ${className}`}>
      <Button 
        variant="outline" 
        size="icon" 
        className="border-white/10 relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        {unreadCount > 0 ? <BellDot className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>
      
      {/* Notifications dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-white/10 rounded-md shadow-lg z-50">
          <div className="p-3 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-medium">Notifications</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllNotificationsAsRead}
              className="h-7 text-xs"
            >
              Mark all as read
            </Button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-cerebro-soft/50">
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-3 border-b border-white/5 hover:bg-white/5 ${notification.read ? 'opacity-70' : ''}`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 p-1 rounded-full ${
                      notification.type === 'info' ? 'bg-blue-500/20 text-blue-400' :
                      notification.type === 'success' ? 'bg-green-500/20 text-green-400' :
                      notification.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {notification.type === 'info' && <Bell className="h-4 w-4" />}
                      {notification.type === 'success' && <Check className="h-4 w-4" />}
                      {notification.type === 'warning' && <BellRing className="h-4 w-4" />}
                      {notification.type === 'error' && <BellDot className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${!notification.read ? 'text-white' : 'text-cerebro-soft/80'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-cerebro-soft/70 mt-1">
                        {notification.description}
                      </p>
                      <p className="text-xs text-cerebro-soft/50 mt-1">
                        {notification.date.toLocaleString('default', { 
                          month: 'short', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:text-red-400 hover:bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      &times;
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-2 border-t border-white/10">
            <Button variant="link" className="w-full text-center text-cerebro-purple text-sm">
              View all notifications
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
