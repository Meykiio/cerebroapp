import React, { useState, useEffect } from "react";
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
  LucideProps,
  Github,
  Linkedin,
  Instagram,
  ExternalLink,
  Languages,
  CheckCircle,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

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

// Neural background animation
const NeuralAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.5)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
          </radialGradient>
        </defs>
        <g fill="none" stroke="url(#gradient)" strokeWidth="0.2">
          {Array.from({ length: 20 }).map((_, i) => (
            <path
              key={i}
              d={`M${Math.random() * 100} ${Math.random() * 100} 
                  Q${Math.random() * 100} ${Math.random() * 100}, 
                  ${Math.random() * 100} ${Math.random() * 100} 
                  T${Math.random() * 100} ${Math.random() * 100}`}
              className="animate-pulse"
              style={{ animationDelay: `${Math.random() * 3}s`, animationDuration: `${Math.random() * 5 + 10}s` }}
            />
          ))}
        </g>
      </svg>
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
  ctaText?: string;
  ctaLink?: string;
}

const PricingTier = ({ 
  name, 
  price, 
  description, 
  features, 
  highlighted = false,
  ctaText = "Get Started",
  ctaLink = "/signup"
}: PricingTierProps) => {
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
      
      <Link to={ctaLink}>
        <Button 
          className={cn(
            "w-full mt-6 group",
            highlighted 
              ? "bg-cerebro-purple hover:bg-cerebro-purple-dark" 
              : "bg-white/10 hover:bg-white/20"
          )}
        >
          <span>{ctaText}</span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </Link>
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

// Dashboard screenshot carousel
const DashboardCarousel = () => {
  const screenshots = [
    "/images/dash-home.png",
    "/images/dash-tasks.png",
    "/images/dash-calendar.png",
    "/images/dash-notes.png"
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate images every 4 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % screenshots.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [screenshots.length]);

  return (
    <div className="relative mt-16 w-full max-w-5xl mx-auto animate-float">
      <div className="absolute inset-0 bg-gradient-to-b from-cerebro-purple/30 to-transparent rounded-lg filter blur-[64px] opacity-50 transform -translate-y-1/2"></div>
      <div className="relative bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden">
        {/* Image */}
        <div className="aspect-[16/9] w-full">
          {screenshots.map((src, i) => (
            <img 
              key={i}
              src={src} 
              alt={`Dashboard screenshot ${i+1}`}
              className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1000 ${i === activeIndex ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
        </div>

        {/* Image selector dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {screenshots.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setActiveIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${i === activeIndex ? 'bg-cerebro-purple' : 'bg-white/30'}`}
              aria-label={`View screenshot ${i+1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({ 
  name, 
  role, 
  company, 
  testimonial
}: { 
  name: string; 
  role: string; 
  company: string; 
  testimonial: string;
}) => {
  return (
    <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-white/10 animate-fade-in hover:border-white/20 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-cerebro-purple/50 bg-cerebro-purple/20 flex items-center justify-center">
          <User className="h-8 w-8 text-cerebro-purple" />
        </div>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-cerebro-soft/60">{role} at {company}</p>
        </div>
      </div>
      <p className="mt-4 text-cerebro-soft/90">{testimonial}</p>
    </div>
  );
};

const Index = () => {
  const { user } = useAuth();
  
  const features = [
    { title: "Task Management", description: "Organize and track your tasks efficiently", image: "/images/dash-tasks.png" },
    { title: "Calendar Integration", description: "Schedule and manage your events seamlessly", image: "/images/dash-calendar.png" },
    { title: "Note Taking", description: "Capture and organize your thoughts and ideas", image: "/images/dash-notes.png" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cerebro-dark bg-neural-pattern">
      <ParticleAnimation />
      <NeuralAnimation />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-cerebro-purple/10 to-transparent opacity-20" />
      
      {/* Header */}
      <header className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-sm z-50 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">Cerebro AI</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      
      {/* Hero */}
      <section className="relative pt-20 pb-32 flex flex-col items-center z-10 overflow-hidden">
        <div className="text-center max-w-3xl px-4 mx-auto">
          <TypedHeadline />
          <p className="text-xl text-cerebro-soft/80 max-w-3xl mx-auto mb-8 animate-fade-in animation-delay-150">
            Cerebro combines AI-driven task management, goal planning, and calendar syncing—all in one powerful platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animation-delay-300">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="bg-cerebro-purple hover:bg-cerebro-purple-dark group transition-all duration-300 w-full">
                <span>Get Started Free</span>
                <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Floating dashboard preview */}
        <DashboardCarousel />
      </section>
      
      {/* Features */}
      <section id="features" className="py-20 bg-gray-900/40 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gradient animate-fade-in">
            Powered by Neural Intelligence
          </h2>
          <p className="text-lg text-center text-cerebro-soft/80 max-w-2xl mx-auto mb-12 animate-fade-in animation-delay-150">
            Our advanced neural assistant helps you manage tasks, analyze your calendar, and optimize your productivity.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Brain}
              title="Smart Task Prioritization"
              description="AI-powered task management that helps you focus on what matters most"
              iconColor="text-cerebro-purple"
              iconBgColor="bg-cerebro-purple/20"
            />
            <FeatureCard
              icon={Calendar}
              title="Calendar Optimization"
              description="Intelligent scheduling and calendar management to maximize your time"
              iconColor="text-cerebro-cyan"
              iconBgColor="bg-cerebro-cyan/20"
            />
            <FeatureCard
              icon={StickyNote}
              title="Smart Notes"
              description="AI-enhanced note-taking with automatic organization and insights"
              iconColor="text-cerebro-gold"
              iconBgColor="bg-cerebro-gold/20"
            />
          </div>
        </div>
      </section>
      
      {/* About Me Section - Hidden but preserved in code */}
      <section className="hidden py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/3">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-cerebro-purple/50 mx-auto">
                  <img 
                    src="/images/profile-pic.png" 
                    alt="Sifeddine Mebarki" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-cerebro-purple/20 backdrop-blur-md border border-white/10 flex items-center justify-center animate-pulse">
                  <Brain className="h-10 w-10 text-cerebro-purple" />
                </div>
              </div>
              
              <div className="flex justify-center gap-4 mt-8">
                <a href="https://github.com/Meykiio" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                  <Github className="h-5 w-5 text-cerebro-soft" />
                </a>
                <a href="https://www.linkedin.com/in/sifeddine-mebarki-a3883a18b/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                  <Linkedin className="h-5 w-5 text-cerebro-soft" />
                </a>
                <a href="https://www.instagram.com/sifeddine.m/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                  <Instagram className="h-5 w-5 text-cerebro-soft" />
                </a>
                <a href="https://huggingface.co/sifeddine" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                  <Languages className="h-5 w-5 text-cerebro-soft" />
                </a>
              </div>
            </div>
            
            <div className="md:w-2/3 mt-8 md:mt-0">
              <h2 className="text-3xl font-bold mb-4 text-gradient animate-fade-in">
                Meet the Creator
              </h2>
              <h3 className="text-2xl mb-4">Sifeddine Mebarki</h3>
              <p className="text-cerebro-soft/80 mb-6">
                I'm a 28-year-old Web Developer, AI Engineer, Designer, and Entrepreneur based in Algiers, Algeria. 
                With a passion for artificial intelligence and innovative web development, I focus on building tools 
                that empower businesses to achieve more with less effort.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800/20 p-4 rounded-lg border border-white/5">
                  <h4 className="font-medium mb-2">Expertise</h4>
                  <ul className="space-y-2 text-sm text-cerebro-soft/80">
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-cerebro-purple mr-2"></span>
                      Web Development (HTML, CSS, JS, React)
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-cerebro-purple mr-2"></span>
                      AI & Automation Engineering
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-cerebro-purple mr-2"></span>
                      UI/UX Design & Branding
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-cerebro-purple mr-2"></span>
                      E-commerce & Digital Business
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-800/20 p-4 rounded-lg border border-white/5">
                  <h4 className="font-medium mb-2">Goals</h4>
                  <ul className="space-y-2 text-sm text-cerebro-soft/80">
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Empower Algerians in AI innovation
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Achieve financial freedom through AI ventures
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Develop cutting-edge AI applications
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Become an industry leader in AI development
                    </li>
                  </ul>
                </div>
              </div>
              
              <Link to="https://www.linkedin.com/in/sifeddine-mebarki-a3883a18b/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-cerebro-purple/50 hover:bg-cerebro-purple/20 text-cerebro-purple group">
                  Learn More About Me
                  <ExternalLink className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing */}
      <section className="py-20 bg-gray-900/40 relative z-10">
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
              ctaText="Start Free"
              ctaLink="/signup"
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
              ctaText="Start 14-Day Trial"
              ctaLink="/signup?plan=pro"
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
              ctaText="Contact Sales"
              ctaLink="/contact"
            />
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-gray-900/40 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gradient animate-fade-in">What Our Users Say</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              name="Karim Benali"
              role="Startup Founder"
              company="TechMag"
              testimonial="Cerebro AI has transformed how I manage my startup. The AI-powered task management and smart calendar features help me stay focused on what matters most."
            />
            
            <TestimonialCard
              name="Amira Meziane"
              role="Digital Marketing Manager"
              company="AlgérieCom"
              testimonial="The idea vault feature is a game-changer. I can quickly capture ideas during meetings and the AI helps me turn them into actionable tasks. Highly recommended!"
            />
            
            <TestimonialCard
              name="Youcef Hamidi"
              role="Freelance Developer"
              company="CodeCraft"
              testimonial="As a freelancer, managing multiple projects was always challenging. Cerebro AI's intuitive interface and AI capabilities have boosted my productivity significantly."
            />
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
          <div className="flex justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-cerebro-purple hover:bg-cerebro-purple-dark group animate-fade-in animation-delay-300 w-full sm:w-auto">
                Start Free Trial 
                <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t border-white/10 bg-gray-900/40 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Brain size={24} className="text-cerebro-purple" />
              <span className="text-xl font-bold text-gradient">Cerebro</span>
              <span className="text-xs text-cerebro-soft/50 ml-2">Created by Sifeddine Mebarki</span>
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
      
      {/* Animated cursor effect */}
      <div className="fixed hidden lg:block w-6 h-6 pointer-events-none z-50 rounded-full border border-cerebro-purple/50" id="cursor-effect"></div>
      
      {/* Script for cursor effect */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', () => {
            const cursor = document.getElementById('cursor-effect');
            document.addEventListener('mousemove', (e) => {
              if (cursor) {
                cursor.style.left = e.clientX - 12 + 'px';
                cursor.style.top = e.clientY - 12 + 'px';
              }
            });
          });
        `
      }} />
      
      {/* Add smooth scrolling effect */}
      <style dangerouslySetInnerHTML={{
        __html: `
          html {
            scroll-behavior: smooth;
          }
          
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
            100% {
              transform: translateY(0px);
            }
          }
          
          .text-gradient {
            background: linear-gradient(to right, #8B5CF6, #6366F1);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
          
          .glow-text {
            text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
          }
          
          .animation-delay-150 {
            animation-delay: 150ms;
          }
          
          .animation-delay-300 {
            animation-delay: 300ms;
          }
          
          .animation-delay-400 {
            animation-delay: 400ms;
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          
          .bg-neural-pattern {
            background-image: 
              radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.05) 2%, transparent 0%),
              radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.05) 2%, transparent 0%);
            background-size: 60px 60px;
          }
          
          /* Scroll-triggered animations */
          .scroll-fade-up {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
          }
          
          .scroll-fade-up.visible {
            opacity: 1;
            transform: translateY(0);
          }
        `
      }} />
    </div>
  );
};

export default Index;
