
import { toast } from "sonner";

// Updated to use the correct API endpoint
const GEMINI_API_KEY = "AIzaSyAkEDnb6ZajP2O57nLMZ0-_hNgWJGWI8OQ";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";

export interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface GeminiRequest {
  contents: GeminiMessage[];
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
      role: string;
    };
    finishReason: string;
  }[];
  promptFeedback?: {
    blockReason?: string;
  };
}

// Function to fetch app data that will be provided to Gemini
export const getAppContextData = async () => {
  // In a real app, you would fetch this data from your database/state
  // For now, we'll use mock data to demonstrate
  return {
    tasks: [
      { id: "1", title: "Complete project proposal", priority: "high", dueDate: "2025-04-15" },
      { id: "2", title: "Client meeting", priority: "medium", dueDate: "2025-04-12" },
      { id: "3", title: "Review marketing campaign", priority: "low", dueDate: "2025-04-20" },
    ],
    events: [
      { id: "1", title: "Team Meeting", date: "2025-04-15 10:00", type: "meeting" },
      { id: "2", title: "Client Call", date: "2025-04-15 14:00", type: "call" },
      { id: "3", title: "Project Review", date: "2025-04-16 09:00", type: "meeting" },
    ],
    notes: [
      { id: "1", title: "Marketing Strategy", content: "Consider implementing referral program to boost organic growth" },
      { id: "2", title: "Product Feedback", content: "Users have requested better onboarding experience" },
      { id: "3", title: "Team Meeting Notes", content: "Discussed Q3 goals and resource allocation" },
    ],
    kpis: {
      mrr: "$24,500",
      activeUsers: "4,283",
      cac: "$42.25",
      trends: {
        mrrGrowth: "+8.2%",
        userGrowth: "+12.5%",
        cacChange: "-3.7%"
      }
    }
  };
};

export const generateGeminiResponse = async (
  messages: GeminiMessage[]
): Promise<string> => {
  try {
    // Get app context data to provide to Gemini
    const appData = await getAppContextData();
    
    // Add context to the first message
    let enrichedMessages = [...messages];
    if (enrichedMessages.length > 0 && enrichedMessages[0].role === "user") {
      const contextPrefix = `You are Cerebro AI, a helpful assistant with access to the following data about the user's business and tasks:
      
Tasks: ${JSON.stringify(appData.tasks)}
Calendar Events: ${JSON.stringify(appData.events)}
Notes: ${JSON.stringify(appData.notes)}
KPIs: ${JSON.stringify(appData.kpis)}

Based on this information, please respond to the following query: `;
      
      enrichedMessages[0] = {
        ...enrichedMessages[0],
        parts: [{ text: contextPrefix + enrichedMessages[0].parts[0].text }]
      };
    }
    
    const requestBody: GeminiRequest = {
      contents: enrichedMessages,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    };

    const response = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`Gemini API error: ${errorData.error?.message || "Unknown error"}`);
    }

    const data: GeminiResponse = await response.json();

    // Check for content filtering
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Content was blocked: ${data.promptFeedback.blockReason}`);
    }

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response generated");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    toast.error("Failed to get AI response. Please try again.");
    return "I'm sorry, I couldn't process your request right now.";
  }
};
