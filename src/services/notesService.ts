import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Logger from "./loggingService";

const logger = Logger.getInstance('notes');

// Custom error types
export class NoteValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoteValidationError';
  }
}

export class NoteOperationError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'NoteOperationError';
  }
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  user_id: string;
  updated_at: string;
}

// Validation functions
const validateNoteInput = (note: Partial<Note>) => {
  if (note.title && (typeof note.title !== 'string' || note.title.trim().length === 0)) {
    throw new NoteValidationError('Note title is required and must be a non-empty string');
  }

  if (note.content && typeof note.content !== 'string') {
    throw new NoteValidationError('Note content must be a string');
  }

  if (note.tags && (!Array.isArray(note.tags) || !note.tags.every(tag => typeof tag === 'string'))) {
    throw new NoteValidationError('Tags must be an array of strings');
  }
};

export const getNotes = async () => {
  try {
    logger.debug('Fetching notes');
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      logger.error('Failed to fetch notes', { error });
      throw new NoteOperationError('Failed to fetch notes', error);
    }

    logger.info(`Successfully fetched ${data.length} notes`);
    return data as Note[];
  } catch (error) {
    if (error instanceof NoteOperationError) {
      throw error;
    }
    logger.error('Unexpected error while fetching notes', { error });
    throw new NoteOperationError('Unexpected error while fetching notes', error);
  }
};

export const createNote = async (note: Omit<Note, "id" | "created_at">) => {
  try {
    logger.debug('Creating new note', { note });
    validateNoteInput(note);

    const { data, error } = await supabase
      .from("notes")
      .insert({
        ...note,
        title: note.title.trim(),
        content: note.content.trim(),
        tags: note.tags || [],
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to create note', { error, note });
      throw new NoteOperationError('Failed to create note', error);
    }

    logger.info('Successfully created note', { noteId: data.id });
    return data as Note;
  } catch (error) {
    if (error instanceof NoteValidationError || error instanceof NoteOperationError) {
      throw error;
    }
    logger.error('Unexpected error while creating note', { error, note });
    throw new NoteOperationError('Unexpected error while creating note', error);
  }
};

export const updateNote = async (id: string, updates: Partial<Note>) => {
  try {
    logger.debug('Updating note', { noteId: id, updates });
    if (!id?.trim()) {
      throw new NoteValidationError('Note ID is required');
    }

    validateNoteInput(updates);

    const { data, error } = await supabase
      .from("notes")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        title: updates.title?.trim(),
        content: updates.content?.trim(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      logger.error('Failed to update note', { error, noteId: id, updates });
      throw new NoteOperationError('Failed to update note', error);
    }

    logger.info('Successfully updated note', { noteId: id });
    return data as Note;
  } catch (error) {
    if (error instanceof NoteValidationError || error instanceof NoteOperationError) {
      throw error;
    }
    logger.error('Unexpected error while updating note', { error, noteId: id, updates });
    throw new NoteOperationError('Unexpected error while updating note', error);
  }
};

export const deleteNote = async (id: string) => {
  try {
    logger.debug('Deleting note', { noteId: id });
    if (!id?.trim()) {
      throw new NoteValidationError('Note ID is required');
    }

    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id);

    if (error) {
      logger.error('Failed to delete note', { error, noteId: id });
      throw new NoteOperationError('Failed to delete note', error);
    }

    logger.info('Successfully deleted note', { noteId: id });
    return true;
  } catch (error) {
    if (error instanceof NoteValidationError || error instanceof NoteOperationError) {
      throw error;
    }
    logger.error('Unexpected error while deleting note', { error, noteId: id });
    throw new NoteOperationError('Unexpected error while deleting note', error);
  }
};
