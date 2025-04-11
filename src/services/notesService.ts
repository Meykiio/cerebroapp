
import { supabase } from "@/integrations/supabase/client";

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  user_id: string;
}

export const getNotes = async () => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as Note[];
};

export const createNote = async (note: Omit<Note, "id" | "created_at">) => {
  const { data, error } = await supabase
    .from("notes")
    .insert([note])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Note;
};

export const updateNote = async (id: string, updates: Partial<Note>) => {
  const { data, error } = await supabase
    .from("notes")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Note;
};

export const deleteNote = async (id: string) => {
  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return true;
};
