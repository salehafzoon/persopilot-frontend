import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, LogIn, Settings, Wifi, WifiOff } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { loginUser, LoginResponse, getBaseUrl, setBaseUrl } from '@/services/api';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverAddress, setServerAddress] = useState(getBaseUrl());
  const [serverDialogOpen, setServerDialogOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check for internet connectivity
    if (!navigator.onLine) {
      setError('No internet connection. Please check your network and try again.');
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "You appear to be offline. Please check your internet connection.",
      });
      return;
    }

    try {
      const userData = await loginUser(username);
      localStorage.setItem('userData', JSON.stringify(userData));

      if (userData.role === 'user') {
        navigate('/chat');
      } else if (userData.role === 'analyst') {
        // For now, just pass
        navigate('/console');
      } else {
        setError('Unknown user role');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        setError('Unable to connect to server. Please check your internet connection or server settings.');
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: "Cannot reach the server. Please verify your connection and server settings.",
        });
      } else if (error.message?.includes('500')) {
        setError('Server error occurred. Please try again later.');
        toast({
          variant: "destructive",
          title: "Server Error",
          description: "The server encountered an error. Please try again.",
        });
      } else if (error.message?.includes('404')) {
        setError('Login service not found. Please check server settings.');
        toast({
          variant: "destructive",
          title: "Service Not Found",
          description: "The login service could not be found on the server.",
        });
      } else if (error.message?.includes('401') || error.message?.includes('403')) {
        setError('Invalid username or password.');
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: "Please check your credentials and try again.",
        });
      } else {
        setError('Login failed. Please try again.');
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleServerSettingsSave = () => {
    setBaseUrl(serverAddress);
    setServerDialogOpen(false);
    toast({
      title: "Settings Saved",
      description: "Server address has been updated successfully.",
    });
  };

  // Listen for online/offline events
  useState(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connection Restored",
        description: "You are back online.",
      });
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        variant: "destructive",
        title: "Connection Lost",
        description: "You appear to be offline.",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Header with Server Settings and Theme Toggle */}
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center gap-3">
          {/* Connection Status Indicator */}
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-destructive" />
            )}
            <span className="text-xs text-muted-foreground">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
        <Dialog open={serverDialogOpen} onOpenChange={setServerDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
              <Settings className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Server settings</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Server Settings</DialogTitle>
              <DialogDescription>
                Configure the server address for API connections.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="server-address" className="text-right">
                  Server Address
                </Label>
                <Input
                  id="server-address"
                  value={serverAddress}
                  onChange={(e) => setServerAddress(e.target.value)}
                  placeholder="https://example.ngrok-free.app"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleServerSettingsSave}>Save settings</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-bold text-foreground mb-4">
            Welcome to PersoPilot
          </h1>
          <p className="text-xl text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-muted shadow-glow animate-slide-up">
          <CardHeader className="text-center">
            <div className="text-4xl mb-4">🔐</div>
            <CardTitle className="text-2xl font-semibold text-foreground">
              Sign In
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your credentials to access PersoPilot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-foreground">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle size={16} className="text-destructive" />
                  <span className="text-sm text-destructive">{error}</span>
                </div>
              )}

              {/* Offline Warning */}
              {!isOnline && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <WifiOff size={16} className="text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm text-yellow-700 dark:text-yellow-300">
                    You are currently offline. Login will not work until connection is restored.
                  </span>
                </div>
              )}

              {/* Login Button */}
              <Button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-800 text-white" 
                disabled={loading || !username || !password || !isOnline}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={16} className="mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">Demo Credentials:</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• <strong>user_01</strong> + <strong>pass1</strong> → User Panel</div>
                <div>• <strong>analyst_01</strong> + <strong>pass2</strong> → Analyst Panel</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-muted-foreground text-sm">
          © 2025 PersoPilot AI
        </p>
      </footer>
    </div>
  );
};

export default Index;
