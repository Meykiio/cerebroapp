
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<AuthGuard requireAuth={false}><Login /></AuthGuard>} />
            <Route path="/signup" element={<AuthGuard requireAuth={false}><Signup /></AuthGuard>} />
            
            {/* Protected routes */}
            <Route path="/onboarding" element={<AuthGuard><Onboarding /></AuthGuard>} />
            
            {/* Dashboard routes */}
            <Route path="/" element={<AuthGuard><DashboardLayout /></AuthGuard>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<div className="py-10 text-center text-xl">Tasks Page - Coming Soon</div>} />
              <Route path="/calendar" element={<div className="py-10 text-center text-xl">Calendar Page - Coming Soon</div>} />
              <Route path="/metrics" element={<div className="py-10 text-center text-xl">Metrics Page - Coming Soon</div>} />
              <Route path="/notes" element={<div className="py-10 text-center text-xl">Notes Page - Coming Soon</div>} />
              <Route path="/settings" element={<div className="py-10 text-center text-xl">Settings Page - Coming Soon</div>} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
