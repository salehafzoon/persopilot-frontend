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
      date: '2024-01-15 10:30:00',
      username: 'analyst_01'
    },
    {
      id: 2,
      name: 'FitnessEnthusiast',
      description: 'Whether or not a user is actively engaged in fitness and exercise routines',
      groups: ['Fitness Enthusiast', 'Not Fitness Enthusiast'],
      date: '2024-01-12 14:20:00',
      username: 'analyst_01'
    },
    {
      id: 3,
      name: 'TechSavvy',
      description: 'Whether or not a user shows high interest in technology and digital innovations',
      groups: ['Tech Savvy', 'Not Tech Savvy'],
      date: '2024-01-10 09:15:00',
      username: 'analyst_01'
    },
    {
      id: 4,
      name: 'FoodieClassifier',
      description: 'Whether or not a user is passionate about food experiences and cooking',
      groups: ['Foodie', 'Not Foodie'],
      date: '2024-01-08 16:45:00',
      username: 'analyst_01'
    },
    {
      id: 5,
      name: 'TravelEnthusiast',
      description: 'Whether or not a user frequently travels and seeks new travel experiences',
      groups: ['Travel Enthusiast', 'Not Travel Enthusiast'],
      date: '2024-01-05 11:10:00',
      username: 'analyst_01'
    }
  ];

  const mockUsers = [
    { 
      id: 'USER_001',
      username: 'user_001',
      full_name: 'Sarah Johnson',
      age: 28,
      gender: 'Female',
      score: 0.85,
      description: 'This user often talks about hiking, outdoor meals, and weekend nature trips. Frequently shares photos from national parks and discusses camping gear. Likely a camping enthusiast who values authentic outdoor experiences.',
      assignedGroup: 'Camping Enthusiast'
    },
    { 
      id: 'USER_002',
      username: 'user_002',
      full_name: 'Mike Thompson',
      age: 34,
      gender: 'Male',
      score: 0.65,
      description: 'Occasionally shares scenic photos and enjoys weekend getaways to national parks. Shows moderate interest in outdoor activities but prefers comfortable accommodations over traditional camping.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_003',
      username: 'user_003',
      full_name: 'Alex Rivera',
      age: 25,
      gender: 'Non-binary',
      score: 0.25,
      description: 'Focused on city life, technology, and indoor entertainment. Rarely engages with outdoor content and typically posts about restaurants, movies, and urban activities. Unlikely to be interested in camping.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_004',
      username: 'user_004',
      full_name: 'Emily Chen',
      age: 31,
      gender: 'Female',
      score: 0.35,
      description: 'Enjoys outdoor running and cycling but shows limited interest in camping or wilderness activities. Prefers structured outdoor exercise over adventure camping experiences.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_005',
      username: 'user_005',
      full_name: 'David Martinez',
      age: 42,
      gender: 'Male',
      score: 0.55,
      description: 'Family-oriented person who enjoys organized outdoor activities like picnics and beach visits. Interested in child-friendly outdoor experiences but not extreme camping adventures.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_006',
      username: 'user_006',
      full_name: 'Lisa Park',
      age: 29,
      gender: 'Female',
      score: 0.45,
      description: 'Professional photographer specializing in landscape and wildlife photography. Frequently travels to remote locations for work but camping is more of a necessity than a personal passion.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_007',
      username: 'user_007',
      full_name: 'James Wilson',
      age: 37,
      gender: 'Male',
      score: 0.3,
      description: 'Travel blogger who covers luxury resorts and five-star accommodations. Appreciates natural beauty but strongly prefers glamping over traditional camping experiences.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_008',
      username: 'user_008',
      full_name: 'Robert Bear',
      age: 45,
      gender: 'Male',
      score: 0.95,
      description: 'Survival skills instructor and wilderness guide who lives off-grid part-time. Deeply passionate about primitive camping, bushcraft, and teaching others outdoor survival techniques.',
      assignedGroup: 'Camping Enthusiast'
    },
    { 
      id: 'USER_009',
      username: 'user_009',
      full_name: 'Jessica Lee',
      age: 26,
      gender: 'Female',
      score: 0.7,
      description: 'Weekend warrior who enjoys car camping and RV trips with friends. Likes the social aspect of camping but prefers modern conveniences and established campgrounds.',
      assignedGroup: 'Camping Enthusiast'
    },
    { 
      id: 'USER_010',
      username: 'user_010',
      full_name: 'Maria Santos',
      age: 33,
      gender: 'Female',
      score: 0.6,
      description: 'Environmental activist who participates in conservation efforts and clean-up campaigns. Values nature preservation but camping is secondary to environmental advocacy work.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_011',
      username: 'user_011',
      full_name: 'Tyler Johnson',
      age: 21,
      gender: 'Male',
      score: 0.5,
      description: 'College student who goes on occasional group camping trips for social reasons. Shows interest in outdoor activities but limited by budget and experience level.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_012',
      username: 'user_012',
      full_name: 'Dorothy Clark',
      age: 68,
      gender: 'Female',
      score: 0.8,
      description: 'Retired professional who recently discovered camping as a hobby. Enthusiastic about learning new outdoor skills and investing in quality camping equipment for future adventures.',
      assignedGroup: 'Camping Enthusiast'
    },
    { 
      id: 'USER_013',
      username: 'user_013',
      full_name: 'Kevin Brown',
      age: 29,
      gender: 'Male',
      score: 0.15,
      description: 'Urban professional who prefers hotel stays and city breaks. Shows no interest in outdoor activities and actively avoids camping-related content.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_014',
      username: 'user_014',
      full_name: 'Rachel Green',
      age: 35,
      gender: 'Female',
      score: 0.2,
      description: 'Fitness enthusiast who enjoys gym workouts and indoor sports. Rarely engages with outdoor content and prefers climate-controlled environments.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_015',
      username: 'user_015',
      full_name: 'Nathan Kim',
      age: 27,
      gender: 'Male',
      score: 0.1,
      description: 'Gaming enthusiast who spends most free time indoors playing video games. Shows minimal interest in outdoor activities or nature-related content.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_016',
      username: 'user_016',
      full_name: 'Amanda White',
      age: 31,
      gender: 'Female',
      score: 0.25,
      description: 'Busy parent who prefers structured indoor activities with children. Values convenience and comfort over outdoor adventures.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_017',
      username: 'user_017',
      full_name: 'Jordan Taylor',
      age: 24,
      gender: 'Non-binary',
      score: 0.3,
      description: 'Art student focused on studio work and gallery exhibitions. Prefers urban cultural experiences over outdoor activities.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_018',
      username: 'user_018',
      full_name: 'Richard Gold',
      age: 39,
      gender: 'Male',
      score: 0.15,
      description: 'Business executive who enjoys fine dining and luxury experiences. Shows no interest in camping or roughing it outdoors.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_019',
      username: 'user_019',
      full_name: 'Sophie Miller',
      age: 26,
      gender: 'Female',
      score: 0.2,
      description: 'Fashion blogger who focuses on style and beauty content. Rarely posts about outdoor activities and prefers urban lifestyle.',
      assignedGroup: 'Not Camping Enthusiast'
    },
    { 
      id: 'USER_020',
      username: 'user_020',
      full_name: 'Chris Davis',
      age: 33,
      gender: 'Male',
      score: 0.25,
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
  const [personas, setPersonas] = useState<any[]>([]);
  const [loadingPersonas, setLoadingPersonas] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showPersonas, setShowPersonas] = useState(false);
  const [newTasks, setNewTasks] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);

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
    
    setIsCreating(true);
    setLoadingPersonas(true);
    
    // Simulate creating task and loading user personas
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create new task and add to top of list
    const newTask = {
      id: Date.now(),
      name: formData.title,
      description: formData.description,
      groups: formData.classificationGroup.split(',').map(g => g.trim()),
      date: new Date().toISOString().slice(0, 19).replace('T', ' '),
      username: 'analyst_01'
    };
    
    setNewTasks(prev => [newTask, ...prev]);
    setPersonas(mockUsers);
    setShowPersonas(true);
    setLoadingPersonas(false);
    setIsCreating(false);
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
              <div className="px-4 py-3">
                <div className="text-sm font-bold" style={{ color: '#1e3a8a' }}>Dr. Sarah Mitchell</div>
              </div>
              <SidebarGroupLabel>Previous Classifications</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {[...newTasks, ...previousTasks].map((task) => (
                    <SidebarMenuItem key={task.id}>
                      <Card 
                        className="m-2 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleTaskSelect(task)}
                      >
                        <CardContent className="p-3">
                          <div className="font-medium text-foreground mb-1">{task.name}</div>
                          <div className="text-xs text-muted-foreground leading-tight mb-2">
                            {task.description}
                          </div>
                          <div className="text-xs text-muted-foreground" style={{ fontSize: '10px' }}>
                            {new Date(task.date).toLocaleDateString()}
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
            <h1 className="text-4xl font-bold text-foreground">
              Analysis Console
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
                    disabled={!isFormValid || isCreating}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Creating...
                      </>
                     ) : (
                       'Create the Classification Task'
                     )}
                  </Button>
                </CardContent>
              </Card>

              {/* Randomized Candidates Panel */}
              {showPersonas && personas.length > 0 && !loadingPersonas && (
                <Card className="bg-card/50 backdrop-blur-sm border-muted shadow-glow h-[600px] flex flex-col">
                  <CardContent className="p-6 flex flex-col h-full">
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Randomized Candidates ({personas.length} candidates)
                    </h3>
                    
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
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

                            {/* Bottom section: Assigned Group and Alignment Score */}
                            <div className="flex items-start gap-4">
                              {/* Assigned Group */}
                              <div className="flex-1">
                                <span className="text-xs font-medium text-foreground block mb-1">Assigned Group:</span>
                                <Select defaultValue={user.score > 0.4 ? "Not Camping Enthusiast" : user.assignedGroup}>
                                  <SelectTrigger className="w-full h-7 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Camping Enthusiast">Camping Enthusiast</SelectItem>
                                    <SelectItem value="Not Camping Enthusiast">Not Camping Enthusiast</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              {/* Alignment Score */}
                              <div className="flex-shrink-0">
                                <span className="text-xs font-medium text-foreground block mb-1">Alignment Score:</span>
                                <span 
                                  className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                                    user.score >= 0.7 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                    user.score >= 0.4 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  }`}
                                >
                                  {(user.score * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                      disabled={loadingPersonas}
                    >
                      {loadingPersonas ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={16} />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2" size={16} />
                          Send Personalized Offers
                        </>
                      )}
                    </Button>
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