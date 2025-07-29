import { useState } from 'react';
import { ArrowLeft, Loader2, CheckCircle, User, Send, Menu, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
      label1: 'Camping Enthusiast',
      label2: 'Not Camping Enthusiast',
      offer_message: 'Join our exclusive camping adventure program! Get personalized gear recommendations and access to premium outdoor experiences.',
      date: '2024-01-15 10:30:00',
      username: 'analyst_01'
    },
    {
      id: 2,
      name: 'FitnessEnthusiast',
      description: 'Whether or not a user is actively engaged in fitness and exercise routines',
      label1: 'Fitness Enthusiast',
      label2: 'Not Fitness Enthusiast',
      offer_message: 'Get access to premium workout plans and exclusive fitness gear discounts!',
      date: '2024-01-12 14:20:00',
      username: 'analyst_01'
    },
    {
      id: 3,
      name: 'TechSavvy',
      description: 'Whether or not a user shows high interest in technology and digital innovations',
      label1: 'Tech Savvy',
      label2: 'Not Tech Savvy',
      offer_message: 'Be the first to access cutting-edge tech products and exclusive beta testing opportunities!',
      date: '2024-01-10 09:15:00',
      username: 'analyst_01'
    },
    {
      id: 4,
      name: 'FoodieClassifier',
      description: 'Whether or not a user is passionate about food experiences and cooking',
      label1: 'Foodie',
      label2: 'Not Foodie',
      offer_message: 'Discover exclusive culinary experiences and premium kitchen equipment at special rates!',
      date: '2024-01-08 16:45:00',
      username: 'analyst_01'
    },
    {
      id: 5,
      name: 'TravelEnthusiast',
      description: 'Whether or not a user frequently travels and seeks new travel experiences',
      label1: 'Travel Enthusiast',
      label2: 'Not Travel Enthusiast',
      offer_message: 'Unlock exclusive travel deals and unique destination experiences worldwide!',
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
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletedTaskIds, setDeletedTaskIds] = useState<number[]>([]);

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
    
    // Simulate creating/updating task and loading user personas
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (isEditing) {
      // If editing, just update the existing task (no need to add to menu)
      // In a real app, this would update the task in the backend
      console.log('Updating existing task:', formData);
    } else {
      // If creating new task, add to top of list
      const newTask = {
        id: Date.now(),
        name: formData.title,
        description: formData.description,
        label1: formData.classificationGroup,
        label2: `Not ${formData.classificationGroup}`,
        offer_message: formData.offerMessage,
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        username: 'analyst_01'
      };
      
      setNewTasks(prev => [newTask, ...prev]);
    }
    
    // Show personas for both create and edit scenarios
    setPersonas(mockUsers);
    setShowPersonas(true);
    setLoadingPersonas(false);
    setIsCreating(false);
    
    // Exit edit mode if we were editing
    if (isEditing) {
      setIsEditing(false);
      setSelectedTask(null);
    }
  };

  const isFormValid = formData.title.trim() && formData.description.trim() && 
                     formData.classificationGroup.trim() && formData.offerMessage.trim();

  // Handle task selection from sidebar
  const handleTaskSelect = (task: any) => {
    setSelectedTask(task);
    setIsEditing(false);
  };

  // Handle creating new task
  const handleCreateNew = () => {
    setSelectedTask(null);
    setIsEditing(false);
    // Reset form
    setFormData({
      title: '',
      description: '',
      classificationGroup: '',
      offerMessage: ''
    });
  };

  // Handle editing a task
  const handleEditTask = (task: any) => {
    setIsEditing(true);
    setFormData({
      title: task.name,
      description: task.description,
      classificationGroup: task.label1,
      offerMessage: task.offer_message || "Join our exclusive camping adventure program! Get personalized gear recommendations and access to premium outdoor experiences."
    });
  };

  // Handle deleting a task
  const handleDeleteTask = () => {
    if (selectedTask) {
      // Remove from newTasks if it exists there
      setNewTasks(prev => prev.filter(task => task.id !== selectedTask.id));
      
      // Add to deleted tasks list to filter out from previousTasks
      setDeletedTaskIds(prev => [...prev, selectedTask.id]);
      
      // Clear selected task and show create form
      setSelectedTask(null);
      setShowPersonas(false);
      setIsEditing(false);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        classificationGroup: '',
        offerMessage: ''
      });
    }
    setShowDeleteDialog(false);
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
                  {[...newTasks, ...previousTasks.filter(task => !deletedTaskIds.includes(task.id))].map((task) => (
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
          {/* Create/Edit Form OR Task Details View */}
          {(!selectedTask || isEditing) ? (
            /* Create Classification Task Form */
            <Card className="bg-card/50 backdrop-blur-sm border-muted shadow-glow">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-foreground mb-8">
                  {isEditing ? 'Edit Classification Task' : 'Create Classification Task'}
                </h2>

                {/* Form Fields */}
                <div className="space-y-6">
                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Task Name
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      placeholder="e.g., CampingAffinity"
                      className="w-full"
                    />
                  </div>

                  {/* Description Input */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description
                    </label>
                    <Input
                      value={formData.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      placeholder="Describe what this classification task identifies..."
                      className="w-full"
                    />
                  </div>

                  {/* Classification Groups */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Classification Groups
                    </label>
                    <div className="flex items-center gap-4">
                      <Input
                        value={formData.classificationGroup}
                        onChange={(e) => handleFormChange('classificationGroup', e.target.value)}
                        placeholder="e.g., Camping Enthusiast"
                        className="w-1/2"
                      />
                      <div className="flex gap-2">
                        <div className="px-3 py-1 bg-black text-white text-sm rounded-md">
                          {formData.classificationGroup || "Group A"}
                        </div>
                        <div className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md">
                          {formData.classificationGroup ? `Non-${formData.classificationGroup}` : "Non-Group A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Offer Message */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Offer Message
                    </label>
                    <Input
                      value={formData.offerMessage}
                      onChange={(e) => handleFormChange('offerMessage', e.target.value)}
                      placeholder="Message to send to classified users..."
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  onClick={handleSubmit}
                  disabled={!isFormValid || isCreating}
                  className="w-full mt-8 bg-primary hover:bg-primary/90 text-white h-12"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </>
                   ) : (
                     isEditing ? 'Update Classification Task' : 'Create the Classification Task'
                   )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Task Details View - when a task is selected and not editing */
            <Card className="bg-card/50 backdrop-blur-sm border-muted shadow-glow relative">
              <CardContent className="p-8">
                {/* Delete and Edit buttons in corners with bigger size and margin */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-6 left-6 h-10 w-10 p-0 hover:bg-red-100 hover:text-red-600"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 size={20} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-6 right-6 h-10 w-10 p-0 hover:bg-muted"
                  onClick={() => handleEditTask(selectedTask)}
                >
                  <Edit size={20} />
                </Button>

                {/* Task Name with more top margin */}
                <div className="mb-6 mt-8">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {selectedTask.name}
                  </h2>
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                      {selectedTask.label1}
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-secondary/10 text-secondary-foreground border border-secondary/20">
                      {selectedTask.label2}
                    </div>
                  </div>
                </div>

                {/* Offer Message */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Offer Message
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedTask.offer_message}
                  </p>
                </div>

                {/* Creation Date & Time */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Created
                  </h3>
                  <p className="text-muted-foreground">
                    {new Date(selectedTask.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} at {new Date(selectedTask.date).toLocaleTimeString('en-US', {
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
                    
                    <div className="flex-1 overflow-y-auto mb-4">
                      <div className="grid grid-cols-2 gap-4">
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Classification Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedTask?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTask}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default Console;