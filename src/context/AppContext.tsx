import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task } from '@/components/TaskCard';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  reason?: string;
  usedTool?: string;
}

interface GraphNode {
  id: string;
  label: string;
  type: string;
}

interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

interface UserGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

interface AppState {
  userId: string;
  userName: string;
  selectedTask: Task | null;
  userGraph: UserGraph | null;
  chatMessages: Message[];
  loading: boolean;
  showChat: boolean;
  animationPhase: 'initial' | 'loading' | 'transitioning' | 'chat';
}

interface AppContextType extends AppState {
  setSelectedTask: (task: Task | null) => void;
  setUserGraph: (graph: UserGraph | null) => void;
  setChatMessages: (messages: Message[]) => void;
  addChatMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setShowChat: (show: boolean) => void;
  setAnimationPhase: (phase: AppState['animationPhase']) => void;
  resetState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialMessages: Message[] = [
  {
    id: '1',
    content: "I like jogging in the morning.",
    sender: 'user',
    timestamp: new Date()
  },
  {
    id: '2',
    content: "Great! I've noted that down as a hobby.",
    sender: 'assistant',
    timestamp: new Date()
  },
  {
    id: '3',
    content: "Also meditation helps me relax.",
    sender: 'user',
    timestamp: new Date()
  }
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userId] = useState('user_1');
  const [userName] = useState('Alex Johnson');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [userGraph, setUserGraph] = useState<UserGraph | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<AppState['animationPhase']>('initial');

  const addChatMessage = (message: Message) => {
    setChatMessages(prev => [...prev, message]);
  };

  const resetState = () => {
    setSelectedTask(null);
    setUserGraph(null);
    setChatMessages(initialMessages);
    setLoading(false);
    setShowChat(false);
    setAnimationPhase('initial');
  };

  const value: AppContextType = {
    userId,
    userName,
    selectedTask,
    userGraph,
    chatMessages,
    loading,
    showChat,
    animationPhase,
    setSelectedTask,
    setUserGraph,
    setChatMessages,
    addChatMessage,
    setLoading,
    setShowChat,
    setAnimationPhase,
    resetState,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};