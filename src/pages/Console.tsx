import { useState } from 'react';
import { ArrowLeft, Loader2, CheckCircle, User, Send, Menu, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider,
  SidebarTrigger,
  useSidebar 
} from '@/components/ui/sidebar';

const Console = () => {
  const navigate = useNavigate();
  
  // Mock data for suggestions and users
  const taskNameSuggestions = ['CampingAffinity', 'OutdoorPreference', 'NatureClassification'];
  
  // Mock data for previously created classification tasks
  const previousTasks = [
    {
      id: 1,
      name: 'CampingAffinity',
      description: 'Whether or not a user is interested in camping and outdoor activities',
      groups: ['Camping Enthusiast', 'Not Camping Enthusiast'],
      createdAt: new Date('2024-01-15T10:30:00')
    },
    {
      id: 2,
      name: 'FitnessEnthusiast',
      description: 'Whether or not a user is actively engaged in fitness and exercise routines',
      groups: ['Fitness Enthusiast', 'Not Fitness Enthusiast'],
      createdAt: new Date('2024-01-12T14:20:00')
    },
    {
      id: 3,
      name: 'TechSavvy',
      description: 'Whether or not a user shows high interest in technology and digital innovations',
      groups: ['Tech Savvy', 'Not Tech Savvy'],
      createdAt: new Date('2024-01-10T09:15:00')
    },
    {
      id: 4,
      name: 'FoodieClassifier',
      description: 'Whether or not a user is passionate about food experiences and cooking',
      groups: ['Foodie', 'Not Foodie'],
      createdAt: new Date('2024-01-08T16:45:00')
    },
    {
      id: 5,
      name: 'TravelEnthusiast',
      description: 'Whether or not a user frequently travels and seeks new travel experiences',
      groups: ['Travel Enthusiast', 'Not Travel Enthusiast'],
      createdAt: new Date('2024-01-05T11:10:00')
    }
  ];

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

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classificationGroup: '',
    offerMessage: ''
  });
  const [personas, setPersonas] = useState(mockUsers);
  const [loadingPersonas, setLoadingPersonas] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // Form handlers
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.classificationGroup || !formData.offerMessage) {
      return;
    }
    
    setLoadingPersonas(true);
    // Simulate loading user personas
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPersonas(mockUsers);
    setLoadingPersonas(false);
  };

  const isFormValid = formData.title.trim() && formData.description.trim() && 
                     formData.classificationGroup.trim() && formData.offerMessage.trim();

  // Handle task selection from sidebar
  const handleTaskSelect = (task: any) => {
    setSelectedTask(task);
  };

  // Handle creating new task
  const handleCreateNew = () => {
    setSelectedTask(null);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        {/* Sidebar */}
        <Sidebar className="border-r border-muted">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Previous Classifications</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {previousTasks.map((task) => (
                    <SidebarMenuItem key={task.id}>
                      <Card 
                        className="m-2 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleTaskSelect(task)}
                      >
                        <CardContent className="p-3">
                          <div className="font-medium text-foreground mb-1">{task.name}</div>
                          <div className="text-xs text-muted-foreground leading-tight">
                            {task.description}
                          </div>
                        </CardContent>
                      </Card>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Fixed Header */}
          <div className="sticky top-0 z-50 bg-gradient-subtle p-6 border-b border-muted backdrop-blur-sm">
            <div className="max-w-8xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                className="hover:bg-muted"
              >
                <ArrowLeft size={20} className="mr-2" />
                Logout
              </Button>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex justify-between items-center">
            <div></div>
            <h1 className="text-5xl font-bold text-foreground">
              RecoPilot Console
            </h1>
            <Button 
              onClick={handleCreateNew}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Create New Task
            </Button>
          </div>
            </div>
          </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto p-6">
        <div className="max-w-8xl mx-auto">
          {/* Task Details View - when a task is selected */}
          {selectedTask && (
            <Card className="bg-card/50 backdrop-blur-sm border-muted shadow-glow">
              <CardContent className="p-8">
                {/* Header with Edit Icon */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      {selectedTask.name}
                    </h2>
                  </div>
                  <Button variant="ghost" size="sm" className="hover:bg-muted">
                    <Edit size={20} className="text-muted-foreground" />
                  </Button>
                </div>

                {/* Task Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Description
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedTask.description}
                  </p>
                </div>

                {/* Classification Groups */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Classification Groups
                  </h3>
                  <div className="flex gap-3">
                    {selectedTask.groups.map((group: string, index: number) => (
                      <div 
                        key={index}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                          index === 0 
                            ? 'bg-primary/10 text-primary border border-primary/20' 
                            : 'bg-secondary/10 text-secondary-foreground border border-secondary/20'
                        }`}
                      >
                        {group}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Creation Date & Time */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Created
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedTask.createdAt.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} at {selectedTask.createdAt.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Simplified Form - when no task is selected */}
          {!selectedTask && (
            <>
              <Card className="bg-card/50 backdrop-blur-sm border-muted shadow-glow mb-8">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Create New Classification Task</h2>
                  
                  {/* Title Field */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Title:
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      placeholder="Enter task title..."
                      className="w-full"
                    />
                  </div>

                  {/* Description Field */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description:
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      placeholder="Describe what this classification task is about..."
                      className="w-full h-24 px-4 py-3 rounded-lg border border-muted bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Classification Group Field */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Classification Group:
                    </label>
                    <div className="flex items-center gap-3">
                      <Input
                        value={formData.classificationGroup}
                        onChange={(e) => handleFormChange('classificationGroup', e.target.value)}
                        placeholder="e.g., Camping Enthusiast"
                        className="max-w-xs"
                      />
                      {/* Chips - only show when input has content */}
                      {formData.classificationGroup.trim() && (
                        <div className="flex gap-2">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-full text-sm font-medium">
                            {formData.classificationGroup.trim()}
                          </div>
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-500 text-white rounded-full text-sm font-medium">
                            Non-{formData.classificationGroup.trim()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Offer Message Field */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Offer message:
                    </label>
                    <textarea
                      value={formData.offerMessage}
                      onChange={(e) => handleFormChange('offerMessage', e.target.value)}
                      placeholder="Enter the offer message to show to users..."
                      className="w-full h-24 px-4 py-3 rounded-lg border border-muted bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    onClick={handleSubmit}
                    disabled={!isFormValid || loadingPersonas}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {loadingPersonas ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading User Personas...
                      </>
                    ) : (
                      'Load User Personas'
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* User Personas Grid */}
              {personas.length > 0 && !loadingPersonas && (
                <Card className="bg-card/50 backdrop-blur-sm border-muted shadow-glow">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-foreground mb-6">
                      User Personas ({personas.length} users)
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {personas.map((user) => (
                        <Card 
                          key={user.id} 
                          className="transition-all duration-200 bg-card hover:shadow-md"
                        >
                          <CardContent className="p-4">
                            {/* User ID/Avatar */}
                            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-muted">
                              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                <User size={16} className="text-muted-foreground" />
                              </div>
                              <span className="font-mono text-sm font-bold text-foreground">
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
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                              {user.description}
                            </p>

                            {/* Assigned Group */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-foreground">Group:</span>
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                user.assignedGroup.includes('Not') 
                                  ? 'bg-secondary/10 text-secondary-foreground border border-secondary/20' 
                                  : 'bg-primary/10 text-primary border border-primary/20'
                              }`}>
                                {user.assignedGroup}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Console;