
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, ListTodo } from "lucide-react";
import WidgetWrapper from "./WidgetWrapper";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/tasksService";

const TasksWidget = () => {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks-widget'],
    queryFn: () => getTasks().then(data => data.slice(0, 5)), // Only get top 5 tasks
  });

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;

  return (
    <WidgetWrapper title="Tasks" icon={<ListTodo className="h-5 w-5 text-cerebro-purple" />}>
      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-white/10"></div>
              <div className="h-4 flex-1 rounded bg-white/10"></div>
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-5 text-cerebro-soft/70">
          <ListTodo className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No tasks yet</p>
          <Link to="/tasks">
            <Button 
              variant="ghost" 
              size="sm"
              className="mt-2 text-cerebro-soft hover:text-white hover:bg-white/10"
            >
              Add your first task
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-3">
            {activeTasks.slice(0, 3).map(task => (
              <div key={task.id} className="flex items-center gap-2">
                <Circle className="h-4 w-4 text-cerebro-soft/60" />
                <span className="text-sm">{task.title}</span>
              </div>
            ))}
            {activeTasks.length === 0 && (
              <div className="text-sm text-cerebro-soft/70 text-center py-1">
                All tasks completed!
              </div>
            )}
          </div>
          
          <div className="text-xs text-cerebro-soft/70 mb-1 flex justify-between">
            <span>Progress</span>
            <span>{completionRate}% complete</span>
          </div>
          
          <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-cerebro-purple rounded-full" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          
          <div className="text-xs text-cerebro-soft/70 mb-2">
            Recently completed:
          </div>
          
          <div className="space-y-2 mb-3">
            {completedTasks.slice(0, 2).map(task => (
              <div key={task.id} className="flex items-center gap-2 opacity-70">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm line-through">{task.title}</span>
              </div>
            ))}
            {completedTasks.length === 0 && (
              <div className="text-sm text-cerebro-soft/70 text-center py-1">
                No completed tasks yet
              </div>
            )}
          </div>
          
          <Link to="/tasks">
            <Button 
              variant="ghost" 
              className="w-full mt-2 text-cerebro-soft hover:text-white hover:bg-white/10"
            >
              View All Tasks
            </Button>
          </Link>
        </>
      )}
    </WidgetWrapper>
  );
};

export default TasksWidget;
