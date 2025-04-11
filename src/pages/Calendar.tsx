
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Bell, Clock, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEvents, createEvent, deleteEvent } from "@/services/calendarService";

const CalendarPage = () => {
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<string>("week");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [newEvent, setNewEvent] = useState<{
    title: string;
    date: Date;
    endDate: Date;
    type: "meeting" | "call" | "deadline" | "reminder";
    description: string;
    isReminder: boolean;
  }>({
    title: "",
    date: new Date(),
    endDate: new Date(),
    type: "meeting",
    description: "",
    isReminder: false
  });

  // Fetch events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success("Event added successfully!");
      setIsDialogOpen(false);
      // Reset form
      setNewEvent({
        title: "",
        date: new Date(),
        endDate: new Date(),
        type: "meeting",
        description: "",
        isReminder: false
      });
    },
    onError: (error) => {
      toast.error(`Failed to add event: ${error.message}`);
    }
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success("Event deleted successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to delete event: ${error.message}`);
    }
  });

  const currentMonthYear = date ? date.toLocaleString('default', { month: 'long', year: 'numeric' }) : '';
  
  const goToToday = () => {
    setDate(new Date());
  };

  const goToPrevious = () => {
    if (date) {
      const newDate = new Date(date);
      if (view === "day") {
        newDate.setDate(newDate.getDate() - 1);
      } else if (view === "week") {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setMonth(newDate.getMonth() - 1);
      }
      setDate(newDate);
    }
  };

  const goToNext = () => {
    if (date) {
      const newDate = new Date(date);
      if (view === "day") {
        newDate.setDate(newDate.getDate() + 1);
      } else if (view === "week") {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      setDate(newDate);
    }
  };

  // Handle input changes for new event
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  // Handle switch change for reminder
  const handleReminderChange = (checked: boolean) => {
    setNewEvent(prev => ({ ...prev, isReminder: checked }));
  };

  // Handle event type change
  const handleTypeChange = (value: "meeting" | "call" | "deadline" | "reminder") => {
    setNewEvent(prev => ({ ...prev, type: value }));
  };

  // Handle event date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newDate = new Date(value);
    setNewEvent(prev => ({ ...prev, [name]: newDate }));
  };

  // Add new event
  const handleAddEvent = () => {
    const eventColor = 
      newEvent.type === "meeting" ? "bg-cerebro-purple" :
      newEvent.type === "call" ? "bg-cerebro-cyan" :
      newEvent.type === "deadline" ? "bg-red-500" :
      "bg-yellow-500";

    createEventMutation.mutate({
      title: newEvent.title,
      start_date: newEvent.date.toISOString(),
      end_date: newEvent.isReminder ? undefined : newEvent.endDate.toISOString(),
      type: newEvent.type,
      color: eventColor,
      is_reminder: newEvent.isReminder,
      description: newEvent.description
    });
  };

  // Delete event
  const handleDeleteEvent = (id: string) => {
    deleteEventMutation.mutate(id);
  };

  // Convert Supabase events to UI format
  const uiEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    date: new Date(event.start_date),
    endDate: event.end_date ? new Date(event.end_date) : undefined,
    type: event.type,
    color: event.color,
    description: event.description,
    isReminder: event.is_reminder
  }));

  // Filter events for the selected date
  const filteredEvents = uiEvents.filter(event => {
    if (!date) return false;
    return event.date.toDateString() === date.toDateString();
  }).sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-cerebro-soft">Calendar</h1>
          <p className="text-cerebro-soft/70">Schedule and manage your time effectively</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={view} onValueChange={setView}>
            <SelectTrigger className="w-[120px] bg-gray-800/50 border-white/10">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/10">
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={goToToday} className="border-white/10">
            Today
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1 bg-gray-900/60 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-lg font-semibold">Date Picker</h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-2">
                <Button variant="ghost" size="icon" onClick={goToPrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="font-medium">{currentMonthYear}</h3>
                <Button variant="ghost" size="icon" onClick={goToNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
          </CardContent>
        </Card>

        {/* Events for selected date */}
        <Card className="lg:col-span-2 bg-gray-900/60 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-lg font-semibold">
              Events for {date?.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-cerebro-purple hover:bg-cerebro-purple-dark">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 text-white border-white/10 sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription className="text-cerebro-soft/70">
                    Create a new event or reminder for your calendar
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title"
                      name="title"
                      placeholder="Enter event title"
                      className="bg-gray-800/50 border-white/10"
                      value={newEvent.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="type">Event Type</Label>
                      <Select 
                        defaultValue={newEvent.type} 
                        onValueChange={(value: string) => handleTypeChange(value as "meeting" | "call" | "deadline" | "reminder")}
                      >
                        <SelectTrigger className="bg-gray-800/50 border-white/10">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-white/10">
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="call">Call</SelectItem>
                          <SelectItem value="deadline">Deadline</SelectItem>
                          <SelectItem value="reminder">Reminder</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 flex items-center">
                      <div className="flex items-center space-x-2 mt-5">
                        <Switch 
                          id="isReminder" 
                          checked={newEvent.isReminder} 
                          onCheckedChange={handleReminderChange}
                        />
                        <Label htmlFor="isReminder" className="flex items-center gap-1">
                          <Bell className="h-4 w-4" />
                          Reminder only
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Date & Time</Label>
                    <Input
                      id="date"
                      name="date"
                      type="datetime-local"
                      className="bg-gray-800/50 border-white/10"
                      onChange={handleDateChange}
                    />
                  </div>
                  
                  {!newEvent.isReminder && (
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date & Time</Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="datetime-local"
                        className="bg-gray-800/50 border-white/10"
                        onChange={handleDateChange}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Add details about this event..."
                      className="bg-gray-800/50 border-white/10 min-h-[80px]"
                      value={newEvent.description}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-white/10">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddEvent} 
                    className="bg-cerebro-purple hover:bg-cerebro-purple-dark"
                    disabled={!newEvent.title || createEventMutation.isPending}
                  >
                    {createEventMutation.isPending ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </span>
                    ) : (
                      "Add Event"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start p-3 bg-gray-800/30 rounded-lg border-l-4 border-gray-700 animate-pulse">
                    <div className="flex-1">
                      <div className="h-5 w-3/4 bg-white/10 rounded mb-2"></div>
                      <div className="h-4 w-1/3 bg-white/5 rounded mb-2"></div>
                      <div className="h-3 w-1/4 bg-white/5 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-cerebro-soft/50">
                <p>No events scheduled for this day</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`flex items-start p-3 bg-gray-800/30 rounded-lg border-l-4 ${
                      event.isReminder ? "border-yellow-500" : event.color
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-medium">{event.title}</p>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteEvent(event.id)} 
                          className="h-6 w-6 text-cerebro-soft/70 hover:text-red-400 hover:bg-transparent"
                          disabled={deleteEventMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-cerebro-soft/70">
                        {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {event.endDate && !event.isReminder && ` - ${event.endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                      </p>
                      {event.description && (
                        <p className="text-sm text-cerebro-soft/70 mt-1">{event.description}</p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          event.type === 'meeting' ? 'bg-cerebro-purple/20 text-cerebro-purple' :
                          event.type === 'call' ? 'bg-cerebro-cyan/20 text-cerebro-cyan' :
                          event.type === 'deadline' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                        {event.isReminder && (
                          <span className="flex items-center text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-full">
                            <Bell className="h-3 w-3 mr-1" />
                            Reminder
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;
