import { useState } from 'react';
import { ArrowLeft, Plus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Console = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleAddCategory = () => {
    if (categoryInput.trim() && !categories.includes(categoryInput.trim())) {
      setCategories([...categories, categoryInput.trim()]);
      setCategoryInput('');
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    setCategories(categories.filter(cat => cat !== categoryToRemove));
  };

  const handleNext = async () => {
    setLoading(true);
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setCurrentStep(2);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(1);
    }
  };

  const isNextEnabled = description.trim() && categories.length > 0;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-4xl mx-auto">
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
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground">
            RecoPilot Console
          </h1>
        </div>

        {/* Main Content */}
        {currentStep === 1 && (
          <Card className="bg-card/50 backdrop-blur-sm border-muted shadow-glow">
            <CardContent className="p-8">
              {/* Description Input */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Classification Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you want to classify. For example: I want to analyze users based on whether they are camping enthusiasts or not."
                  className="w-full h-32 px-4 py-3 rounded-lg border border-muted bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              {/* Category Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Category Groups
                </label>
                <div className="flex gap-2">
                  <Input
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add category/group names (e.g., Enthusiasts, Non-Enthusiasts)"
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAddCategory}
                    disabled={!categoryInput.trim()}
                    size="sm"
                    className="px-3"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              {/* Category Pills */}
              {categories.length > 0 && (
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {category}
                        <button
                          onClick={() => handleRemoveCategory(category)}
                          className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={!isNextEnabled || loading}
                  className="min-w-24"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Next'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Processing your classification request...</span>
            </div>
          </div>
        )}

        {/* Step 2 Placeholder */}
        {currentStep === 2 && (
          <Card className="bg-card/50 backdrop-blur-sm border-muted shadow-glow">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Step 2: Configuration
              </h2>
              <p className="text-muted-foreground">
                Step 2 content will be implemented next...
              </p>
              <div className="mt-6">
                <Button variant="outline" onClick={handleBack}>
                  Back to Step 1
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Console;