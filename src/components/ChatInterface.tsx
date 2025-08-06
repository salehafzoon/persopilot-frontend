import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Brain, Wrench } from 'lucide-react';
import { PersonaGraph } from './PersonaGraph';
import { useAppContext } from '@/context/AppContext';
import { sendChatMessage, deleteChatSession } from '@/services/api';

interface ChatInterfaceProps {
  onBack: () => void;
  onResetTimeout?: () => void;
}

export const ChatInterface = ({ onBack, onResetTimeout }: ChatInterfaceProps) => {
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


// In handleSendMessage function, replace the setTimeout mock with:
const handleSendMessage = async (e: React.FormEvent) => {
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

  try {
    // Get session from localStorage
    const chatSession = JSON.parse(localStorage.getItem('chatSession') || '{}');
    const sessionId = chatSession.session_id;

    const response = await sendChatMessage(sessionId, inputValue);
    
    // Parse the response which might contain JSON followed by additional content
    let parsedResponse;
    try {
      // Check if response.response is a string that needs parsing or already an object
      const responseData = response.response as any; // Type assertion to handle API inconsistency
      
      if (typeof responseData === 'string') {
        // Extract just the JSON part if the response contains additional content
        const jsonMatch = responseData.match(/^\{[\s\S]*?\n\}/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback: try to parse the entire response as JSON
          parsedResponse = JSON.parse(responseData);
        }
      } else {
        // response.response is already an object
        parsedResponse = responseData;
      }
    } catch (error) {
      console.error('Failed to parse response JSON:', error);
      // Fallback: use the response as-is if it's an object, or create a default structure
      const responseData = response.response as any;
      if (typeof responseData === 'object') {
        parsedResponse = responseData;
      } else {
        parsedResponse = { response: responseData, reason: 'Response parsing error', used_tool: 'None' };
      }
    }
    
    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      content: parsedResponse.response,
      sender: 'assistant' as const,
      timestamp: new Date(),
      reason: parsedResponse.reason,
      usedTool: parsedResponse.used_tool
    };
    
    addChatMessage(assistantMessage);
    setCurrentReason(parsedResponse.reason);
    setCurrentTool(parsedResponse.used_tool);
    
    // Update persona graph if needed
    if (response.is_persona_updated && response.persona_graph) {
      setUserGraph(response.persona_graph);
    }
    
    // Reset session timeout after successful message
    onResetTimeout?.();
    
  } catch (error) {
    console.error('Failed to send message:', error);
    // Add error message
    const errorMessage = {
      id: (Date.now() + 1).toString(),
      content: 'Sorry, I encountered an error. Please try again.',
      sender: 'assistant' as const,
      timestamp: new Date()
    };
    addChatMessage(errorMessage);
  }
  
  setIsAssistantTyping(false);
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
                <Button variant="ghost" onClick={async () => {
                  try {
                    const chatSession = JSON.parse(localStorage.getItem('chatSession') || '{}');
                    if (chatSession.session_id) {
                      await deleteChatSession(chatSession.session_id);
                    }
                  } catch (error) {
                    console.error('Failed to delete chat session:', error);
                  }
                  onBack();
                }} className="text-muted-foreground hover:text-foreground">
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
                      <div className="text-sm">
                        {(() => {
                          const content = message.content;
                          const lines = content.split('\n');
                          const result = [];
                          let currentListItems = [];
                          let inList = false;
                          
                          for (let i = 0; i < lines.length; i++) {
                            const line = lines[i].trim();
                            
                            // Check if line is a list item (starts with - or * or number.)
                            if (line.match(/^[-*]\s/) || line.match(/^\d+\.\s/)) {
                              if (!inList) {
                                // Starting a new list
                                if (result.length > 0) {
                                  result.push(<div key={`text-${i}`} className="mb-2">{result.pop()}</div>);
                                }
                                inList = true;
                                currentListItems = [];
                              }
                              // Remove the list marker and add to current list
                              const listItem = line.replace(/^[-*]\s/, '').replace(/^\d+\.\s/, '');
                              currentListItems.push(<li key={`item-${i}`}>{listItem}</li>);
                            } else {
                              // Not a list item
                              if (inList) {
                                // End the current list
                                result.push(
                                  <ul key={`list-${i}`} className="list-disc list-inside space-y-1 mb-2">
                                    {currentListItems}
                                  </ul>
                                );
                                currentListItems = [];
                                inList = false;
                              }
                              
                              if (line) {
                                result.push(line);
                                if (i < lines.length - 1) result.push(<br key={`br-${i}`} />);
                              }
                            }
                          }
                          
                          // Handle case where message ends with a list
                          if (inList && currentListItems.length > 0) {
                            result.push(
                              <ul key="final-list" className="list-disc list-inside space-y-1">
                                {currentListItems}
                              </ul>
                            );
                          }
                          
                          return result;
                        })()}
                      </div>
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