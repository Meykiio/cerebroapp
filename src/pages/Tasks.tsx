
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Calendar, CheckCircle2, Circle, Clock, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, updateTask, deleteTask } from "@/services/tasksService";

const Tasks = () => {
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState("");

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Task added successfully");
      setNewTask("");
    },
    onError: (error) => {
      toast.error(`Failed to add task: ${error.message}`);
    }
  });

  // Toggle task completion mutation
  const toggleCompleteMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string, completed: boolean }) => 
      updateTask(id, { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      toast.error(`Failed to update task: ${error.message}`);
    }
  });

  // Delete task mutation
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

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    createTaskMutation.mutate({
      title: newTask,
      completed: false,
      priority: "medium",
      tags: []
    });
  };

  const handleToggleComplete = (id: string, currentStatus: boolean) => {
    toggleCompleteMutation.mutate({ id, completed: !currentStatus });
  };

  const handleDeleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  // Filter tasks
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-cerebro-soft">Tasks</h1>
          <p className="text-cerebro-soft/70">Manage your tasks effectively</p>
        </div>
      </div>

      {/* Add Task Form */}
      <Card className="bg-gray-900/60 border-white/10">
        <CardContent className="pt-6">
          <form onSubmit={handleAddTask} className="flex gap-2">
            <Input
              className="bg-gray-800/50 border-white/10"
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <Button 
              type="submit" 
              className="bg-cerebro-purple hover:bg-cerebro-purple-dark"
              disabled={createTaskMutation.isPending || !newTask.trim()}
            >
              {createTaskMutation.isPending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Task Lists */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="bg-gray-800/50 border-white/10">
          <TabsTrigger value="active" className="data-[state=active]:bg-cerebro-purple">
            Active ({activeTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-cerebro-purple">
            Completed ({completedTasks.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4">
          <Card className="bg-gray-900/60 border-white/10">
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold">Active Tasks</h3>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start justify-between p-3 bg-gray-800/30 rounded-lg animate-pulse">
                      <div className="flex items-start gap-3 w-full">
                        <div className="mt-1 h-5 w-5 rounded-full bg-white/10"></div>
                        <div className="w-full">
                          <div className="h-4 w-3/4 bg-white/10 rounded mb-3"></div>
                          <div className="flex gap-2">
                            <div className="h-6 w-20 bg-white/5 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : activeTasks.length === 0 ? (
                <p className="text-center text-cerebro-soft/50 py-8">No active tasks</p>
              ) : (
                <div className="space-y-4">
                  {activeTasks.map((task) => (
                    <div key={task.id} className="flex items-start justify-between p-3 bg-gray-800/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleComplete(task.id, task.completed)}
                          className="mt-1 text-cerebro-soft/70 hover:text-cerebro-purple"
                          disabled={toggleCompleteMutation.isPending}
                        >
                          <Circle className="h-5 w-5" />
                        </button>
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {task.due_date && (
                              <span className="flex items-center text-xs bg-cerebro-purple/20 text-cerebro-purple-light px-2 py-1 rounded">
                                <Calendar className="mr-1 h-3 w-3" />
                                {new Date(task.due_date).toLocaleDateString()}
                              </span>
                            )}
                            <span className={`flex items-center text-xs px-2 py-1 rounded ${
                              task.priority === "high" 
                                ? "bg-red-500/20 text-red-400" 
                                : task.priority === "medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-green-500/20 text-green-400"
                            }`}>
                              <Clock className="mr-1 h-3 w-3" />
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </span>
                            {task.tags.map((tag) => (
                              <span key={tag} className="flex items-center text-xs bg-cerebro-cyan/10 text-cerebro-cyan px-2 py-1 rounded">
                                <Tag className="mr-1 h-3 w-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-cerebro-soft/50 hover:text-red-400"
                        disabled={deleteTaskMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          <Card className="bg-gray-900/60 border-white/10">
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold">Completed Tasks</h3>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-start justify-between p-3 bg-gray-800/30 rounded-lg animate-pulse">
                      <div className="flex items-start gap-3 w-full">
                        <div className="mt-1 h-5 w-5 rounded-full bg-white/10"></div>
                        <div className="h-4 w-3/4 bg-white/10 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : completedTasks.length === 0 ? (
                <p className="text-center text-cerebro-soft/50 py-8">No completed tasks</p>
              ) : (
                <div className="space-y-4">
                  {completedTasks.map((task) => (
                    <div key={task.id} className="flex items-start justify-between p-3 bg-gray-800/30 rounded-lg opacity-70">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleComplete(task.id, task.completed)}
                          className="mt-1 text-cerebro-purple"
                          disabled={toggleCompleteMutation.isPending}
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </button>
                        <div>
                          <p className="font-medium line-through">{task.title}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {task.due_date && (
                              <span className="flex items-center text-xs bg-cerebro-purple/10 text-cerebro-purple/70 px-2 py-1 rounded">
                                <Calendar className="mr-1 h-3 w-3" />
                                {new Date(task.due_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-cerebro-soft/50 hover:text-red-400"
                        disabled={deleteTaskMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tasks;
