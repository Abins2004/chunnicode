import React, { useState } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { AccessibleButton } from '../ui/AccessibleButton';
import { AccessibleCard } from '../ui/AccessibleCard';
import { Calendar, Clock, CheckCircle, Circle, Volume2 } from 'lucide-react';

interface Task {
  id: string;
  description: string;
  time: string;
  icon: string;
  completed: boolean;
}

const mockTasks: Task[] = [
  { id: '1', description: 'Take morning medication', time: '9:00 AM', icon: '💊', completed: false },
  { id: '2', description: 'Eat breakfast', time: '9:30 AM', icon: '🍳', completed: false },
  { id: '3', description: 'Brush teeth', time: '10:00 AM', icon: '🦷', completed: false },
  { id: '4', description: 'Exercise for 15 minutes', time: '2:00 PM', icon: '🏃', completed: false },
];

export function CognitiveInterface() {
  const [tasks, setTasks] = useState(mockTasks);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const { speak } = useAccessibility();

  const currentTask = tasks[currentTaskIndex];

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    speak(`Task ${currentTask.completed ? 'unmarked' : 'completed'}`);
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
    speak(`Current task: ${currentTask.description} at ${currentTask.time}`);
  };

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
      </AccessibleCard>
    </div>
  );
}