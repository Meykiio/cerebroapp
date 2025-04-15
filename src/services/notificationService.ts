import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarEvent, CalendarValidationError } from "./calendarService";
import { Database } from "@/integrations/supabase/types";

export type Notification = Database['public']['Tables']['notifications']['Row'];

// Validation function for reminder events
const validateReminderEvent = (event: CalendarEvent) => {
  if (!event.is_reminder) {
    throw new CalendarValidationError('Event must be a reminder');
  }
  if (!event.start_date) {
    throw new CalendarValidationError('Reminder must have a start date');
  }
  return event;
};

// Fetch user's notifications
export const fetchNotifications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    toast.error("Failed to fetch notifications");
    return [];
  }
};

// Create a new notification
export const createNotification = async (notification: Omit<Notification, "id" | "created_at">) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert([notification])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating notification:", error);
    toast.error("Failed to create notification");
    return null;
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId)
      .eq("user_id", userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    toast.error("Failed to mark notification as read");
    return false;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    toast.error("Failed to mark all notifications as read");
    return false;
  }
};

// Delete a notification
export const deleteNotification = async (notificationId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId)
      .eq("user_id", userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting notification:", error);
    toast.error("Failed to delete notification");
    return false;
  }
};

// Function to check upcoming events and display reminders
export const checkReminders = async () => {
  try {
    // Get events in the next hour that are reminders
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    const { data: upcomingEvents, error } = await supabase
      .from("calendar_events")
      .select("*")
      .eq("is_reminder", true)
      .gte("start_date", now.toISOString())
      .lte("start_date", oneHourLater.toISOString());

    if (error) {
      console.error("Error checking reminders:", error);
      return;
    }

    // Show notifications for each upcoming reminder
    const validEvents = upcomingEvents?.filter((event): event is CalendarEvent => {
      try {
        validateReminderEvent(event as CalendarEvent);
        return true;
      } catch (e) {
        console.warn("Invalid reminder event:", e);
        return false;
      }
    });

    // Process each valid event
    await Promise.all(validEvents?.map(async (event) => {
      const eventTime = new Date(event.start_date);
      const minutesUntil = Math.round((eventTime.getTime() - now.getTime()) / 60000);
      
      // Show notification at exactly the event time or 1 minute before
      if (minutesUntil === 0 || minutesUntil === 1) {
        await showReminderNotification(event, minutesUntil);
      }
    }) || []);

    return validEvents;
  } catch (error) {
    console.error("Error in reminder check:", error);
    return [];
  }
};

// Function to display a reminder notification
export const showReminderNotification = async (event: CalendarEvent, minutesUntil: number) => {
  try {
    // Create notification in database
    const notification = await createNotification({
      title: `Reminder: ${event.title}`,
      description: `Coming up ${minutesUntil <= 0 ? 'now' : 'in 1 minute'}`,
      type: 'info',
      user_id: event.user_id,
      read: false
    });

    // Play notification sound
    const notificationSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    notificationSound.play().catch(e => console.log("Error playing sound:", e));
    
    // Show toast notification
    toast.info(`Reminder: ${event.title}`, {
      description: `Coming up ${minutesUntil <= 0 ? 'now' : 'in 1 minute'}`,
      duration: 10000,
    });
    
    // Try to show browser notification if permitted
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Reminder: " + event.title, {
        body: `Coming up ${minutesUntil <= 0 ? 'now' : 'in 1 minute'}`,
        icon: "/favicon.ico"
      });
    } else if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    return notification;
  } catch (error) {
    console.error("Error showing reminder notification:", error);
    return null;
  }
};

// Function to enable browser notifications
export const requestNotificationPermissions = () => {
  if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
  }
};

// Set up recurring check for reminders (every minute)
export const startReminderCheck = () => {
  // Initial check
  checkReminders();
  
  // Check every minute
  return setInterval(() => {
    checkReminders();
  }, 60000);
};
