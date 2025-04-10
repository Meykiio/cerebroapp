
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, Loader2, UserPlus } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signup, loading } = useAuth();
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    
    setPasswordError("");
    await signup(email, password, name);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cerebro-dark bg-neural-pattern p-4">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-cerebro-purple/10 to-transparent opacity-20" />
      
      <div className="flex flex-col items-center mb-8 z-10">
        <div className="flex items-center gap-2 mb-4">
          <Brain size={40} className="text-cerebro-purple" />
          <h1 className="text-4xl font-bold text-gradient">Cerebro</h1>
        </div>
        <p className="text-cerebro-soft/80 text-center max-w-md">
          Join the productivity revolution for entrepreneurs
        </p>
      </div>

      <Card className="w-full max-w-md border-white/10 bg-gray-900/60 backdrop-blur-lg shadow-xl z-10">
        <CardHeader>
          <CardTitle className="text-cerebro-soft">Create Your Account</CardTitle>
          <CardDescription>Start your productivity journey with Cerebro</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-gray-800/50 border-white/10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800/50 border-white/10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800/50 border-white/10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-gray-800/50 border-white/10"
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-cerebro-purple hover:bg-cerebro-purple-dark"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" /> Create Account
                </>
              )}
            </Button>
            
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-cerebro-cyan hover:underline">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
      
      <div className="mt-8 text-center text-sm text-cerebro-soft/60 z-10">
        <p>© {new Date().getFullYear()} Cerebro AI. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Signup;
