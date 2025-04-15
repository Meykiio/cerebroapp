import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { User, Lock, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { user, profile, updateUserProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    businessName: profile?.businessName || "",
    email: user?.email || "",
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

  const handleChangePassword = () => {
    if (user?.email) {
      supabase.auth.resetPasswordForEmail(user.email)
        .then(() => toast.success("Password reset email sent. Please check your inbox."))
        .catch(() => toast.error("Failed to send password reset email"));
    }
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
        
        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="bg-gray-900/60 border-white/10">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-white/10 hover:bg-white/5"
                  onClick={handleChangePassword}
                >
                  Change Password
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-white/10 hover:bg-white/5"
                  onClick={() => toast.info("Two-factor authentication coming soon!")}
                >
                  Enable Two-Factor Authentication
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
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-white/10 hover:bg-white/5" 
                  onClick={handleExportData}
                >
                  Export Your Data
                </Button>
                
                <Button 
                  variant="destructive" 
                  className="w-full justify-start" 
                  onClick={handleDeleteAccount}
                >
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
