import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Console = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
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

        {/* Content */}
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            RecoPilot Console
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Knowledge Worker Interface
          </p>
          <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-muted p-12 max-w-2xl mx-auto">
            <p className="text-muted-foreground text-lg">
              Console interface for creating classification tasks and defining targeting strategies coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Console;