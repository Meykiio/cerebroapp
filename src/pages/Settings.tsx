
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Bell, User, Lock, Globe, Palette, Keyboard, Brain } from "lucide-react";

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cerebro-soft">Settings</h1>
        <p className="text-cerebro-soft/70">Manage your account and preferences</p>
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
                <Button variant="outline" className="border-white/10">
                  Change Password
                </Button>
                <Button variant="outline" className="border-white/10">
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
                  <Button variant="outline" className="mt-2 border-white/10">
                    Clear AI Data
                  </Button>
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
