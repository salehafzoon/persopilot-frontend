import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Brain, Wrench } from 'lucide-react';
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
    userName,
    setUserGraph,
  } = useAppContext();

  const [inputValue, setInputValue] = useState('');
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [currentReason, setCurrentReason] = useState<string>('');
  const [currentTool, setCurrentTool] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!selectedTask) return null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAssistantTyping]);

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
    setIsAssistantTyping(true);

    // Simulate server response with new format
    setTimeout(() => {
      setIsAssistantTyping(false);
      
      // Simulate server response
      const mockServerResponse = {
        session_id: "2f2684e3-ac19-4943-8ad4-ccc9c54a830f",
        response: {
          response: "It's great to know that you enjoy drinking wine at night!",
          reason: "User expressing his/her preferences",
          used_tool: "PersonaExtractor"
        },
        is_persona_updated: true,
        persona_graph: {
          nodes: [
            {
              id: "user_01",
              label: "user_01",
              type: "User"
            },
            {
              id: "1",
              label: "Content Consumption",
              type: "Task"
            },
            {
              id: "Book",
              label: "Book",
              type: "Topic"
            },
            {
              id: "Game",
              label: "Game",
              type: "Topic"
            },
            {
              id: "Movie",
              label: "Movie",
              type: "Topic"
            },
            {
              id: "Music",
              label: "Music",
              type: "Topic"
            },
            {
              id: "Book_reading novels",
              label: "reading novels",
              type: "Object"
            },
            {
              id: "Movie_watching sci-fi",
              label: "watching sci-fi",
              type: "Object"
            },
            {
              id: "Music_classical music",
              label: "classical music",
              type: "Object"
            },
            {
              id: "Game_video games",
              label: "video games",
              type: "Object"
            }
          ],
          edges: [
            {
              source: "user_01",
              target: "1",
              label: "has_task"
            },
            {
              source: "1",
              target: "Book",
              label: "has_topic"
            },
            {
              source: "1",
              target: "Game",
              label: "has_topic"
            },
            {
              source: "1",
              target: "Movie",
              label: "has_topic"
            },
            {
              source: "1",
              target: "Music",
              label: "has_topic"
            },
            {
              source: "Book",
              target: "Book_reading novels",
              label: "likes"
            },
            {
              source: "Movie",
              target: "Movie_watching sci-fi",
              label: "likes"
            },
            {
              source: "Music",
              target: "Music_classical music",
              label: "likes"
            },
            {
              source: "Game",
              target: "Game_video games",
              label: "plays"
            }
          ]
        },
        timestamp: "2025-07-29T09:34:34.497380"
      };

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: mockServerResponse.response.response,
        sender: 'assistant' as const,
        timestamp: new Date(),
        reason: mockServerResponse.response.reason,
        usedTool: mockServerResponse.response.used_tool
      };
      
      addChatMessage(assistantMessage);
      
      // Update reasoning panel
      setCurrentReason(mockServerResponse.response.reason);
      setCurrentTool(mockServerResponse.response.used_tool);
      
      // Update persona graph if needed
      if (mockServerResponse.is_persona_updated) {
        setUserGraph(mockServerResponse.persona_graph);
      }
    }, 2000);
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
      <div className="fixed top-0 left-0 right-0 z-50 p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">PersoAgent</h1>
        <p className="text-sm text-muted-foreground absolute left-1/2 transform -translate-x-1/2">Hello {userName}</p>
        <div></div>
      </div>

      {/* Main Layout */}
      <div className="flex w-full pt-16">
        {/* Left 3/5: Chatbot Panel */}
        <div className="w-3/5 flex flex-col border-r border-border">
          {/* Chat Header */}
          <header className="bg-card/90 backdrop-blur-sm border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
                  ← Back
                </Button>
              </div>
              
              {/* Center Task Title */}
              <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                <span className="text-2xl">{selectedTask.icon}</span>
                <h2 className="text-xl font-semibold text-foreground">{selectedTask.title}</h2>
              </div>
              
              <div></div>
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
                      <p className="text-xs text-white/70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white text-black p-3 rounded-2xl rounded-br-sm border border-border">
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isAssistantTyping && (
              <div className="flex justify-end animate-fade-in">
                <div className="relative max-w-[70%]">
                  <div className="bg-white text-black p-3 rounded-2xl rounded-br-sm border border-border">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">Assistant is typing</span>
                      <div className="flex gap-1 ml-2">
                        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
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
                  placeholder={isAssistantTyping ? "Assistant is responding..." : "Type your message..."}
                  className="flex-1"
                  disabled={isAssistantTyping}
                />
                <Button 
                  type="submit" 
                  disabled={!inputValue.trim() || isAssistantTyping}
                >
                  <Send size={16} />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 2/5: Persona Graph + Explanation Panel */}
        <div className="w-2/5 flex flex-col bg-card">
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

          {/* Bottom 1/3: Reasoning Panel */}
          <div className="h-1/3 p-4 border-t border-border">
            <div className="bg-card rounded-lg p-4 shadow-soft border border-border h-full">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Wrench size={16} />
                Reasoning
              </h4>
              
              {currentTool && currentTool !== 'Non' && (
                <div className="mb-3">
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    <Wrench size={12} />
                    {currentTool}
                  </div>
                </div>
              )}
              
              <div className="text-sm text-muted-foreground">
                {currentReason || 'Waiting for assistant response...'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};