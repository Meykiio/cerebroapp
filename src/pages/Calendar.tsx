
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

// Sample event data
const EVENTS = [
  {
    id: "1",
    title: "Team Meeting",
    date: new Date(2025, 3, 15, 10, 0),
    endDate: new Date(2025, 3, 15, 11, 30),
    type: "meeting",
    color: "bg-cerebro-purple"
  },
  {
    id: "2",
    title: "Client Call",
    date: new Date(2025, 3, 15, 14, 0),
    endDate: new Date(2025, 3, 15, 15, 0),
    type: "call",
    color: "bg-cerebro-cyan"
  },
  {
    id: "3",
    title: "Project Review",
    date: new Date(2025, 3, 16, 9, 0),
    endDate: new Date(2025, 3, 16, 10, 0),
    type: "meeting",
    color: "bg-cerebro-purple"
  },
  {
    id: "4",
    title: "Deadline: Marketing Campaign",
    date: new Date(2025, 3, 18, 18, 0),
    type: "deadline",
    color: "bg-red-500"
  },
];

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<string>("week");

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

  // Filter events for the selected date
  const filteredEvents = EVENTS.filter(event => {
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
            <Button className="bg-cerebro-purple hover:bg-cerebro-purple-dark">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </CardHeader>
          <CardContent>
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-cerebro-soft/50">
                <p>No events scheduled for this day</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start p-3 bg-gray-800/30 rounded-lg border-l-4 border-cerebro-purple"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-cerebro-soft/70">
                        {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {event.endDate && ` - ${event.endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                      </p>
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          event.type === 'meeting' ? 'bg-cerebro-purple/20 text-cerebro-purple' :
                          event.type === 'call' ? 'bg-cerebro-cyan/20 text-cerebro-cyan' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
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
