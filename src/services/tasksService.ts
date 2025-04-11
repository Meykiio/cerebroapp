
import { supabase } from "@/integrations/supabase/client";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: string; // Changed from strict union type to string to match database
  due_date?: string;
  tags: string[];
  created_at: string;
  user_id: string;
  updated_at: string; // Make sure this field is included
}

export const getTasks = async () => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as Task[];
};

export const createTask = async (task: Omit<Task, "id" | "created_at">) => {
  const { data, error } = await supabase
    .from("tasks")
    .insert(task)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Task;
};

export const updateTask = async (id: string, updates: Partial<Task>) => {
  const { data, error } = await supabase
    .from("tasks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Task;
};

export const deleteTask = async (id: string) => {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return true;
};
