
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import WidgetWrapper from "./WidgetWrapper";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/services/calendarService";

const CalendarWidget = () => {
  const today = new Date();
  
  // Format today's date
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Fetch upcoming events
  const { data: allEvents = [], isLoading } = useQuery({
    queryKey: ['events-widget'],
    queryFn: getEvents
  });
  
  // Filter and sort upcoming events
  const upcomingEvents = allEvents
    .filter(event => new Date(event.start_date) >= today)
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .slice(0, 3);

  return (
    <WidgetWrapper title="Calendar" icon={<CalendarIcon className="h-5 w-5 text-cerebro-cyan" />}>
      <div className="mb-3 bg-gray-800/50 rounded-lg p-3 text-center">
        <div className="text-sm text-cerebro-soft/70">Today</div>
        <div className="text-xl font-semibold mt-1">{formattedDate}</div>
      </div>
      
      <div className="text-sm font-medium mb-2">Upcoming Events</div>
      
      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-2 rounded-md bg-white/5">
              <div className="h-4 w-3/4 bg-white/10 rounded mb-2"></div>
              <div className="h-3 w-1/2 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      ) : upcomingEvents.length === 0 ? (
        <div className="text-center py-3 text-cerebro-soft/70">
          <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No upcoming events</p>
          <Link to="/calendar">
            <Button 
              variant="ghost" 
              size="sm"
              className="mt-2 text-cerebro-soft hover:text-white hover:bg-white/10"
            >
              Add your first event
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2 mb-3">
          {upcomingEvents.map((event) => {
            const eventDate = new Date(event.start_date);
            const isToday = eventDate.toDateString() === today.toDateString();
            
            let borderColor;
            switch (event.type) {
              case "meeting": borderColor = "border-cerebro-purple"; break;
              case "call": borderColor = "border-cerebro-cyan"; break;
              case "deadline": borderColor = "border-red-500"; break;
              default: borderColor = "border-yellow-500";
            }
            
            return (
              <div 
                key={event.id}
                className={`p-2 rounded-md bg-gray-800/30 border-l-2 ${borderColor}`}
              >
                <div className="font-medium text-sm">{event.title}</div>
                <div className="text-xs text-cerebro-soft/70 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {isToday ? "Today, " : eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", "}
                  {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <Link to="/calendar">
        <Button 
          variant="ghost" 
          className="w-full mt-2 text-cerebro-soft hover:text-white hover:bg-white/10"
        >
          View Calendar
        </Button>
      </Link>
    </WidgetWrapper>
  );
};

export default CalendarWidget;
