
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Brain, ChevronRight, Loader2, SendHorizonal, X } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface GeminiAssistantProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ open, setOpen }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi! I'm your Cerebro AI assistant. I can help you manage tasks, analyze your calendar, track KPIs, and more. How can I assist you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Example quick prompts
  const quickPrompts = [
    "What's on my schedule today?",
    "Help me prioritize my tasks",
    "Summarize my week",
    "How are my KPIs trending?",
  ];

  const handleSend = (prompt?: string) => {
    const userMessage = prompt || input;
    if (!userMessage.trim()) return;
    
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      content: userMessage,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    
    // In a real implementation, this would call the Gemini API
    // For now, let's simulate a response
    setTimeout(() => {
      // Mock responses based on question keywords
      let response = "I'm still learning how to help with that.";
      
      if (userMessage.toLowerCase().includes("schedule") || userMessage.toLowerCase().includes("today")) {
        response = "Your schedule today includes a team meeting at 10 AM, a client call at 2 PM, and time blocked for project work from 3-5 PM. You have 2 high-priority tasks due today.";
      } else if (userMessage.toLowerCase().includes("prioritize") || userMessage.toLowerCase().includes("tasks")) {
        response = "Based on your deadlines and calendar, I'd recommend focusing on these tasks today:\n1. Finish the client proposal (due tomorrow)\n2. Prepare for tomorrow's investor meeting\n3. Review the marketing analytics (lower priority but quick to complete)";
      } else if (userMessage.toLowerCase().includes("summarize") || userMessage.toLowerCase().includes("week")) {
        response = "This week you've completed 14 tasks (up 20% from last week), had 8 meetings (down 1 from last week), and your KPIs are showing positive trends in user growth (+5%) but customer acquisition costs increased slightly (+2%).";
      } else if (userMessage.toLowerCase().includes("kpi") || userMessage.toLowerCase().includes("metrics")) {
        response = "Your KPIs are trending mostly positive. Revenue is up 8% MoM, user retention increased by 3%, but customer acquisition costs rose by 5%. I've noticed your conversion rate declined slightly over the past 2 weeks. Would you like me to analyze potential causes?";
      }
      
      const assistantMsg: Message = {
        id: Date.now().toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Assistant panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-80 md:w-96 flex flex-col bg-gray-900/95 backdrop-blur-md border-l border-white/10 shadow-2xl transition-all duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-cerebro-purple" />
            <h2 className="font-semibold">Gemini Assistant</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="text-cerebro-soft hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </Button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col max-w-[85%] rounded-xl p-3",
                message.role === "user"
                  ? "bg-cerebro-purple/20 ml-auto"
                  : "bg-white/5 border border-white/10"
              )}
            >
              <div className="whitespace-pre-line text-sm">{message.content}</div>
              <div className="text-xs text-cerebro-soft/40 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex max-w-[85%] rounded-xl p-3 bg-white/5 border border-white/10">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-cerebro-purple animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-cerebro-purple animate-pulse delay-150" />
                <div className="w-2 h-2 rounded-full bg-cerebro-purple animate-pulse delay-300" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick prompts */}
        <div className="p-3 border-t border-white/10">
          <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hidden pb-2">
            {quickPrompts.map((prompt) => (
              <Button
                key={prompt}
                variant="outline"
                size="sm"
                className="whitespace-nowrap text-xs border-white/10 bg-white/5 hover:bg-white/10 text-cerebro-soft"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="min-h-10 resize-none bg-gray-800/50 border-white/10 text-cerebro-soft placeholder:text-cerebro-soft/60"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isTyping || !input.trim()}
              className="bg-cerebro-purple hover:bg-cerebro-purple-dark"
            >
              {isTyping ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <SendHorizonal size={18} />
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default GeminiAssistant;
