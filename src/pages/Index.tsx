
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Calendar, 
  ChevronRight, 
  ClipboardList, 
  LineChart, 
  StickyNote,
  ArrowRight,
  Check,
  LucideProps
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

// Animated background particles
const ParticleAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-cerebro-purple/20"
          style={{
            width: `${Math.random() * 15 + 5}px`,
            height: `${Math.random() * 15 + 5}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.3,
            animation: `float ${Math.random() * 10 + 15}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  );
};

// Animated feature card
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  iconColor, 
  iconBgColor 
}: { 
  icon: React.ComponentType<LucideProps>; 
  title: string; 
  description: string; 
  iconColor: string; 
  iconBgColor: string;
}) => {
  return (
    <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-white/10 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg hover:shadow-cerebro-purple/10 group">
      <div className={`h-12 w-12 rounded-lg ${iconBgColor} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-cerebro-soft/70">{description}</p>
    </div>
  );
};

// Pricing tier component
interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const PricingTier = ({ name, price, description, features, highlighted = false }: PricingTierProps) => {
  return (
    <div className={cn(
      "relative p-6 rounded-xl border backdrop-blur-sm transition-all duration-300",
      highlighted 
        ? "bg-cerebro-purple/20 border-cerebro-purple/50 shadow-lg shadow-cerebro-purple/20" 
        : "bg-gray-800/40 border-white/10 hover:border-white/20"
    )}>
      {highlighted && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cerebro-purple text-white text-xs font-bold py-1 px-3 rounded-full">
          Popular
        </div>
      )}
      <h3 className="text-xl font-bold">{name}</h3>
      <div className="mt-2">
        <span className="text-3xl font-bold">{price}</span>
        {price !== "Free" && <span className="text-cerebro-soft/60 ml-1">/month</span>}
      </div>
      <p className="mt-3 text-cerebro-soft/70">{description}</p>
      
      <ul className="mt-6 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-cerebro-purple shrink-0 mr-2" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        className={cn(
          "w-full mt-6",
          highlighted 
            ? "bg-cerebro-purple hover:bg-cerebro-purple-dark" 
            : "bg-white/10 hover:bg-white/20"
        )}
      >
        Get Started
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

// Animated headline with typing effect
const TypedHeadline = () => {
  return (
    <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
      AI-Powered <br />
      <span className="text-gradient glow-text">Productivity OS</span>
      <br /> for Entrepreneurs
    </h1>
  );
};

const Index = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleWaitlistSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Thank you for joining our waitlist!");
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-cerebro-dark bg-neural-pattern">
      <ParticleAnimation />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-cerebro-purple/10 to-transparent opacity-20" />
      
      {/* Header */}
      <header className="border-b border-white/10 bg-gray-900/40 backdrop-blur-md relative z-10">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-2">
            <Brain size={32} className="text-cerebro-purple animate-pulse" />
            <span className="text-2xl font-bold text-gradient">Cerebro</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-cerebro-soft hover:text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-cerebro-purple hover:bg-cerebro-purple-dark animate-fade-in">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero */}
      <section className="relative pt-20 pb-32 flex flex-col items-center z-10 overflow-hidden">
        <div className="text-center max-w-3xl px-4 mx-auto">
          <TypedHeadline />
          <p className="text-xl text-cerebro-soft/80 mb-10 max-w-2xl mx-auto animate-fade-in animation-delay-150">
            Cerebro combines AI-driven task management, goal planning, calendar syncing, and KPI tracking—all in one powerful platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animation-delay-300">
            <Link to="/signup">
              <Button size="lg" className="bg-cerebro-purple hover:bg-cerebro-purple-dark group transition-all duration-300">
                Get Started 
                <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white/20 text-cerebro-soft hover:bg-white/5">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Floating dashboard preview */}
        <div className="relative mt-16 w-full max-w-5xl mx-auto animate-float">
          <div className="absolute inset-0 bg-gradient-to-b from-cerebro-purple/30 to-transparent rounded-lg filter blur-[64px] opacity-50 transform -translate-y-1/2"></div>
          <div className="relative bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            <div className="aspect-[16/9] w-full">
              <img 
                src="https://placehold.co/1920x1080/2a2a2a/4f46e5?text=Cerebro+Dashboard" 
                alt="Dashboard preview" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-20 bg-gray-900/40 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gradient animate-fade-in">
            Powered by Gemini AI
          </h2>
          <p className="text-lg text-center text-cerebro-soft/80 max-w-2xl mx-auto mb-12 animate-fade-in animation-delay-150">
            Our AI assistant helps you manage tasks, analyze your calendar, and optimize your productivity.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={ClipboardList}
              title="Task & Goal Manager"
              description="Smart task management with natural language input. Break large goals into manageable subtasks with AI assistance."
              iconColor="text-cerebro-purple"
              iconBgColor="bg-cerebro-purple/20"
            />
            
            <FeatureCard 
              icon={Calendar}
              title="Smart Calendar"
              description="Google Calendar integration with drag-and-drop scheduling. AI suggests optimal time blocks based on your productivity patterns."
              iconColor="text-cerebro-cyan"
              iconBgColor="bg-cerebro-cyan/20"
            />
            
            <FeatureCard 
              icon={LineChart}
              title="KPI Tracker"
              description="Track business metrics that matter. Visualize trends and get AI insights on your performance indicators."
              iconColor="text-green-500"
              iconBgColor="bg-green-500/20"
            />
            
            <FeatureCard 
              icon={StickyNote}
              title="Idea Vault"
              description="Capture notes and ideas with voice input. AI organizes, summarizes, and connects your thoughts to actionable tasks."
              iconColor="text-yellow-500"
              iconBgColor="bg-yellow-500/20"
            />
          </div>
        </div>
      </section>
      
      {/* Pricing */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gradient animate-fade-in">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-center text-cerebro-soft/80 max-w-2xl mx-auto mb-12 animate-fade-in animation-delay-150">
            Choose the plan that best fits your needs. All plans come with a 14-day free trial.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingTier 
              name="Starter"
              price="Free"
              description="Perfect for individual entrepreneurs just getting started."
              features={[
                "Task management",
                "Basic calendar integration",
                "5 AI assistant queries per day",
                "1 workspace"
              ]}
            />
            
            <PricingTier 
              name="Pro"
              price="$19"
              description="For growing businesses needing more powerful features."
              features={[
                "Everything in Starter",
                "Unlimited AI assistant queries",
                "KPI tracking and insights",
                "Advanced calendar management",
                "3 workspaces"
              ]}
              highlighted={true}
            />
            
            <PricingTier 
              name="Enterprise"
              price="$49"
              description="Custom solutions for larger teams and organizations."
              features={[
                "Everything in Pro",
                "Priority support",
                "Team collaboration features",
                "API access",
                "Custom integrations",
                "Unlimited workspaces"
              ]}
            />
          </div>
        </div>
      </section>
      
      {/* Waitlist Form */}
      <section className="py-20 bg-gray-900/40 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 animate-fade-in">Join the Waitlist</h2>
          <p className="text-xl text-cerebro-soft/80 mb-8 max-w-2xl mx-auto animate-fade-in animation-delay-150">
            We're still putting the finishing touches on Cerebro. Sign up to be first in line when we launch.
          </p>
          
          <form onSubmit={handleWaitlistSignup} className="max-w-md mx-auto flex gap-2 animate-fade-in animation-delay-300">
            <Input 
              type="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/10 border-white/20 focus-visible:ring-cerebro-purple"
            />
            <Button 
              type="submit" 
              className="bg-cerebro-purple hover:bg-cerebro-purple-dark whitespace-nowrap"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Joining..." : "Join Waitlist"}
            </Button>
          </form>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gradient animate-fade-in">What Our Users Say</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Cerebro has completely transformed how I manage my day-to-day tasks. The AI suggestions are eerily accurate!",
                author: "Sarah K.",
                role: "Startup Founder"
              },
              {
                quote: "I've tried dozens of productivity tools, but Cerebro is the first one that actually adapts to how I work instead of the other way around.",
                author: "Michael T.",
                role: "Project Manager"
              },
              {
                quote: "The KPI tracking feature has given me insights into my business I never knew I needed. Game changer for my decision making.",
                author: "Alexa R.",
                role: "E-commerce Entrepreneur"
              }
            ].map((testimonial, i) => (
              <div 
                key={i} 
                className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-white/10 animate-fade-in"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <p className="italic text-cerebro-soft/90 mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-cerebro-soft/60">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 animate-fade-in">Ready to boost your productivity?</h2>
          <p className="text-xl text-cerebro-soft/80 mb-8 max-w-2xl mx-auto animate-fade-in animation-delay-150">
            Join thousands of entrepreneurs and founders who use Cerebro to achieve more with less effort.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-cerebro-purple hover:bg-cerebro-purple-dark group animate-fade-in animation-delay-300">
              Start Free Trial 
              <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t border-white/10 bg-gray-900/40 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Brain size={24} className="text-cerebro-purple" />
              <span className="text-xl font-bold text-gradient">Cerebro</span>
            </div>
            
            <div className="flex gap-6 mb-4 md:mb-0">
              <a href="#" className="text-cerebro-soft/60 hover:text-cerebro-soft transition-colors">Privacy</a>
              <a href="#" className="text-cerebro-soft/60 hover:text-cerebro-soft transition-colors">Terms</a>
              <a href="#" className="text-cerebro-soft/60 hover:text-cerebro-soft transition-colors">Contact</a>
              <a href="#" className="text-cerebro-soft/60 hover:text-cerebro-soft transition-colors">About</a>
            </div>
            
            <div className="text-sm text-cerebro-soft/60">
              © {new Date().getFullYear()} Cerebro AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
