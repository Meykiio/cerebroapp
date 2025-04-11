
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "./tasksService";
import { Note } from "./notesService";
import { CalendarEvent } from "./calendarService";
import { createTask } from "./tasksService";
import { createNote } from "./notesService";
import { createEvent } from "./calendarService";

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
    const completedTasks = tasks.filter((task: any) => task.completed).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEvents = events.filter((event: any) => {
      const eventDate = new Date(event.start_date);
      return eventDate >= today && eventDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
    }).length;
    
    const upcomingDeadlines = tasks.filter((task: any) => {
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

// Function to create a task based on natural language input
export const createTaskFromText = async (text: string, userId: string): Promise<Task | null> => {
  try {
    const response = await generateGeminiResponse([
      {
        role: "user",
        parts: [{ text: `Parse this text and extract task information: "${text}". Return a JSON with these fields: title (required), priority (low/medium/high), due_date (YYYY-MM-DD format, optional), tags (array of strings, optional). Only return valid JSON, no explanation.` }]
      }
    ]);
    
    // Parse the response to extract task data
    const taskData = JSON.parse(response);
    
    if (!taskData.title) {
      throw new Error("Could not extract a task title");
    }
    
    const task = await createTask({
      title: taskData.title,
      priority: taskData.priority || "medium",
      due_date: taskData.due_date,
      tags: taskData.tags || [],
      completed: false,
      user_id: userId,
      updated_at: new Date().toISOString()
    });
    
    return task;
  } catch (error) {
    console.error("Error creating task from text:", error);
    return null;
  }
};

// Function to create a note based on natural language input
export const createNoteFromText = async (text: string, userId: string): Promise<Note | null> => {
  try {
    const response = await generateGeminiResponse([
      {
        role: "user",
        parts: [{ text: `Parse this text and extract note information: "${text}". Return a JSON with these fields: title (required), content (required), tags (array of strings, optional). Only return valid JSON, no explanation.` }]
      }
    ]);
    
    // Parse the response to extract note data
    const noteData = JSON.parse(response);
    
    if (!noteData.title) {
      throw new Error("Could not extract a note title");
    }
    
    const note = await createNote({
      title: noteData.title,
      content: noteData.content || "",
      tags: noteData.tags || [],
      user_id: userId
    });
    
    return note;
  } catch (error) {
    console.error("Error creating note from text:", error);
    return null;
  }
};

// Function to create an event based on natural language input
export const createEventFromText = async (text: string, userId: string): Promise<CalendarEvent | null> => {
  try {
    const response = await generateGeminiResponse([
      {
        role: "user",
        parts: [{ text: `Parse this text and extract calendar event information: "${text}". Return a JSON with these fields: title (required), start_date (ISO format with time, required), end_date (ISO format with time, optional), type (meeting/call/deadline/reminder), description (optional), is_reminder (boolean). Only return valid JSON, no explanation.` }]
      }
    ]);
    
    // Parse the response to extract event data
    const eventData = JSON.parse(response);
    
    if (!eventData.title || !eventData.start_date) {
      throw new Error("Could not extract event title or date");
    }
    
    const event = await createEvent({
      title: eventData.title,
      start_date: eventData.start_date,
      end_date: eventData.end_date || null,
      type: eventData.type || "reminder",
      description: eventData.description || "",
      is_reminder: eventData.is_reminder || false,
      color: "#6366f1", // Default color
      user_id: userId,
      updated_at: new Date().toISOString()
    });
    
    return event;
  } catch (error) {
    console.error("Error creating event from text:", error);
    return null;
  }
};

// Function to detect intent from user input
export const detectIntentAndExecute = async (text: string, userId: string): Promise<string> => {
  try {
    // First, detect the user's intent
    const intentResponse = await generateGeminiResponse([
      {
        role: "user",
        parts: [{ text: `Analyze this text and determine the intent. Return only one of these: "create_task", "create_note", "create_event", "query". Text: "${text}"` }]
      }
    ]);
    
    const intent = intentResponse.trim().toLowerCase();
    let result = null;
    
    // Execute the appropriate action based on intent
    if (intent.includes("create_task")) {
      result = await createTaskFromText(text, userId);
      if (result) {
        return `✅ Created task: "${result.title}"`;
      }
    } 
    else if (intent.includes("create_note")) {
      result = await createNoteFromText(text, userId);
      if (result) {
        return `✅ Created note: "${result.title}"`;
      }
    } 
    else if (intent.includes("create_event")) {
      result = await createEventFromText(text, userId);
      if (result) {
        return `✅ Added to calendar: "${result.title}" on ${new Date(result.start_date).toLocaleString()}`;
      }
    }
    
    if (!result) {
      // Fall back to normal query if no action was taken or if intent was "query"
      return await generateGeminiResponse([
        {
          role: "user",
          parts: [{ text }]
        }
      ]);
    }
    
    return "I couldn't process that action. Please try again.";
    
  } catch (error) {
    console.error("Error detecting intent and executing:", error);
    return "I encountered an error while processing your request. Please try again.";
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

I can also help create new tasks, notes and calendar events based on your requests. Just tell me what you need, like "Add a task to finish the report by Friday".

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
