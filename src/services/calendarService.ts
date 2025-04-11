
import { supabase } from "@/integrations/supabase/client";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  type: string; // Changed from strict union type to string to match database
  color: string;
  is_reminder: boolean;
  created_at: string;
  user_id: string;
  updated_at: string;
}

export const getEvents = async () => {
  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .order("start_date", { ascending: true });

  if (error) {
    throw error;
  }

  return data as CalendarEvent[];
};

export const createEvent = async (event: Omit<CalendarEvent, "id" | "created_at">) => {
  const { data, error } = await supabase
    .from("calendar_events")
    .insert(event)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as CalendarEvent;
};

export const updateEvent = async (id: string, updates: Partial<CalendarEvent>) => {
  const { data, error } = await supabase
    .from("calendar_events")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as CalendarEvent;
};

export const deleteEvent = async (id: string) => {
  const { error } = await supabase
    .from("calendar_events")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return true;
};
