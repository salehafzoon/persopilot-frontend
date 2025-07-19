import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();

  const handleKnowledgeWorkerClick = () => {
    navigate('/console');
  };

  const handleUserClick = () => {
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl font-bold text-foreground mb-4">
            Welcome to PersoPilot
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose your role to get started
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Knowledge Worker Card */}
          <Card 
            className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-glow border-muted bg-card/50 backdrop-blur-sm animate-slide-up"
            onClick={handleKnowledgeWorkerClick}
            style={{ animationDelay: '0.1s' }}
          >
            <CardHeader className="text-center pb-4">
              <div className="text-5xl mb-4">🎯</div>
              <CardTitle className="text-2xl font-semibold text-foreground">
                Knowledge Worker
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-muted-foreground leading-relaxed text-lg">
                Create classification tasks and define smart targeting strategies
              </CardDescription>
            </CardContent>
          </Card>

          {/* User Card */}
          <Card 
            className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-glow border-muted bg-card/50 backdrop-blur-sm animate-slide-up"
            onClick={handleUserClick}
            style={{ animationDelay: '0.2s' }}
          >
            <CardHeader className="text-center pb-4">
              <div className="text-5xl mb-4">💬</div>
              <CardTitle className="text-2xl font-semibold text-foreground">
                User
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-muted-foreground leading-relaxed text-lg">
                Chat with PersoAgent and receive personalized insights
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-muted-foreground text-sm">
          © 2025 PersoPilot AI
        </p>
      </footer>
    </div>
  );
};

export default Index;
