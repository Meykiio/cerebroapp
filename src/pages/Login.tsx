
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, Fingerprint, Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(email, password);
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
          AI-powered productivity OS for entrepreneurs and founders
        </p>
      </div>

      <Card className="w-full max-w-md border-white/10 bg-gray-900/60 backdrop-blur-lg shadow-xl z-10">
        <CardHeader>
          <CardTitle className="text-cerebro-soft">Welcome Back</CardTitle>
          <CardDescription>Sign in to your Cerebro account</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-cerebro-cyan hover:underline">
                  Forgot password?
                </Link>
              </div>
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
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-cerebro-purple hover:bg-cerebro-purple-dark"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In
                </>
              ) : (
                <>
                  <Fingerprint className="mr-2 h-4 w-4" /> Sign In
                </>
              )}
            </Button>
            
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-cerebro-cyan hover:underline">
                Sign Up
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

export default Login;
