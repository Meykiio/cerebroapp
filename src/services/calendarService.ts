import { supabase } from "@/integrations/supabase/client";
import Logger from "./loggingService";

const logger = Logger.getInstance('calendar');

// Custom error types
export class CalendarValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CalendarValidationError';
  }
}

export class CalendarOperationError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'CalendarOperationError';
  }
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  type: 'meeting' | 'task' | 'reminder' | 'other';
  color: string;
  is_reminder: boolean;
  created_at: string;
  user_id: string;
  updated_at: string;
}

// Validation functions
const validateEventInput = (event: Partial<CalendarEvent>) => {
  if (event.title && (typeof event.title !== 'string' || event.title.trim().length === 0)) {
    throw new CalendarValidationError('Event title is required and must be a non-empty string');
  }

  if (event.type && !['meeting', 'task', 'reminder', 'other'].includes(event.type)) {
    throw new CalendarValidationError('Event type must be meeting, task, reminder, or other');
  }

  if (event.start_date && isNaN(Date.parse(event.start_date))) {
    throw new CalendarValidationError('Invalid start date format');
  }

  if (event.end_date) {
    if (isNaN(Date.parse(event.end_date))) {
      throw new CalendarValidationError('Invalid end date format');
    }
    if (new Date(event.end_date) < new Date(event.start_date!)) {
      throw new CalendarValidationError('End date cannot be before start date');
    }
  }

  if (event.color) {
    // Accept both with and without hash
    const colorRegex = /^#?[0-9A-Fa-f]{6}$/;
    if (!colorRegex.test(event.color)) {
      throw new CalendarValidationError('Color must be a valid hex color code (e.g. #FF0000 or FF0000)');
    }
    // Ensure color has # prefix
    if (!event.color.startsWith('#')) {
      event.color = '#' + event.color;
    }
  } else {
    // Provide a default color if none is specified
    event.color = '#4A5568';
  }
};

export const getEvents = async () => {
  try {
    logger.debug('Fetching calendar events');
    const { data, error } = await supabase
      .from("calendar_events")
      .select("*")
      .order("start_date", { ascending: true });

    if (error) {
      logger.error('Failed to fetch events', { error });
      throw new CalendarOperationError('Failed to fetch events', error);
    }

    logger.info(`Successfully fetched ${data.length} events`);
    return data as CalendarEvent[];
  } catch (error) {
    if (error instanceof CalendarOperationError) {
      throw error;
    }
    logger.error('Unexpected error while fetching events', { error });
    throw new CalendarOperationError('Unexpected error while fetching events', error);
  }
};

export const createEvent = async (event: Omit<CalendarEvent, "id" | "created_at">) => {
  try {
    logger.debug('Creating new event', { event });
    validateEventInput(event);

    const { data, error } = await supabase
      .from("calendar_events")
      .insert({
        ...event,
        title: event.title.trim(),
        description: event.description?.trim(),
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to create event', { error, event });
      throw new CalendarOperationError('Failed to create event', error);
    }

    logger.info('Successfully created event', { eventId: data.id });
    return data as CalendarEvent;
  } catch (error) {
    if (error instanceof CalendarValidationError || error instanceof CalendarOperationError) {
      throw error;
    }
    logger.error('Unexpected error while creating event', { error, event });
    throw new CalendarOperationError('Unexpected error while creating event', error);
  }
};

export const updateEvent = async (id: string, updates: Partial<CalendarEvent>) => {
  try {
    logger.debug('Updating event', { eventId: id, updates });
    if (!id?.trim()) {
      throw new CalendarValidationError('Event ID is required');
    }

    validateEventInput(updates);

    const { data, error } = await supabase
      .from("calendar_events")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        title: updates.title?.trim(),
        description: updates.description?.trim(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      logger.error('Failed to update event', { error, eventId: id, updates });
      throw new CalendarOperationError('Failed to update event', error);
    }

    logger.info('Successfully updated event', { eventId: id });
    return data as CalendarEvent;
  } catch (error) {
    if (error instanceof CalendarValidationError || error instanceof CalendarOperationError) {
      throw error;
    }
    logger.error('Unexpected error while updating event', { error, eventId: id, updates });
    throw new CalendarOperationError('Unexpected error while updating event', error);
  }
};

export const deleteEvent = async (id: string) => {
  try {
    logger.debug('Deleting event', { eventId: id });
    if (!id?.trim()) {
      throw new CalendarValidationError('Event ID is required');
    }

    const { error } = await supabase
      .from("calendar_events")
      .delete()
      .eq("id", id);

    if (error) {
      logger.error('Failed to delete event', { error, eventId: id });
      throw new CalendarOperationError('Failed to delete event', error);
    }

    logger.info('Successfully deleted event', { eventId: id });
    return true;
  } catch (error) {
    if (error instanceof CalendarValidationError || error instanceof CalendarOperationError) {
      throw error;
    }
    logger.error('Unexpected error while deleting event', { error, eventId: id });
    throw new CalendarOperationError('Unexpected error while deleting event', error);
  }
};
