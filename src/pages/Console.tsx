import { useState } from 'react';
import { ArrowLeft, Plus, X, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

const Console = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTaskName, setSelectedTaskName] = useState('');
  const [customTaskName, setCustomTaskName] = useState('');
  const [showUserGrid, setShowUserGrid] = useState(false);
  const [userAssignments, setUserAssignments] = useState<{[key: string]: string}>({});

  // Mock data for suggestions and users
  const taskNameSuggestions = ['CampingAffinity', 'OutdoorPreference', 'NatureClassification'];
  const mockUsers = [
    { id: '1', description: 'An active outdoor enthusiast who frequently posts about hiking adventures, camping gear reviews, and wilderness photography. Shows strong engagement with nature-related content and outdoor equipment brands.' },
    { id: '2', description: 'A casual nature lover who occasionally shares scenic photos and enjoys weekend getaways to national parks. Moderate interest in outdoor activities but prefers comfortable accommodations.' },
    { id: '3', description: 'An urban dweller focused on city life, technology, and indoor entertainment. Rarely engages with outdoor content and prefers indoor activities like gaming, movies, and restaurants.' },
    { id: '4', description: 'A fitness enthusiast who enjoys outdoor running and cycling but shows limited interest in camping or wilderness activities. Prefers structured outdoor exercise over adventure camping.' },
    { id: '5', description: 'A family-oriented person who enjoys organized outdoor activities like picnics and beach visits. Interested in child-friendly outdoor experiences but not extreme camping adventures.' },
    { id: '6', description: 'A professional photographer specializing in landscape and wildlife photography. Frequently travels to remote locations for work but camping is more of a necessity than a passion.' },
    { id: '7', description: 'A travel blogger who covers luxury resorts and five-star accommodations. Appreciates natural beauty but strongly prefers glamping over traditional camping experiences.' },
    { id: '8', description: 'A survival skills instructor and wilderness guide who lives off-grid part-time. Deeply passionate about primitive camping, bushcraft, and teaching others outdoor survival techniques.' }
  ];

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
    if (currentStep === 1) {
      setLoading(true);
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Handle finalize classification
      console.log('Finalizing classification...');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      if (currentStep === 2) {
        setSelectedTaskName('');
        setCustomTaskName('');
        setShowUserGrid(false);
      }
    }
  };

  const handleTaskNameSelect = (name: string) => {
    setSelectedTaskName(name);
    setCustomTaskName('');
    setTimeout(() => setShowUserGrid(true), 300);
  };

  const handleCustomSubmit = () => {
    if (customTaskName.trim()) {
      setSelectedTaskName(customTaskName.trim());
      setTimeout(() => setShowUserGrid(true), 300);
    }
  };

  const handleUserAssignment = (userId: string, category: string) => {
    setUserAssignments(prev => ({
      ...prev,
      [userId]: category
    }));
  };

  const isNextEnabled = currentStep === 1 
    ? description.trim() && categories.length > 0 
    : selectedTaskName.trim();

  const getNextButtonText = () => {
    if (currentStep === 1) return 'Next';
    if (currentStep === 2) return 'Finalize Classification';
    return 'Next';
  };

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
                  className="min-w-32"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : getNextButtonText()}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <Card className="bg-card/50 backdrop-blur-sm border-muted shadow-glow">
            <CardContent className="p-8">
              {/* Task Naming Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Choose a name for this classification task
                </h2>

                {/* Suggestion Cards */}
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {taskNameSuggestions.map((suggestion) => (
                      <Card
                        key={suggestion}
                        className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md ${
                          selectedTaskName === suggestion 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-card hover:bg-muted border-muted'
                        }`}
                        onClick={() => handleTaskNameSelect(suggestion)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {selectedTaskName === suggestion && <CheckCircle size={16} />}
                            <span className="font-medium">{suggestion}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Custom Name Input */}
                  <div className="flex gap-2">
                    <Input
                      value={customTaskName}
                      onChange={(e) => setCustomTaskName(e.target.value)}
                      placeholder="Or enter a custom name..."
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleCustomSubmit()}
                    />
                    <Button 
                      onClick={handleCustomSubmit}
                      disabled={!customTaskName.trim()}
                      size="sm"
                    >
                      Submit
                    </Button>
                  </div>
                </div>

                {/* Selected Task Name Display */}
                {selectedTaskName && (
                  <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Selected task name:</p>
                    <p className="font-semibold text-primary text-lg">{selectedTaskName}</p>
                  </div>
                )}
              </div>

              {/* User Labeling Grid */}
              {showUserGrid && (
                <div className="animate-fade-in">
                  <h3 className="text-lg font-semibold text-foreground mb-6">
                    User Labeling Grid
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    {mockUsers.map((user) => (
                      <Card key={user.id} className="bg-card border-muted">
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            {user.description}
                          </p>
                          <Select
                            value={userAssignments[user.id] || ''}
                            onValueChange={(value) => handleUserAssignment(user.id, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Assign category..." />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-muted z-50">
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={!isNextEnabled}
                  className="min-w-32"
                >
                  {getNextButtonText()}
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
      </div>
    </div>
  );
};

export default Console;