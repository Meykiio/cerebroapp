
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, Calendar, CheckCircle, ChevronRight, Loader2, Settings } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type OnboardingStep = 'welcome' | 'business' | 'layout' | 'calendar';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [businessName, setBusinessName] = useState("");
  const [layoutOption, setLayoutOption] = useState("balanced");
  const { updateUserProfile, loading, user } = useAuth();
  const navigate = useNavigate();

  const handleContinue = async () => {
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('business');
        break;
      case 'business':
        // Save business name
        if (businessName) {
          await updateUserProfile({ businessName });
          setCurrentStep('layout');
        }
        break;
      case 'layout':
        // Save layout preference (would store in user profile in real app)
        localStorage.setItem("cerebroLayout", layoutOption);
        setCurrentStep('calendar');
        break;
      case 'calendar':
        // In a real app, this would trigger Google Calendar OAuth flow
        // For demo, just simulate success
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
        break;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <>
            <CardHeader>
              <CardTitle className="text-cerebro-soft text-xl">Welcome to Cerebro!</CardTitle>
              <CardDescription>Let's set up your personal productivity OS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col items-center">
              <div className="text-center max-w-sm">
                <p className="text-cerebro-soft/80 mb-4">
                  Cerebro is your AI-powered productivity assistant designed specifically for entrepreneurs and founders.
                </p>
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-cerebro-purple" />
                    <span>Smart task management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-cerebro-purple" />
                    <span>AI-powered insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-cerebro-purple" />
                    <span>Calendar integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-cerebro-purple" />
                    <span>KPI tracking</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleContinue} 
                className="w-full bg-cerebro-purple hover:bg-cerebro-purple-dark"
              >
                Get Started <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        );
        
      case 'business':
        return (
          <>
            <CardHeader>
              <CardTitle className="text-cerebro-soft text-xl">Your Business</CardTitle>
              <CardDescription>Tell us about your business or project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business or Project Name</Label>
                <Input
                  id="businessName"
                  placeholder="Acme Inc."
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  className="bg-gray-800/50 border-white/10"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleContinue} 
                className="w-full bg-cerebro-purple hover:bg-cerebro-purple-dark"
                disabled={!businessName}
              >
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        );
        
      case 'layout':
        return (
          <>
            <CardHeader>
              <CardTitle className="text-cerebro-soft text-xl">Dashboard Layout</CardTitle>
              <CardDescription>Choose your preferred dashboard layout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup 
                value={layoutOption} 
                onValueChange={setLayoutOption}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 bg-gray-800/40 p-3 rounded-lg border border-white/10 cursor-pointer hover:bg-gray-800/60">
                  <RadioGroupItem value="balanced" id="balanced" />
                  <Label htmlFor="balanced" className="flex-1 cursor-pointer">
                    <div className="font-medium">Balanced</div>
                    <div className="text-sm text-gray-400">Equal focus on tasks, calendar, and KPIs</div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 bg-gray-800/40 p-3 rounded-lg border border-white/10 cursor-pointer hover:bg-gray-800/60">
                  <RadioGroupItem value="taskFocused" id="taskFocused" />
                  <Label htmlFor="taskFocused" className="flex-1 cursor-pointer">
                    <div className="font-medium">Task Focused</div>
                    <div className="text-sm text-gray-400">Prioritize task management and goals</div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 bg-gray-800/40 p-3 rounded-lg border border-white/10 cursor-pointer hover:bg-gray-800/60">
                  <RadioGroupItem value="calendarFocused" id="calendarFocused" />
                  <Label htmlFor="calendarFocused" className="flex-1 cursor-pointer">
                    <div className="font-medium">Calendar Focused</div>
                    <div className="text-sm text-gray-400">Emphasize scheduling and time management</div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 bg-gray-800/40 p-3 rounded-lg border border-white/10 cursor-pointer hover:bg-gray-800/60">
                  <RadioGroupItem value="kpiFocused" id="kpiFocused" />
                  <Label htmlFor="kpiFocused" className="flex-1 cursor-pointer">
                    <div className="font-medium">KPI Focused</div>
                    <div className="text-sm text-gray-400">Highlight metrics and business performance</div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleContinue} 
                className="w-full bg-cerebro-purple hover:bg-cerebro-purple-dark"
              >
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        );
        
      case 'calendar':
        return (
          <>
            <CardHeader>
              <CardTitle className="text-cerebro-soft text-xl">Connect Calendar</CardTitle>
              <CardDescription>Sync with your Google Calendar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col items-center">
              <Calendar className="h-16 w-16 text-cerebro-cyan mb-2" />
              <p className="text-center text-cerebro-soft/80">
                Connect your Google Calendar to sync events, schedule tasks, and get AI-powered scheduling recommendations.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button 
                onClick={handleContinue} 
                className="w-full bg-cerebro-purple hover:bg-cerebro-purple-dark"
              >
                Connect Google Calendar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/dashboard")} 
                className="w-full border-white/10 text-cerebro-soft hover:bg-white/5"
              >
                Skip for now
              </Button>
            </CardFooter>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cerebro-dark bg-neural-pattern p-4">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-cerebro-purple/10 to-transparent opacity-20" />
      
      <div className="flex flex-col items-center mb-8 z-10">
        <div className="flex items-center gap-2 mb-4">
          <Brain size={40} className="text-cerebro-purple" />
          <h1 className="text-4xl font-bold text-gradient">Cerebro</h1>
        </div>
      </div>

      <Card className="w-full max-w-md border-white/10 bg-gray-900/60 backdrop-blur-lg shadow-xl z-10">
        {renderStepContent()}
      </Card>
      
      <div className="mt-8 flex gap-2 z-10">
        <div className={`h-2 w-12 rounded-full ${currentStep === 'welcome' ? 'bg-cerebro-purple' : 'bg-white/20'}`}></div>
        <div className={`h-2 w-12 rounded-full ${currentStep === 'business' ? 'bg-cerebro-purple' : 'bg-white/20'}`}></div>
        <div className={`h-2 w-12 rounded-full ${currentStep === 'layout' ? 'bg-cerebro-purple' : 'bg-white/20'}`}></div>
        <div className={`h-2 w-12 rounded-full ${currentStep === 'calendar' ? 'bg-cerebro-purple' : 'bg-white/20'}`}></div>
      </div>
    </div>
  );
};

export default Onboarding;
