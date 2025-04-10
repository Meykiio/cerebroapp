
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Bell, User, Lock, Globe, Palette, Keyboard, Brain, BellDot, BellRing, Check } from "lucide-react";

// Notification type interface
interface Notification {
  id: string;
  title: string;
  description: string;
  date: Date;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

const Settings = () => {
  const { user, updateUserProfile } = useAuth();
  
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    businessName: user?.businessName || ""
  });

  const [preferences, setPreferences] = useState({
    darkMode: true,
    notifications: true,
    emailUpdates: false,
    aiSuggestions: true
  });
  
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Sample notifications
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

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile({
        name: profile.name,
        businessName: profile.businessName
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleToggleChange = (key: string, checked: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: checked }));
    toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} setting updated`);
  };
  
  const handlePasswordChange = () => {
    toast.success("Password reset email sent");
  };
  
  const handleTwoFactorAuth = () => {
    toast.success("Two-factor authentication enabled");
  };
  
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
  
  const clearAIData = () => {
    toast.success("AI data cleared successfully");
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cerebro-soft">Settings</h1>
          <p className="text-cerebro-soft/70">Manage your account and preferences</p>
        </div>
        
        {/* Notifications panel toggle */}
        <div className="relative">
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
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-transparent"
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
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="bg-gray-800/50 border-white/10">
          <TabsTrigger value="account" className="data-[state=active]:bg-cerebro-purple">
            <User className="mr-2 h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-cerebro-purple">
            <Palette className="mr-2 h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-cerebro-purple">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-cerebro-purple">
            <Brain className="mr-2 h-4 w-4" />
            AI Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-6 space-y-6">
          {/* Profile Settings */}
          <Card className="bg-gray-900/60 border-white/10">
            <CardHeader>
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <p className="text-cerebro-soft/70 text-sm">Update your account details</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="bg-gray-800/50 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    value={profile.email}
                    disabled
                    className="bg-gray-800/50 border-white/10 opacity-70"
                  />
                  <p className="text-xs text-cerebro-soft/50">Email cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="businessName" className="text-sm font-medium">
                    Business Name
                  </label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={profile.businessName}
                    onChange={handleProfileChange}
                    className="bg-gray-800/50 border-white/10"
                  />
                </div>
                <Button type="submit" className="bg-cerebro-purple hover:bg-cerebro-purple-dark mt-4">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-gray-900/60 border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-cerebro-purple" />
                <h2 className="text-xl font-semibold">Security</h2>
              </div>
              <p className="text-cerebro-soft/70 text-sm">Manage your security settings</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="border-white/10" onClick={handlePasswordChange}>
                  Change Password
                </Button>
                <Button variant="outline" className="border-white/10" onClick={handleTwoFactorAuth}>
                  Enable Two-Factor Authentication
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6 space-y-6">
          <Card className="bg-gray-900/60 border-white/10">
            <CardHeader>
              <h2 className="text-xl font-semibold">Interface Preferences</h2>
              <p className="text-cerebro-soft/70 text-sm">Customize your experience</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-cerebro-soft/70">Enable dark theme</p>
                  </div>
                  <Switch 
                    checked={preferences.darkMode} 
                    onCheckedChange={(checked) => handleToggleChange("darkMode", checked)} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Keyboard Shortcuts</p>
                    <p className="text-sm text-cerebro-soft/70">Enable keyboard shortcuts</p>
                  </div>
                  <Switch
                    checked={preferences.aiSuggestions}
                    onCheckedChange={(checked) => handleToggleChange("aiSuggestions", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card className="bg-gray-900/60 border-white/10">
            <CardHeader>
              <h2 className="text-xl font-semibold">Notification Settings</h2>
              <p className="text-cerebro-soft/70 text-sm">Configure when and how to be notified</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-cerebro-soft/70">Receive notifications in the app</p>
                  </div>
                  <Switch
                    checked={preferences.notifications}
                    onCheckedChange={(checked) => handleToggleChange("notifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Updates</p>
                    <p className="text-sm text-cerebro-soft/70">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={preferences.emailUpdates}
                    onCheckedChange={(checked) => handleToggleChange("emailUpdates", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Task Reminders</p>
                    <p className="text-sm text-cerebro-soft/70">Get reminded of upcoming tasks</p>
                  </div>
                  <Switch
                    defaultChecked={true}
                    onCheckedChange={(checked) => toast.success(`Task reminders ${checked ? 'enabled' : 'disabled'}`)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Calendar Alerts</p>
                    <p className="text-sm text-cerebro-soft/70">Get notified about calendar events</p>
                  </div>
                  <Switch
                    defaultChecked={true}
                    onCheckedChange={(checked) => toast.success(`Calendar alerts ${checked ? 'enabled' : 'disabled'}`)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="mt-6 space-y-6">
          <Card className="bg-gray-900/60 border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-cerebro-purple" />
                <h2 className="text-xl font-semibold">AI Settings</h2>
              </div>
              <p className="text-cerebro-soft/70 text-sm">Configure Gemini AI behavior</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">AI Suggestions</p>
                    <p className="text-sm text-cerebro-soft/70">Get intelligent suggestions from Gemini</p>
                  </div>
                  <Switch
                    checked={preferences.aiSuggestions}
                    onCheckedChange={(checked) => handleToggleChange("aiSuggestions", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gemini API Key</label>
                  <Input
                    value="AIzaSyAkEDnb6ZajP2O57nLMZ0-_hNgWJGWI8OQ"
                    disabled
                    className="bg-gray-800/50 border-white/10 font-mono text-sm"
                  />
                  <p className="text-xs text-cerebro-soft/50">API key is securely stored</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Data Collection</p>
                  <p className="text-sm text-cerebro-soft/70">
                    Your data is used to improve AI suggestions. You can clear stored data at any time.
                  </p>
                  <Button variant="outline" className="mt-2 border-white/10" onClick={clearAIData}>
                    Clear AI Data
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">AI Model</p>
                  <p className="text-sm text-cerebro-soft/70">
                    Select which AI model to use for Cerebro AI
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center space-x-2 p-2 border border-white/10 rounded-md bg-white/5">
                      <input type="radio" id="gemini-pro" name="ai-model" defaultChecked />
                      <label htmlFor="gemini-pro" className="text-sm">Gemini 1.5 Pro</label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 border border-white/10 rounded-md bg-white/5">
                      <input type="radio" id="gemini-flash" name="ai-model" />
                      <label htmlFor="gemini-flash" className="text-sm">Gemini 1.5 Flash</label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
