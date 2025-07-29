import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Brain } from 'lucide-react';
import { PersonaGraph } from './PersonaGraph';
import { useAppContext } from '@/context/AppContext';

interface ChatInterfaceProps {
  onBack: () => void;
}

export const ChatInterface = ({ onBack }: ChatInterfaceProps) => {
  const {
    selectedTask,
    chatMessages,
    addChatMessage,
  } = useAppContext();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!selectedTask) return null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user' as const,
      timestamp: new Date()
    };

    addChatMessage(userMessage);
    setInputValue('');

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're interested in "${inputValue}". Let me help you with that in the context of ${selectedTask.title.toLowerCase()}. Here are some personalized suggestions...`,
        sender: 'assistant' as const,
        timestamp: new Date()
      };
      addChatMessage(assistantMessage);
    }, 1000);
  };

  // Get task-specific color for user messages
  const getUserMessageColor = () => {
    switch (selectedTask.title) {
      case 'Content Consumption':
        return 'bg-blue-500';
      case 'Lifestyle Optimization':
        return 'bg-emerald-500';
      case 'Career Development':
        return 'bg-purple-500';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className="h-screen flex bg-gradient-subtle">
      {/* Fixed Brand Header */}
      <div className="fixed top-0 left-0 z-50 p-4">
        <h1 className="text-2xl font-bold text-foreground">PersoAgent</h1>
      </div>

      {/* Main Layout */}
      <div className="flex w-full pt-16">
        {/* Left 1/2: Chatbot Panel */}
        <div className="w-1/2 flex flex-col border-r border-border">
          {/* Chat Header */}
          <header className="bg-card/90 backdrop-blur-sm border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
                  ← Back
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedTask.icon}</span>
                  <h2 className="text-xl font-semibold text-foreground">{selectedTask.title}</h2>
                </div>
              </div>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`relative max-w-[70%] ${message.sender === 'user' ? '' : ''}`}>
                  {message.sender === 'user' ? (
                    <div className={`${getUserMessageColor()} text-white p-3 rounded-2xl rounded-bl-sm`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ) : (
                    <div className="bg-white text-black p-3 rounded-2xl rounded-br-sm border border-border">
                      <p className="text-sm">{message.content}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          </div>

          {/* Input */}
          <div className="border-t border-border bg-card/90 backdrop-blur-sm p-4">
            <form onSubmit={handleSendMessage}>
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!inputValue.trim()}>
                  <Send size={16} />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 1/2: Persona Graph + Explanation Panel */}
        <div className="w-1/2 flex flex-col bg-card">
          <header className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Brain size={20} />
              Persona Graph
            </h3>
          </header>
          
          {/* Top 2/3: Persona Graph */}
          <div className="flex-1 overflow-hidden h-2/3">
            <PersonaGraph />
          </div>

          {/* Bottom 1/3: Explanation Box */}
          <div className="h-1/3 p-4 border-t border-border">
            <div className="bg-card rounded-lg p-4 shadow-soft border border-border h-full flex items-center">
              <p className="text-sm text-muted-foreground">
                This is based on your interest in jogging and meditation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};