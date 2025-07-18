import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface TaskCardProps {
  task: Task;
  onSelect: (task: Task) => void;
  loading: boolean;
}

// Synthetic function to simulate loading tasks
export const getTasks = async (): Promise<Task[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: 'content',
      title: 'Content Consumption',
      description: 'Get personalized recommendations for articles, videos, and learning resources tailored to your interests.',
      icon: '📚'
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle Optimization',
      description: 'Receive guidance on health, fitness, productivity, and daily routines to enhance your well-being.',
      icon: '🎯'
    },
    {
      id: 'career',
      title: 'Career Development',
      description: 'Access career advice, skill development plans, and professional growth strategies.',
      icon: '🚀'
    }
  ];
};

export const TaskCard = ({ task, onSelect, loading }: TaskCardProps) => {
  const handleClick = () => {
    if (!loading) {
      onSelect(task);
    }
  };

  return (
    <Card 
      className="relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-glow border-muted bg-card/50 backdrop-blur-sm"
      onClick={handleClick}
    >
      <CardHeader className="text-center pb-4">
        <div className="text-4xl mb-2">{task.icon}</div>
        <CardTitle className="text-xl font-semibold text-foreground">
          {task.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <CardDescription className="text-muted-foreground leading-relaxed">
          {task.description}
        </CardDescription>
        {loading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};