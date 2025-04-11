
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarEvent } from "./calendarService";

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
    upcomingEvents?.forEach((event: CalendarEvent) => {
      const eventTime = new Date(event.start_date);
      const minutesUntil = Math.round((eventTime.getTime() - now.getTime()) / 60000);
      
      showReminderNotification(event, minutesUntil);
    });

    return upcomingEvents;
  } catch (error) {
    console.error("Error in reminder check:", error);
    return [];
  }
};

// Function to display a reminder notification
export const showReminderNotification = (event: CalendarEvent, minutesUntil: number) => {
  // Play notification sound
  const notificationSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
  notificationSound.play().catch(e => console.log("Error playing sound:", e));
  
  // Show toast notification
  toast.info(`Reminder: ${event.title}`, {
    description: `Coming up ${minutesUntil <= 0 ? 'now' : `in ${minutesUntil} minute${minutesUntil !== 1 ? 's' : ''}`}`,
    duration: 10000,
  });
  
  // Try to show browser notification if permitted
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Reminder: " + event.title, {
      body: `Coming up ${minutesUntil <= 0 ? 'now' : `in ${minutesUntil} minute${minutesUntil !== 1 ? 's' : ''}`}`,
      icon: "/favicon.ico"
    });
  } else if ("Notification" in window && Notification.permission !== "denied") {
    Notification.requestPermission();
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
