import { useState, useEffect } from 'react';
import { Bot, ArrowLeft, Gift, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCard, Task } from '@/components/TaskCard';
import { ChatInterface } from '@/components/ChatInterface';
import { useAppContext } from '@/context/AppContext';
import { initChat, getTasks, respondToOffer } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Chat = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<{
    task_id: number;
    offer_message: string;
    connection_id: number;
  } | null>(null);
  const [isResponding, setIsResponding] = useState(false);
  const {
    selectedTask,
    loading,
    showChat,
    animationPhase,
    userId,
    setSelectedTask,
    setUserGraph,
    setUserName,  // Add this line
    setLoading,
    setShowChat,
    setAnimationPhase,
    resetState,
  } = useAppContext();

  useEffect(() => {
    const loadTasks = async () => {
      const taskData = await getTasks();
      setTasks(taskData);
    };
    loadTasks();

    // Check for current offer with delay
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.current_offer) {
      setCurrentOffer(userData.current_offer);
      // Show dialog with delay
      setTimeout(() => {
        setShowOfferDialog(true);
      }, 1000);
    }
  }, []);

  const handleTaskSelect = async (task: Task) => {
    setSelectedTask(task);
    setLoading(true);
    setAnimationPhase('loading');

    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      // Initialize chat session and get persona graph from response
      const chatData = await initChat(userData.username, parseInt(task.id));
      localStorage.setItem('chatSession', JSON.stringify(chatData));
      
      // Extract persona graph from API response
    setUserGraph(chatData.user.persona_graph);
    setUserName(chatData.user.full_name);  // Add this line
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    }

    setAnimationPhase('transitioning');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setAnimationPhase('chat');
    setShowChat(true);
    setLoading(false);
  };

  const handleOfferResponse = async (status: 'accepted' | 'declined') => {
    if (!currentOffer) return;
    
    setIsResponding(true);
    try {
      await respondToOffer(currentOffer.connection_id, status);
      
      // Remove offer from userData
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      delete userData.current_offer;
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setShowOfferDialog(false);
      setCurrentOffer(null);
    } catch (error) {
      console.error('Failed to respond to offer:', error);
    } finally {
      setIsResponding(false);
    }
  };

  const handleBack = () => {
    resetState();
    navigate('/');
  };

  if (showChat && selectedTask) {
    return <ChatInterface onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col items-center justify-center p-6">
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="hover:bg-muted"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </Button>
      </div>
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

      {/* Offer Dialog */}
      <Dialog 
        open={showOfferDialog} 
        onOpenChange={(open) => {
          // Prevent closing by clicking outside
          if (!open && showOfferDialog) return;
          setShowOfferDialog(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          {/* Close button */}
          <button 
            onClick={() => setShowOfferDialog(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
          </button>
          
          <DialogHeader className="text-center">
            <DialogTitle>You have a new offer!</DialogTitle>
          </DialogHeader>
          
          {/* Icon at top center */}
          <div className="flex justify-center my-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Gift className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <DialogDescription className="text-center">
            {currentOffer?.offer_message}
          </DialogDescription>
          <div className="flex justify-end gap-2 mt-6">
            <Button 
              variant="outline" 
              onClick={() => handleOfferResponse('declined')}
              disabled={isResponding}
            >
              Decline
            </Button>
            <Button 
              onClick={() => handleOfferResponse('accepted')}
              disabled={isResponding}
            >
              {isResponding ? 'Responding...' : 'Accept'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;