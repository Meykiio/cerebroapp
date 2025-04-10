
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardList, Plus } from "lucide-react";
import WidgetWrapper from "./WidgetWrapper";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: Date;
}

const TasksWidget = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Prepare investor presentation", completed: false, priority: "high" },
    { id: "2", title: "Review marketing analytics", completed: false, priority: "medium" },
    { id: "3", title: "Schedule team meeting", completed: true, priority: "low" },
    { id: "4", title: "Update financial projections", completed: false, priority: "high" },
  ]);
  
  const [newTask, setNewTask] = useState("");
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
      priority: "medium",
    };
    
    setTasks([...tasks, task]);
    setNewTask("");
  };
  
  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 border-green-500/30";
      default:
        return "bg-gray-500/20 border-gray-500/30";
    }
  };

  return (
    <WidgetWrapper title="Tasks" icon={<ClipboardList className="h-5 w-5 text-cerebro-purple" />}>
      <div className="space-y-3">
        {/* Task list */}
        <div className="space-y-2 max-h-[250px] overflow-y-auto scrollbar-hidden">
          {tasks.filter(task => !task.completed).slice(0, 4).map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-2 p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTaskCompletion(task.id)}
              />
              <span className={task.completed ? "line-through text-cerebro-soft/50" : ""}>
                {task.title}
              </span>
              <div className={`ml-auto px-2 py-0.5 text-xs rounded border ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </div>
            </div>
          ))}
        </div>
        
        {/* Quick add task */}
        <form onSubmit={handleAddTask} className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="bg-gray-800/50 border-white/10"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newTask.trim()}
            className="bg-cerebro-purple hover:bg-cerebro-purple-dark"
          >
            <Plus size={16} />
          </Button>
        </form>
        
        <Link to="/tasks">
          <Button 
            variant="ghost" 
            className="w-full mt-2 text-cerebro-soft hover:text-white hover:bg-white/10"
          >
            View All Tasks
          </Button>
        </Link>
      </div>
    </WidgetWrapper>
  );
};

export default TasksWidget;
