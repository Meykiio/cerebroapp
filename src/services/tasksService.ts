import { supabase } from "@/integrations/supabase/client";
import Logger from "./loggingService";

const logger = Logger.getInstance('tasks');

// Custom error types
export class TaskValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TaskValidationError';
  }
}

export class TaskOperationError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'TaskOperationError';
  }
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  tags: string[];
  created_at: string;
  user_id: string;
  updated_at: string;
}

// Validation functions
const validateTaskInput = (task: Partial<Task>) => {
  if (task.title && (typeof task.title !== 'string' || task.title.trim().length === 0)) {
    throw new TaskValidationError('Task title is required and must be a non-empty string');
  }

  if (task.priority && !['low', 'medium', 'high'].includes(task.priority)) {
    throw new TaskValidationError('Task priority must be low, medium, or high');
  }

  if (task.due_date && isNaN(Date.parse(task.due_date))) {
    throw new TaskValidationError('Invalid due date format');
  }

  if (task.tags && (!Array.isArray(task.tags) || !task.tags.every(tag => typeof tag === 'string'))) {
    throw new TaskValidationError('Tags must be an array of strings');
  }
};

export const getTasks = async () => {
  try {
    logger.debug('Fetching tasks');
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      logger.error('Failed to fetch tasks', { error });
      throw new TaskOperationError('Failed to fetch tasks', error);
    }

    logger.info(`Successfully fetched ${data.length} tasks`);
    return data as Task[];
  } catch (error) {
    if (error instanceof TaskOperationError) {
      throw error;
    }
    logger.error('Unexpected error while fetching tasks', { error });
    throw new TaskOperationError('Unexpected error while fetching tasks', error);
  }
};

export const createTask = async (task: Omit<Task, "id" | "created_at">) => {
  try {
    logger.debug('Creating new task', { task });
    validateTaskInput(task);

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        ...task,
        title: task.title.trim(),
        tags: task.tags || [],
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to create task', { error, task });
      throw new TaskOperationError('Failed to create task', error);
    }

    logger.info('Successfully created task', { taskId: data.id });
    return data as Task;
  } catch (error) {
    if (error instanceof TaskValidationError || error instanceof TaskOperationError) {
      throw error;
    }
    logger.error('Unexpected error while creating task', { error, task });
    throw new TaskOperationError('Unexpected error while creating task', error);
  }
};

export const updateTask = async (id: string, updates: Partial<Task>) => {
  try {
    logger.debug('Updating task', { taskId: id, updates });
    if (!id?.trim()) {
      throw new TaskValidationError('Task ID is required');
    }

    validateTaskInput(updates);

    const { data, error } = await supabase
      .from("tasks")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        title: updates.title?.trim(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      logger.error('Failed to update task', { error, taskId: id, updates });
      throw new TaskOperationError('Failed to update task', error);
    }

    logger.info('Successfully updated task', { taskId: id });
    return data as Task;
  } catch (error) {
    if (error instanceof TaskValidationError || error instanceof TaskOperationError) {
      throw error;
    }
    logger.error('Unexpected error while updating task', { error, taskId: id, updates });
    throw new TaskOperationError('Unexpected error while updating task', error);
  }
};

export const deleteTask = async (id: string) => {
  try {
    logger.debug('Deleting task', { taskId: id });
    if (!id?.trim()) {
      throw new TaskValidationError('Task ID is required');
    }

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      logger.error('Failed to delete task', { error, taskId: id });
      throw new TaskOperationError('Failed to delete task', error);
    }

    logger.info('Successfully deleted task', { taskId: id });
    return true;
  } catch (error) {
    if (error instanceof TaskValidationError || error instanceof TaskOperationError) {
      throw error;
    }
    logger.error('Unexpected error while deleting task', { error, taskId: id });
    throw new TaskOperationError('Unexpected error while deleting task', error);
  }
};
