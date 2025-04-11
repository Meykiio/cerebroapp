import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getTasks, createTask, updateTask, deleteTask, Task } from "@/services/tasksService";
import { useAuth } from "@/contexts/AuthContext";

const Tasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  
  // Task queries
  const { data: tasks = [] } = useQuery({
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
    mutationFn: updateTask,
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
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !user) return;
    
    createTaskMutation.mutate({
      title: newTaskTitle,
      completed: false,
      priority: "medium",
      tags: [],
      user_id: user.id // Add the user_id here
    });
  };
  
  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    updateTaskMutation.mutate({ id, ...updates });
  };
  
  const handleDeleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };
  
  return (
    <div>
      {/* Task list component */}
    </div>
  );
};

export default Tasks;
