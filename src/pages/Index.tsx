import { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { TaskCard, Task, getTasks } from '@/components/TaskCard';
import { ChatInterface } from '@/components/ChatInterface';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'initial' | 'loading' | 'transitioning' | 'chat'>('initial');

  useEffect(() => {
    const loadTasks = async () => {
      const taskData = await getTasks();
      setTasks(taskData);
    };
    loadTasks();
  }, []);

  const handleTaskSelect = async (task: Task) => {
    setSelectedTask(task);
    setLoading(true);
    setAnimationPhase('loading');

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    setAnimationPhase('transitioning');
    
    // Start animations
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setAnimationPhase('chat');
    setShowChat(true);
    setLoading(false);
  };

  const handleBack = () => {
    setShowChat(false);
    setSelectedTask(null);
    setAnimationPhase('initial');
    setLoading(false);
  };

  if (showChat && selectedTask) {
    return <ChatInterface selectedTask={selectedTask} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col items-center justify-center p-6">
      {/* Logo - Fades out during transition */}
      <div className={`mb-8 ${animationPhase === 'transitioning' ? 'animate-fade-out' : 'animate-slide-up'}`}>
        <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center shadow-glow animate-glow">
          <Bot size={48} className="text-primary-foreground" />
        </div>
      </div>

      {/* PersoAgent Title - Animates to top-left during transition */}
      <h1 
        className={`font-bold text-foreground mb-12 transition-all duration-800 ease-out ${
          animationPhase === 'transitioning' 
            ? 'fixed animate-shrink-move z-50' 
            : 'text-5xl relative'
        }`}
      >
        PersoAgent
      </h1>

      {/* Main content - Hidden during transition */}
      <div className={`w-full max-w-4xl ${animationPhase === 'transitioning' ? 'opacity-0' : 'animate-slide-up'}`}>
        <h2 className="text-2xl text-center text-muted-foreground mb-12">
          How can I help you today?
        </h2>

        {/* Task Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {tasks.map((task, index) => (
            <div 
              key={task.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TaskCard
                task={task}
                onSelect={handleTaskSelect}
                loading={loading && selectedTask?.id === task.id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
