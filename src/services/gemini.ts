
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "./tasksService";
import { Note } from "./notesService";
import { CalendarEvent } from "./calendarService";

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

// Function to fetch real app data from Supabase database
export const getAppContextData = async () => {
  try {
    // Fetch tasks from Supabase
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (tasksError) {
      console.error("Error fetching tasks:", tasksError);
      throw tasksError;
    }
    
    // Fetch notes from Supabase
    const { data: notes, error: notesError } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (notesError) {
      console.error("Error fetching notes:", notesError);
      throw notesError;
    }
    
    // Fetch events from Supabase
    const { data: events, error: eventsError } = await supabase
      .from("calendar_events")
      .select("*")
      .order("start_date", { ascending: true });
    
    if (eventsError) {
      console.error("Error fetching events:", eventsError);
      throw eventsError;
    }
    
    // Calculate some basic KPIs and trends (these could be fetched from a KPIs table in future)
    const completedTasks = tasks.filter((task: Task) => task.completed).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEvents = events.filter((event: CalendarEvent) => {
      const eventDate = new Date(event.start_date);
      return eventDate >= today && eventDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
    }).length;
    
    const upcomingDeadlines = tasks.filter((task: Task) => {
      if (!task.due_date || task.completed) return false;
      const dueDate = new Date(task.due_date);
      return dueDate >= today && dueDate < new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    }).length;
    
    return {
      tasks: tasks || [],
      notes: notes || [],
      events: events || [],
      kpis: {
        completedTasks: completedTasks,
        totalTasks: totalTasks,
        completionRate: `${completionRate}%`,
        todayEvents: todayEvents,
        upcomingDeadlines: upcomingDeadlines,
        trends: {
          taskCompletion: completionRate > 50 ? "Good" : "Needs improvement",
          busyDays: todayEvents > 3 ? "High" : "Manageable"
        }
      }
    };
  } catch (error) {
    console.error("Error fetching app context data:", error);
    // Return empty data as fallback
    return {
      tasks: [],
      notes: [],
      events: [],
      kpis: {
        completedTasks: 0,
        totalTasks: 0,
        completionRate: "0%",
        todayEvents: 0,
        upcomingDeadlines: 0,
        trends: {
          taskCompletion: "No data",
          busyDays: "No data"
        }
      }
    };
  }
};

export const generateGeminiResponse = async (
  messages: GeminiMessage[]
): Promise<string> => {
  try {
    // Get actual app context data from database
    const appData = await getAppContextData();
    
    // Format data for better context
    const tasksFormatted = appData.tasks.map((task: any) => ({
      title: task.title,
      completed: task.completed,
      priority: task.priority,
      due_date: task.due_date ? new Date(task.due_date).toLocaleDateString() : "Not set",
      tags: task.tags || []
    }));
    
    const notesFormatted = appData.notes.map((note: any) => ({
      title: note.title,
      content: note.content,
      tags: note.tags || [],
      created_at: new Date(note.created_at).toLocaleDateString()
    }));
    
    const eventsFormatted = appData.events.map((event: any) => ({
      title: event.title,
      type: event.type,
      start_date: new Date(event.start_date).toLocaleDateString() + " " + 
               new Date(event.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      is_reminder: event.is_reminder
    }));
    
    // Add context to the first message
    let enrichedMessages = [...messages];
    if (enrichedMessages.length > 0 && enrichedMessages[0].role === "user") {
      const contextPrefix = `You are Cerebro AI, a helpful assistant with access to the following real data about the user's business and tasks:
      
Tasks (${tasksFormatted.length}): ${JSON.stringify(tasksFormatted)}
Calendar Events (${eventsFormatted.length}): ${JSON.stringify(eventsFormatted)}
Notes (${notesFormatted.length}): ${JSON.stringify(notesFormatted)}
KPIs: ${JSON.stringify(appData.kpis)}

Based on this real user data, please respond to the following query. Always reference the actual data above when answering questions about tasks, events, notes, or metrics. If asked about specific dates or time periods, filter the data accordingly in your response: `;
      
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
    return "I'm sorry, I couldn't process your request right now. There was an error accessing your data.";
  }
};
