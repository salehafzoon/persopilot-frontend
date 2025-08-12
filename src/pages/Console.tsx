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
import { create_update_ClassificationTask, sendPersonalizedOffers, deleteClassificationTask, getClassificationResults, ClassificationResultsResponse } from '@/services/api';
import { ClassificationResults } from '@/components/ClassificationResults';

const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

const Console = () => {
  const navigate = useNavigate();
  const previousTasks = getUserData()?.classification_tasks || [];

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

  const [sendingOffers, setSendingOffers] = useState(false);
  const [showOffersDialog, setShowOffersDialog] = useState(false);
  const [offersResponse, setOffersResponse] = useState<any>(null);
  const [classificationResults, setClassificationResults] = useState<ClassificationResultsResponse | null>(null);
  const [loadingResults, setLoadingResults] = useState(false);

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.classificationGroup || !formData.offerMessage) {
      return;
    }
    
    setIsCreating(true);
    setLoadingPersonas(true);
    
    try {
      const userData = getUserData();
      const username = userData?.username;
      
      const taskData = {
        name: formData.title,
        description: formData.description,
        label1: formData.classificationGroup,
        label2: `Non- ${formData.classificationGroup}`,
        offer_message: formData.offerMessage,
        ...(isEditing && selectedTask && { id: selectedTask.id })
      };

      const response = await create_update_ClassificationTask(username, taskData);
      
      const usersWithAssignedGroup = response.labeled_users.map(user => ({
        ...user,
        assignedGroup: user.score >= 0.5 ? formData.classificationGroup : `Non- ${formData.classificationGroup}`
      }));

      setPersonas(usersWithAssignedGroup);
      
      if (!isEditing) {
        // Only add to newTasks for new task creation
        const newTask = {
          id: response.id,
          name: formData.title,
          description: formData.description,
          label1: formData.classificationGroup,
          label2: `Non- ${formData.classificationGroup}`,
          offer_message: formData.offerMessage,
          date: new Date().toISOString().slice(0, 19).replace('T', ' '),
          username: username
        };
        
        setNewTasks(prev => [newTask, ...prev]);
      } else {
        // When editing, update the task in the appropriate list
        if (selectedTask) {
          const updatedTask = {
            ...selectedTask,
            name: formData.title,
            description: formData.description,
            label1: formData.classificationGroup,
            label2: `Non- ${formData.classificationGroup}`,
            offer_message: formData.offerMessage,
          };
          
          // Check if it's in newTasks, if so update it there
          const isInNewTasks = newTasks.some(task => task.id === selectedTask.id);
          if (isInNewTasks) {
            setNewTasks(prev => prev.map(task => 
              task.id === selectedTask.id ? updatedTask : task
            ));
          }
          
          // Update selectedTask to reflect changes immediately
          setSelectedTask(updatedTask);
        }
      }
      
    } catch (error) {
      console.error('Failed to create classification task:', error);
    }
    
    setShowPersonas(true);
    setLoadingPersonas(false);
    setIsCreating(false);
    
    if (isEditing) {
      setIsEditing(false);
    }
  };

  const isFormValid = formData.title.trim() && formData.description.trim() && 
                     formData.classificationGroup.trim() && formData.offerMessage.trim();

  const handleTaskSelect = async (task: any) => {
    setSelectedTask(task);
    setIsEditing(false);
    setClassificationResults(null);
    setShowPersonas(false); // Hide randomized candidates when selecting another task
    
    // Load classification results for the selected task
    setLoadingResults(true);
    try {
      const results = await getClassificationResults(task.id);
      setClassificationResults(results);
    } catch (error) {
      console.error('Failed to load classification results:', error);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedTask(null);
    setIsEditing(false);
    setFormData({
      title: '',
      description: '',
      classificationGroup: '',
      offerMessage: ''
    });
  };

  const handleEditTask = (task: any) => {
    setIsEditing(true);
    setFormData({
      title: task.name,
      description: task.description,
      classificationGroup: task.label1,
      offerMessage: task.offer_message || "Join our exclusive program!"
    });
  };

  const handleDeleteTask = async () => {
    if (selectedTask) {
      try {
        await deleteClassificationTask(selectedTask.id);
        
        // Remove from UI after successful API call
        setNewTasks(prev => prev.filter(task => task.id !== selectedTask.id));
        setDeletedTaskIds(prev => [...prev, selectedTask.id]);
        setSelectedTask(null);
        setShowPersonas(false);
        setIsEditing(false);
        setFormData({
          title: '',
          description: '',
          classificationGroup: '',
          offerMessage: ''
        });
      } catch (error) {
        console.error('Failed to delete task:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
    setShowDeleteDialog(false);
  };


  const handleGroupChange = (userIndex: number, newGroup: string) => {
    setPersonas(prev => prev.map((user, index) => 
      index === userIndex ? { ...user, assignedGroup: newGroup } : user
    ));
  };

  const handleSendOffers = async () => {
    if (!selectedTask && newTasks.length === 0) return;
    
    setSendingOffers(true);
    
    try {
      const taskId = selectedTask?.id || newTasks[0]?.id;
      
      // Send offers only to users assigned to the positive group
      const usernames = personas
        .filter(user => user.assignedGroup === formData.classificationGroup)
        .map(user => user.username);
      
      const response = await sendPersonalizedOffers(taskId, usernames);
      console.log('Offers sent:', response);
      
      setOffersResponse(response);
      setShowOffersDialog(true);
      
      // Hide the candidates section after sending offers
      setShowPersonas(false);
      
    } catch (error) {
      console.error('Failed to send offers:', error);
      setOffersResponse({
        message: 'Failed to send offers. Please try again.',
        sent_to: [],
        already_have_offer: []
      });
      setShowOffersDialog(true);
      
      // Hide the candidates section even on error
      setShowPersonas(false);
    }
    
    setSendingOffers(false);
  };



  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-gradient-subtle">
        {/* Sidebar */}
        <Sidebar className="border-r border-muted">
          <SidebarContent>
            <SidebarGroup>
              <div className="px-4 py-3">
                <div className="text-sm font-bold" style={{ color: '#1e3a8a' }}>{getUserData()?.full_name}</div>
              </div>
              <SidebarGroupLabel>Previous Classifications</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {[
                    ...newTasks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), 
                    ...previousTasks
                      .filter(task => !deletedTaskIds.includes(task.id))
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  ].map((task) => (
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
        <div className="flex-1 flex flex-col bg-background">
          {/* Fixed Header */}
          <div className="sticky top-0 z-50 bg-background p-6 border-b border-muted backdrop-blur-sm">
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
      <div className="overflow-y-auto p-6 bg-background">
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
                  className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground h-12"
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

                {/* Layout with Description (75%) and Classification Groups (25%) */}
                <div className="flex gap-8 mb-8">
                  {/* Task Description - 75% */}
                  <div className="w-3/4">
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Description
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedTask.description}
                    </p>
                  </div>

                  {/* Classification Groups - 25% */}
                  <div className="w-1/4">
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Classification Groups
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                        {selectedTask.label1}
                      </div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-secondary/10 text-secondary-foreground border border-secondary/20">
                        {selectedTask.label2}
                      </div>
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

          {/* Classification Results - shown when a task is selected */}
          {selectedTask && !isEditing && (
            <div className="mt-8">
              {loadingResults ? (
                <Card className="bg-card/50 backdrop-blur-sm border-muted shadow-glow">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin mr-3" />
                      <span className="text-lg text-muted-foreground">Loading classification results...</span>
                    </div>
                  </CardContent>
                </Card>
              ) : classificationResults ? (
                <ClassificationResults 
                  accuracyMetrics={classificationResults.accuracy_metrics}
                  offerStatistics={classificationResults.offer_statistics}
                  predictionDetails={classificationResults.accuracy_metrics?.prediction_details || []}
                  predictions={classificationResults.predictions || []}
                  classificationTaskId={selectedTask?.id}
                  hideRecentPredictions={showPersonas} // Hide recent predictions when showing candidates
                  onResultsUpdate={(data) => {
                    if (classificationResults) {
                      setClassificationResults({
                        ...classificationResults,
                        accuracy_metrics: data.accuracyMetrics || classificationResults.accuracy_metrics,
                        offer_statistics: data.offerStatistics,
                        predictions: data.predictions as any[] || []
                      });
                    }
                  }}
                />
              ) : (
                <Card className="bg-card/50 backdrop-blur-sm border-muted shadow-glow">
                  <CardContent className="p-8">
                    <div className="text-center text-muted-foreground">
                      No classification results available for this task.
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Randomized Candidates Panel - shown after any task creation/update */}
          {showPersonas && personas.length > 0 && !loadingPersonas && (
            <Card className="bg-card/50 backdrop-blur-sm border-muted shadow-glow h-[600px] flex flex-col mt-8">
              <CardContent className="p-6 flex flex-col h-full">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Randomized Candidates ({personas.length} candidates)
                </h3>
                
                <div className="flex-1 overflow-y-auto mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    {personas.map((user, index) => (
                      <Card 
                        key={user.username} 
                        className="transition-all duration-200 bg-card hover:shadow-md"
                      >
                        <CardContent className="p-4">
                          {/* User ID/Avatar */}
                          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-muted">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                              <User size={16} className="text-muted-foreground" />
                            </div>
                            <span className="font-mono text-sm font-bold text-foreground">
                              {user.username}
                            </span>
                          </div>

                          {/* User Name */}
                          <div className="mb-3">
                            <div className="text-sm font-medium text-foreground">{user.full_name}</div>
                            <div className="flex items-center gap-4 text-xs font-medium text-blue-600 dark:text-blue-400">
                              <span>Age: {user.age}</span>
                              <span>Gender: {user.gender}</span>
                            </div>
                          </div>

                          {/* Reasoning */}
                          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            {user.reasoning}
                          </p>

                          {/* Bottom section: Assigned Group and Alignment Score */}
                          <div className="flex items-start gap-4">
                            {/* Assigned Group */}
                            <div className="flex-1">
                              <span className="text-xs font-medium text-foreground block mb-1">Assigned Group:</span>
                              <Select 
                                value={user.assignedGroup || (user.score >= 0.5 ? formData.classificationGroup : `Non- ${formData.classificationGroup}`)}
                                onValueChange={(value) => handleGroupChange(index, value)}
                              >
                                <SelectTrigger className="w-full h-7 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={formData.classificationGroup}>{formData.classificationGroup}</SelectItem>
                                  <SelectItem value={`Non- ${formData.classificationGroup}`}> Non- {formData.classificationGroup}</SelectItem>
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
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={sendingOffers}
                  onClick={handleSendOffers}
                >
                  {sendingOffers ? (
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

      {/* Offers Result Dialog */}
      <AlertDialog open={showOffersDialog} onOpenChange={setShowOffersDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Offers Status
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              {offersResponse?.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4">
            {/* Successfully sent offers */}
            {offersResponse?.sent_to && offersResponse.sent_to.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Successfully Sent ({offersResponse.sent_to.length} users)
                </h4>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                  <div className="flex flex-wrap gap-2">
                    {offersResponse.sent_to.map((username: string) => (
                      <span key={username} className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 text-xs rounded-full font-mono">
                        {username}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Users who already have offers */}
            {offersResponse?.already_have_offer && offersResponse.already_have_offer.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-orange-600" />
                  Already Have Offers ({offersResponse.already_have_offer.length} users)
                </h4>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-md">
                  <div className="flex flex-wrap gap-2">
                    {offersResponse.already_have_offer.map((username: string) => (
                      <span key={username} className="px-2 py-1 bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-100 text-xs rounded-full font-mono">
                        {username}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowOffersDialog(false)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default Console;