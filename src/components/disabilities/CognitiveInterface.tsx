import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { AccessibleButton } from '../ui/AccessibleButton';
import { AccessibleCard } from '../ui/AccessibleCard';
import { Calendar, Clock, CheckCircle, Circle, Volume2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Task } from '../../types';

export function CognitiveInterface() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { speak } = useAccessibility();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .order('time', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      speak('Error loading tasks');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ));
      speak(`Task ${task.completed ? 'unmarked' : 'completed'}`);
    } catch (error) {
      console.error('Error updating task:', error);
      speak('Error updating task');
    }
  };

  const nextTask = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(prev => prev + 1);
      speak(`Next task: ${tasks[currentTaskIndex + 1].description}`);
    }
  };

  const prevTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(prev => prev - 1);
      speak(`Previous task: ${tasks[currentTaskIndex - 1].description}`);
    }
  };

  const speakTask = () => {
    const currentTask = tasks[currentTaskIndex];
    if (currentTask) {
      speak(`Current task: ${currentTask.description} at ${currentTask.time}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-xl text-gray-600">Loading your tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-8xl mb-4">📝</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">No tasks for today</h2>
        <p className="text-xl text-gray-600">Your schedule is clear!</p>
      </div>
    );
  }

  const currentTask = tasks[currentTaskIndex];

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Today's Schedule</h1>
        <p className="text-xl text-gray-600">One task at a time</p>
      </header>

      {/* Current Task Focus */}
      <AccessibleCard className="p-8 text-center">
        <div className="mb-6">
          <div className="text-8xl mb-4">{currentTask.icon}</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentTask.description}</h2>
          <div className="flex items-center justify-center gap-2 text-xl text-gray-600">
            <Clock size={24} />
            <span>{currentTask.time}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <AccessibleButton
            onClick={speakTask}
            variant="secondary"
            size="lg"
            icon={<Volume2 size={24} />}
            speakText="Reading task aloud"
          >
            Read Aloud
          </AccessibleButton>

          <AccessibleButton
            onClick={() => toggleTask(currentTask.id)}
            variant={currentTask.completed ? "secondary" : "primary"}
            size="lg"
            icon={currentTask.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
            speakText={currentTask.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {currentTask.completed ? 'Completed!' : 'Mark Done'}
          </AccessibleButton>
        </div>

        <div className="flex justify-center gap-4">
          <AccessibleButton
            onClick={prevTask}
            disabled={currentTaskIndex === 0}
            variant="secondary"
            size="lg"
            speakText="Previous task"
          >
            ← Previous
          </AccessibleButton>

          <AccessibleButton
            onClick={nextTask}
            disabled={currentTaskIndex === tasks.length - 1}
            variant="secondary"
            size="lg"
            speakText="Next task"
          >
            Next →
          </AccessibleButton>
        </div>
      </AccessibleCard>

      {/* Progress Indicator */}
      <AccessibleCard className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-center">Today's Progress</h3>
        <div className="flex justify-center gap-2">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={`w-4 h-4 rounded-full ${
                task.completed ? 'bg-green-500' : 
                index === currentTaskIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              aria-label={`Task ${index + 1}: ${task.completed ? 'completed' : index === currentTaskIndex ? 'current' : 'pending'}`}
            />
          ))}
        </div>
        <div className="text-center mt-4 text-gray-600">
          {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
        </div>
      </AccessibleCard>
    </div>
  );
}