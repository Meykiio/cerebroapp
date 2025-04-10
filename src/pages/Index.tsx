
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Calendar, ChevronRight, ClipboardList, LineChart, StickyNote } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cerebro-dark bg-neural-pattern">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-cerebro-purple/10 to-transparent opacity-20" />
      
      {/* Header */}
      <header className="border-b border-white/10 bg-gray-900/40 backdrop-blur-md relative z-10">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-2">
            <Brain size={32} className="text-cerebro-purple" />
            <span className="text-2xl font-bold text-gradient">Cerebro</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-cerebro-soft hover:text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-cerebro-purple hover:bg-cerebro-purple-dark">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero */}
      <section className="relative pt-20 pb-32 flex flex-col items-center z-10">
        <div className="text-center max-w-3xl px-4 mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">
            AI-Powered Productivity OS for Entrepreneurs
          </h1>
          <p className="text-xl text-cerebro-soft/80 mb-10 max-w-2xl mx-auto">
            Cerebro combines AI-driven task management, goal planning, calendar syncing, and KPI tracking—all in one powerful platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-cerebro-purple hover:bg-cerebro-purple-dark">
                Get Started <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white/20 text-cerebro-soft hover:bg-white/5">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-20 bg-gray-900/40 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gradient">Powered by Gemini AI</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <div className="h-12 w-12 rounded-lg bg-cerebro-purple/20 flex items-center justify-center mb-4">
                <ClipboardList className="h-6 w-6 text-cerebro-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Task & Goal Manager</h3>
              <p className="text-cerebro-soft/70">
                Smart task management with natural language input. Break large goals into manageable subtasks with AI assistance.
              </p>
            </div>
            
            <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <div className="h-12 w-12 rounded-lg bg-cerebro-cyan/20 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-cerebro-cyan" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Calendar</h3>
              <p className="text-cerebro-soft/70">
                Google Calendar integration with drag-and-drop scheduling. AI suggests optimal time blocks based on your productivity patterns.
              </p>
            </div>
            
            <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">KPI Tracker</h3>
              <p className="text-cerebro-soft/70">
                Track business metrics that matter. Visualize trends and get AI insights on your performance indicators.
              </p>
            </div>
            
            <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <div className="h-12 w-12 rounded-lg bg-yellow-500/20 flex items-center justify-center mb-4">
                <StickyNote className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Idea Vault</h3>
              <p className="text-cerebro-soft/70">
                Capture notes and ideas with voice input. AI organizes, summarizes, and connects your thoughts to actionable tasks.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to boost your productivity?</h2>
          <p className="text-xl text-cerebro-soft/80 mb-8 max-w-2xl mx-auto">
            Join thousands of entrepreneurs and founders who use Cerebro to achieve more with less effort.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-cerebro-purple hover:bg-cerebro-purple-dark">
              Start Free Trial <ChevronRight className="ml-2 h-5 w-5" />
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
