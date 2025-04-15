import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellDot, BellRing, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification,
  type Notification 
} from "@/services/notificationService";
import { supabase } from "@/integrations/supabase/client";

interface NotificationsDropdownProps {
  className?: string;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ className }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  
  // Fetch notifications on mount and when user changes
  useEffect(() => {
    if (user) {
      loadNotifications();
      
      // Subscribe to real-time notifications
      const channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            loadNotifications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const loadNotifications = async () => {
    if (user) {
      const data = await fetchNotifications(user.id);
      setNotifications(data);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (user) {
      const success = await markAllNotificationsAsRead(user.id);
      if (success) {
        await loadNotifications();
        toast.success("All notifications marked as read");
      }
    }
  };
  
  const handleMarkAsRead = async (id: string) => {
    if (user) {
      const success = await markNotificationAsRead(id, user.id);
      if (success) {
        await loadNotifications();
      }
    }
  };
  
  const handleDelete = async (id: string) => {
    if (user) {
      const success = await deleteNotification(id, user.id);
      if (success) {
        await loadNotifications();
        toast.success("Notification deleted");
      }
    }
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
      
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-white/10 rounded-md shadow-lg z-50">
          <div className="p-3 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-medium">Notifications</h3>
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMarkAllAsRead}
                className="h-7 text-xs"
              >
                Mark all as read
              </Button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-cerebro-soft/50">
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-3 border-b border-white/5 hover:bg-white/5 ${notification.read ? 'opacity-70' : ''}`}
                  onClick={() => handleMarkAsRead(notification.id)}
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
                        {new Date(notification.created_at).toLocaleString('default', { 
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
                        handleDelete(notification.id);
                      }}
                    >
                      &times;
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-2 border-t border-white/10">
              <Button variant="link" className="w-full text-center text-cerebro-purple text-sm">
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
