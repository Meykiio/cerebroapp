import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getTasks, createTask, updateTask, deleteTask, Task } from "@/services/tasksService";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, MoreHorizontal, Plus, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Tasks = () => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskTags, setNewTaskTags] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  // Task queries
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });
  
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Task created successfully");
      setNewTaskTitle("");
    },
    onError: (error) => {
      toast.error(`Failed to create task: ${error.message}`);
    }
  });
  
  const updateTaskMutation = useMutation({
    mutationFn: (params: { id: string, updates: Partial<Task> }) => 
      updateTask(params.id, params.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Task updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update task: ${error.message}`);
    }
  });
  
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Task deleted");
    },
    onError: (error) => {
      toast.error(`Failed to delete task: ${error.message}`);
    }
  });
  
  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !user) return;
    
    setIsAddingTask(true);
    
    try {
      await createTask({
        title: newTaskTitle,
        completed: false,
        priority: newTaskPriority as string,
        tags: newTaskTags?.split(",").map(tag => tag.trim()).filter(tag => tag !== "") || [],
        user_id: user.id,
        updated_at: new Date().toISOString()
      });
      
      setNewTaskTitle("");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task added successfully");
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task");
    } finally {
      setIsAddingTask(false);
    }
  };
  
  const handleToggleComplete = (task: Task) => {
    updateTaskMutation.mutate({
      id: task.id, 
      updates: { completed: !task.completed }
    });
  };
  
  const handleDeleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500';
      case 'low': return 'bg-green-500/20 text-green-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-cerebro-soft">Tasks</h1>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="flex gap-2">
        <Input
          placeholder="Add a new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="bg-gray-800/50 border-white/10"
        />
        <Button 
          type="submit" 
          disabled={!newTaskTitle.trim() || createTaskMutation.isPending}
          className="bg-cerebro-purple hover:bg-cerebro-purple-dark"
        >
          {createTaskMutation.isPending ? 
            <span className="animate-spin mr-2">⟳</span> : 
            <Plus className="mr-2 h-4 w-4" />
          }
          Add
        </Button>
      </form>

      {/* Tasks List */}
      <Card className="border-white/10 bg-gray-900/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">My Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin text-cerebro-purple">⟳</div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 text-cerebro-soft/50">
              No tasks yet. Add your first task above.
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`flex items-center justify-between p-3 rounded-md ${
                    task.completed ? 'bg-white/5' : 'bg-white/10'
                  } hover:bg-white/15 transition-colors`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox 
                      checked={task.completed}
                      onCheckedChange={() => handleToggleComplete(task)}
                    />
                    <div className="flex-1">
                      <p className={`${task.completed ? 'line-through text-cerebro-soft/50' : 'text-cerebro-soft'}`}>
                        {task.title}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        
                        {task.due_date && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 flex items-center gap-1">
                            <CalendarIcon size={10} />
                            {format(new Date(task.due_date), "MMM d")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-800 border-white/10">
                      <DropdownMenuItem 
                        className="text-red-400 focus:text-red-400 focus:bg-red-950/30"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash size={14} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Tasks;
