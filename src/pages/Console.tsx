import { useState } from 'react';
import { ArrowLeft, Loader2, CheckCircle, User, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

const Console = () => {
  const navigate = useNavigate();
  
  // Mock data for suggestions and users
  const taskNameSuggestions = ['CampingAffinity', 'OutdoorPreference', 'NatureClassification'];
  const mockUsers = [
    { 
      id: 'USER_001',
      age: 28,
      gender: 'Female',
      description: 'This user often talks about hiking, outdoor meals, and weekend nature trips. Frequently shares photos from national parks and discusses camping gear. Likely a camping enthusiast who values authentic outdoor experiences.',
      assignedGroup: 'Camping Enthusiast'
    },
    { 
      id: 'USER_002',
      age: 34,
      gender: 'Male',
      description: 'Occasionally shares scenic photos and enjoys weekend getaways to national parks. Shows moderate interest in outdoor activities but prefers comfortable accommodations over traditional camping.',
      assignedGroup: 'Camping Enthusiast'
    },
    { 
      id: 'USER_003',
      age: 25,
      gender: 'Non-binary',
      description: 'Focused on city life, technology, and indoor entertainment. Rarely engages with outdoor content and typically posts about restaurants, movies, and urban activities. Unlikely to be interested in camping.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_004',
      age: 31,
      gender: 'Female',
      description: 'Enjoys outdoor running and cycling but shows limited interest in camping or wilderness activities. Prefers structured outdoor exercise over adventure camping experiences.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_005',
      age: 42,
      gender: 'Male',
      description: 'Family-oriented person who enjoys organized outdoor activities like picnics and beach visits. Interested in child-friendly outdoor experiences but not extreme camping adventures.',
      assignedGroup: 'Camping Enthusiast'
    },
    { 
      id: 'USER_006',
      age: 29,
      gender: 'Female',
      description: 'Professional photographer specializing in landscape and wildlife photography. Frequently travels to remote locations for work but camping is more of a necessity than a personal passion.',
      assignedGroup: 'Camping Enthusiast'
    },
    { 
      id: 'USER_007',
      age: 37,
      gender: 'Male',
      description: 'Travel blogger who covers luxury resorts and five-star accommodations. Appreciates natural beauty but strongly prefers glamping over traditional camping experiences.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_008',
      age: 45,
      gender: 'Male',
      description: 'Survival skills instructor and wilderness guide who lives off-grid part-time. Deeply passionate about primitive camping, bushcraft, and teaching others outdoor survival techniques.',
      assignedGroup: 'Camping Enthusiast'
    },
    { 
      id: 'USER_009',
      age: 26,
      gender: 'Female',
      description: 'Weekend warrior who enjoys car camping and RV trips with friends. Likes the social aspect of camping but prefers modern conveniences and established campgrounds.',
      assignedGroup: 'Camping Enthusiast'
    },
    { 
      id: 'USER_010',
      age: 33,
      gender: 'Female',
      description: 'Environmental activist who participates in conservation efforts and clean-up campaigns. Values nature preservation but camping is secondary to environmental advocacy work.',
      assignedGroup: 'Camping Enthusiast'
    },
    { 
      id: 'USER_011',
      age: 21,
      gender: 'Male',
      description: 'College student who goes on occasional group camping trips for social reasons. Shows interest in outdoor activities but limited by budget and experience level.',
      assignedGroup: 'Camping Enthusiast'
    },
    { 
      id: 'USER_012',
      age: 68,
      gender: 'Female',
      description: 'Retired professional who recently discovered camping as a hobby. Enthusiastic about learning new outdoor skills and investing in quality camping equipment for future adventures.',
      assignedGroup: 'Camping Enthusiast'
    },
    { 
      id: 'USER_013',
      age: 29,
      gender: 'Male',
      description: 'Urban professional who prefers hotel stays and city breaks. Shows no interest in outdoor activities and actively avoids camping-related content.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_014',
      age: 35,
      gender: 'Female',
      description: 'Fitness enthusiast who enjoys gym workouts and indoor sports. Rarely engages with outdoor content and prefers climate-controlled environments.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_015',
      age: 27,
      gender: 'Male',
      description: 'Gaming enthusiast who spends most free time indoors playing video games. Shows minimal interest in outdoor activities or nature-related content.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_016',
      age: 31,
      gender: 'Female',
      description: 'Busy parent who prefers structured indoor activities with children. Values convenience and comfort over outdoor adventures.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_017',
      age: 24,
      gender: 'Non-binary',
      description: 'Art student focused on studio work and gallery exhibitions. Prefers urban cultural experiences over outdoor activities.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_018',
      age: 39,
      gender: 'Male',
      description: 'Business executive who enjoys fine dining and luxury experiences. Shows no interest in camping or roughing it outdoors.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_019',
      age: 26,
      gender: 'Female',
      description: 'Fashion blogger who focuses on style and beauty content. Rarely posts about outdoor activities and prefers urban lifestyle.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_020',
      age: 33,
      gender: 'Male',
      description: 'Tech worker who enjoys indoor hobbies like coding projects and home automation. Limited engagement with outdoor or camping content.',
      assignedGroup: 'Not Camping Enthusiast'
    }
  ];

  // State declarations
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTaskName, setSelectedTaskName] = useState('');
  const [customTaskName, setCustomTaskName] = useState('');
  const [showUserGrid, setShowUserGrid] = useState(false);
  const [classificationGroup, setClassificationGroup] = useState('');
  const [userAssignments, setUserAssignments] = useState<{[key: string]: string}>(() => {
    const initialAssignments: { [userId: string]: string } = {};
    mockUsers.forEach(user => {
      // Use the user's assigned group from mock data
      initialAssignments[user.id] = user.assignedGroup;
    });
    return initialAssignments;
  });

  // Binary classification groups derived from user input
  const binaryGroups = classificationGroup.trim() 
    ? [classificationGroup.trim(), `Not ${classificationGroup.trim()}`]
    : ['Group 1', 'Not Group 1'];

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
    ? description.trim()
    : selectedTaskName.trim();

  const hasAssignments = Object.keys(userAssignments).length > 0;

  const getNextButtonText = () => {
    if (currentStep === 1) return 'Next';
    if (currentStep === 2) return 'Finalize Classification';
    return 'Next';
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-gradient-subtle p-6 border-b border-muted backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
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

          <div className="flex items-center justify-between">
            <div></div>
            <h1 className="text-5xl font-bold text-foreground">
              RecoPilot Console
            </h1>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto p-6">
        <div className="max-w-8xl mx-auto">
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
                  placeholder="Whether or not a user is ..."
                  className="w-full h-32 px-4 py-3 rounded-lg border border-muted bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              {/* Classification Group Input */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Classification Group
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    value={classificationGroup}
                    onChange={(e) => setClassificationGroup(e.target.value)}
                    placeholder="e.g., Camping Enthusiast"
                    className="max-w-xs"
                  />
                  {/* Chips - only show when input has content */}
                  {classificationGroup.trim() && (
                    <div className="flex gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {classificationGroup.trim()}
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/10 text-secondary-foreground rounded-full text-sm font-medium">
                        Not {classificationGroup.trim()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

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
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    User Labeling Grid
                  </h3>
                  
                  {/* Labeling Guidance */}
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-foreground mb-4">
                      Users are assigned to related groups by AI and you can check them below for any changes.
                    </p>
                  </div>
                  
                  {/* Scrollable Grid Container */}
                  <div className="max-h-96 overflow-y-auto pr-2 mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mockUsers.map((user) => {
                        const isAssigned = userAssignments[user.id];
                        return (
                           <Card 
                             key={user.id} 
                             className="transition-all duration-200 bg-card hover:shadow-md min-h-[280px]"
                           >
                             <CardContent className="p-4">
                               {/* User ID/Avatar */}
                               <div className="flex items-center gap-3 mb-3 pb-3 border-b border-muted">
                                 <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                   <User size={16} className="text-muted-foreground" />
                                 </div>
                                  <span className="font-mono text-sm font-bold text-black dark:text-white">
                                    {user.id}
                                  </span>
                               </div>

                              {/* Demographics */}
                              <div className="mb-3">
                                <div className="flex items-center gap-4 text-xs font-medium text-blue-600 dark:text-blue-400">
                                  <span>Age: {user.age}</span>
                                  <span>Gender: {user.gender}</span>
                                </div>
                              </div>

                              {/* User Description */}
                              <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-4">
                                {user.description}
                              </p>

                              {/* Assign Group and Likelihood Section */}
                              <div className="flex gap-4">
                                {/* Assign Group - Left Side */}
                                <div className="flex-1">
                                  <label className="text-xs font-medium text-foreground">
                                    Assign Group
                                  </label>
                                  <Select
                                    value={userAssignments[user.id] || binaryGroups[0]}
                                    onValueChange={(value) => handleUserAssignment(user.id, value)}
                                  >
                                    <SelectTrigger className="w-full mt-2">
                                      <SelectValue placeholder="Assign Group" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border border-muted shadow-lg z-50">
                                      {binaryGroups.map((group) => (
                                        <SelectItem 
                                          key={group} 
                                          value={group}
                                          className="cursor-pointer hover:bg-muted focus:bg-muted"
                                        >
                                          {group}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Likelihood - Right Side */}
                                <div className="flex-1">
                                  <label className="text-xs font-medium text-foreground">
                                    Likelihood
                                  </label>
                                  <div className="mt-2 text-center">
                                    <div className="text-lg font-bold text-primary">
                                      {Math.floor(Math.random() * 40 + 60)}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Confidence
                                    </div>
                                  </div>
                                </div>
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
                        Train Model ({Object.keys(userAssignments).length} assigned)
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
    </div>
  );
};

export default Console;