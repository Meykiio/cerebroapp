
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import WidgetWrapper from "./WidgetWrapper";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "meeting" | "task" | "reminder";
}

const CalendarWidget = () => {
  const today = new Date();
  const [events] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Team Standup",
      start: new Date(today.setHours(9, 30)),
      end: new Date(today.setHours(10, 0)),
      type: "meeting",
    },
    {
      id: "2",
      title: "Client Call - XYZ Corp",
      start: new Date(today.setHours(11, 0)),
      end: new Date(today.setHours(12, 0)),
      type: "meeting",
    },
    {
      id: "3",
      title: "Lunch Break",
      start: new Date(today.setHours(12, 0)),
      end: new Date(today.setHours(13, 0)),
      type: "reminder",
    },
    {
      id: "4",
      title: "Complete Project Proposal",
      start: new Date(today.setHours(14, 0)),
      end: new Date(today.setHours(16, 0)),
      type: "task",
    },
  ]);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getEventTypeStyles = (type: string) => {
    switch (type) {
      case "meeting":
        return "border-l-4 border-cerebro-cyan";
      case "task":
        return "border-l-4 border-cerebro-purple";
      case "reminder":
        return "border-l-4 border-yellow-500";
      default:
        return "border-l-4 border-gray-400";
    }
  };

  return (
    <WidgetWrapper title="Today's Calendar" icon={<Calendar className="h-5 w-5 text-cerebro-cyan" />}>
      <div className="space-y-2 max-h-[250px] overflow-y-auto scrollbar-hidden">
        {events.map((event) => (
          <div
            key={event.id}
            className={`flex flex-col p-3 rounded-md bg-white/5 hover:bg-white/10 transition-colors ${getEventTypeStyles(event.type)}`}
          >
            <div className="font-semibold">{event.title}</div>
            <div className="flex items-center gap-1 text-sm text-cerebro-soft/70">
              <Clock size={14} />
              <span>
                {formatTime(event.start)} - {formatTime(event.end)}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <Link to="/calendar">
        <Button 
          variant="ghost" 
          className="w-full mt-4 text-cerebro-soft hover:text-white hover:bg-white/10"
        >
          View Full Calendar
        </Button>
      </Link>
    </WidgetWrapper>
  );
};

export default CalendarWidget;
