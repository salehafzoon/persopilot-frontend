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

        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">
            RecoPilot Console
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Console;