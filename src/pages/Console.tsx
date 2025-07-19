import { useState } from 'react';
import { ArrowLeft, Plus, X, Loader2, CheckCircle, User, Send } from 'lucide-react';
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
    { 
      id: 'USER_001', 
      description: 'This user often talks about hiking, outdoor meals, and weekend nature trips. Frequently shares photos from national parks and discusses camping gear. Likely a camping enthusiast who values authentic outdoor experiences.'
    },
    { 
      id: 'USER_002', 
      description: 'Occasionally shares scenic photos and enjoys weekend getaways to national parks. Shows moderate interest in outdoor activities but prefers comfortable accommodations over traditional camping.'
    },
    { 
      id: 'USER_003', 
      description: 'Focused on city life, technology, and indoor entertainment. Rarely engages with outdoor content and typically posts about restaurants, movies, and urban activities. Unlikely to be interested in camping.'
    },
    { 
      id: 'USER_004', 
      description: 'Enjoys outdoor running and cycling but shows limited interest in camping or wilderness activities. Prefers structured outdoor exercise over adventure camping experiences.'
    },
    { 
      id: 'USER_005', 
      description: 'Family-oriented person who enjoys organized outdoor activities like picnics and beach visits. Interested in child-friendly outdoor experiences but not extreme camping adventures.'
    },
    { 
      id: 'USER_006', 
      description: 'Professional photographer specializing in landscape and wildlife photography. Frequently travels to remote locations for work but camping is more of a necessity than a personal passion.'
    },
    { 
      id: 'USER_007', 
      description: 'Travel blogger who covers luxury resorts and five-star accommodations. Appreciates natural beauty but strongly prefers glamping over traditional camping experiences.'
    },
    { 
      id: 'USER_008', 
      description: 'Survival skills instructor and wilderness guide who lives off-grid part-time. Deeply passionate about primitive camping, bushcraft, and teaching others outdoor survival techniques.'
    },
    { 
      id: 'USER_009', 
      description: 'Weekend warrior who enjoys car camping and RV trips with friends. Likes the social aspect of camping but prefers modern conveniences and established campgrounds.'
    },
    { 
      id: 'USER_010', 
      description: 'Environmental activist who participates in conservation efforts and clean-up campaigns. Values nature preservation but camping is secondary to environmental advocacy work.'
    },
    { 
      id: 'USER_011', 
      description: 'College student who goes on occasional group camping trips for social reasons. Shows interest in outdoor activities but limited by budget and experience level.'
    },
    { 
      id: 'USER_012', 
      description: 'Retired professional who recently discovered camping as a hobby. Enthusiastic about learning new outdoor skills and investing in quality camping equipment for future adventures.'
    }
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

  const handleSubmitLabels = () => {
    console.log('Submitting labels:', userAssignments);
    // Here you would typically send the assignments to your backend
  };

  const isNextEnabled = currentStep === 1 
    ? description.trim() && categories.length > 0 
    : selectedTaskName.trim();

  const hasAssignments = Object.keys(userAssignments).length > 0;

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
                  
                  {/* Scrollable Grid Container */}
                  <div className="max-h-96 overflow-y-auto pr-2 mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {mockUsers.map((user) => {
                        const isAssigned = userAssignments[user.id];
                        return (
                          <Card 
                            key={user.id} 
                            className={`transition-all duration-200 ${
                              isAssigned 
                                ? 'bg-primary/5 border-primary shadow-md ring-1 ring-primary/20' 
                                : 'bg-card border-muted hover:shadow-md'
                            }`}
                          >
                            <CardContent className="p-4">
                              {/* User ID/Avatar */}
                              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-muted">
                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                  <User size={16} className="text-muted-foreground" />
                                </div>
                                <span className="font-mono text-sm font-medium text-foreground">
                                  {user.id}
                                </span>
                                {isAssigned && (
                                  <div className="ml-auto">
                                    <div className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full font-medium">
                                      {isAssigned}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* User Description */}
                              <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-4">
                                {user.description}
                              </p>

                              {/* Assign Group Dropdown */}
                              <div className="space-y-2">
                                <label className="text-xs font-medium text-foreground">
                                  Assign Group
                                </label>
                                <Select
                                  value={userAssignments[user.id] || ''}
                                  onValueChange={(value) => handleUserAssignment(user.id, value)}
                                >
                                  <SelectTrigger className="w-full h-9">
                                    <SelectValue placeholder="Select group..." />
                                  </SelectTrigger>
                                  <SelectContent className="bg-popover border-muted z-50">
                                    {categories.map((category) => (
                                      <SelectItem key={category} value={category}>
                                        {category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Labels Button */}
                  {hasAssignments && (
                    <div className="flex justify-center mb-6">
                      <Button 
                        onClick={handleSubmitLabels}
                        className="px-6 py-2 bg-primary hover:bg-primary/90"
                      >
                        <Send size={16} className="mr-2" />
                        Submit Labels ({Object.keys(userAssignments).length} assigned)
                      </Button>
                    </div>
                  )}
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