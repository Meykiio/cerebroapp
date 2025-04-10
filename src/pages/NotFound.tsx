
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cerebro-dark bg-neural-pattern p-4">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-cerebro-purple/10 to-transparent opacity-20" />
      
      <div className="flex items-center gap-2 mb-6 z-10">
        <Brain size={40} className="text-cerebro-purple" />
        <h1 className="text-4xl font-bold text-gradient">Cerebro</h1>
      </div>
      
      <div className="text-center max-w-md z-10">
        <h2 className="text-6xl font-bold text-cerebro-soft mb-4">404</h2>
        <h3 className="text-2xl font-semibold mb-2">Page Not Found</h3>
        <p className="text-cerebro-soft/70 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/dashboard">
          <Button className="bg-cerebro-purple hover:bg-cerebro-purple-dark">
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
