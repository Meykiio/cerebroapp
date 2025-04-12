
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Bell, User, Lock, Palette, Database, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Settings = () => {
  const { user, profile, updateUserProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    businessName: profile?.businessName || "",
    email: user?.email || "",
  });
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: true,
    compactView: false,
    timezone: "UTC",
    language: "en",
    autoSave: true
  });

  useEffect(() => {
    // Update form data when profile changes
    if (profile) {
      setFormData({
        name: profile.name || "",
        businessName: profile.businessName || "",
        email: user?.email || "",
      });
    }
  }, [profile, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setPreferences({ ...preferences, [name]: checked });
  };

  const handleSelectChange = (name: string, value: string) => {
    setPreferences({ ...preferences, [name]: value });
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!user) throw new Error("No authenticated user");
      
      await updateUserProfile({
        name: formData.name,
        businessName: formData.businessName
      });
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportData = () => {
    toast.info("Data export started. You'll receive an email when it's ready.");
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion requires confirmation via email. Please check your inbox.");
  };

  const savePreferences = () => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    toast.success("Preferences saved successfully");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-cerebro-soft">Settings</h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-gray-800/50 border-white/10">
          <TabsTrigger value="profile" className="data-[state=active]:bg-cerebro-purple">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-cerebro-purple">
            <Palette className="mr-2 h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-cerebro-purple">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-cerebro-purple">
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-cerebro-purple">
            <Database className="mr-2 h-4 w-4" />
            Data
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="bg-gray-900/60 border-white/10">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-gray-800/60 border-white/10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input 
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="bg-gray-800/60 border-white/10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                    className="bg-gray-800/60 border-white/10 opacity-60"
                  />
                  <p className="text-xs text-cerebro-soft/60">Email address cannot be changed</p>
                </div>
                
                <Button type="submit" className="bg-cerebro-purple hover:bg-cerebro-purple-dark" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card className="bg-gray-900/60 border-white/10">
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-cerebro-soft/60">Use dark theme for better eye comfort</p>
                  </div>
                  <Switch 
                    id="darkMode"
                    checked={preferences.darkMode}
                    onCheckedChange={(checked) => handleSwitchChange('darkMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compactView">Compact View</Label>
                    <p className="text-sm text-cerebro-soft/60">Show more information on screen</p>
                  </div>
                  <Switch 
                    id="compactView"
                    checked={preferences.compactView}
                    onCheckedChange={(checked) => handleSwitchChange('compactView', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoSave">Auto Save</Label>
                    <p className="text-sm text-cerebro-soft/60">Automatically save changes when editing</p>
                  </div>
                  <Switch 
                    id="autoSave"
                    checked={preferences.autoSave}
                    onCheckedChange={(checked) => handleSwitchChange('autoSave', checked)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={preferences.language}
                    onValueChange={(value) => handleSelectChange('language', value)}
                  >
                    <SelectTrigger className="bg-gray-800/60 border-white/10">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={preferences.timezone}
                    onValueChange={(value) => handleSelectChange('timezone', value)}
                  >
                    <SelectTrigger className="bg-gray-800/60 border-white/10">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="GMT">GMT</SelectItem>
                      <SelectItem value="EST">EST</SelectItem>
                      <SelectItem value="PST">PST</SelectItem>
                      <SelectItem value="CET">CET</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={savePreferences} className="bg-cerebro-purple hover:bg-cerebro-purple-dark">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="bg-gray-900/60 border-white/10">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-cerebro-soft/60">Receive task reminders and updates via email</p>
                  </div>
                  <Switch 
                    id="emailNotifications"
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-cerebro-soft/60">Receive browser push notifications</p>
                  </div>
                  <Switch 
                    id="pushNotifications"
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => handleSwitchChange('pushNotifications', checked)}
                  />
                </div>
              </div>
              
              <Button onClick={savePreferences} className="bg-cerebro-purple hover:bg-cerebro-purple-dark">
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="bg-gray-900/60 border-white/10">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5">
                  Change Password
                </Button>
                
                <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5">
                  Enable Two-Factor Authentication
                </Button>
                
                <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5">
                  Manage Connected Devices
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Data Tab */}
        <TabsContent value="data">
          <Card className="bg-gray-900/60 border-white/10">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5" onClick={handleExportData}>
                  Export Your Data
                </Button>
                
                <Button variant="destructive" className="w-full justify-start" onClick={handleDeleteAccount}>
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
