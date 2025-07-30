import { Task } from '@/components/TaskCard';

let BASE_URL = 'http://localhost:8000';

// Get current base URL
export const getBaseUrl = (): string => {
  const stored = localStorage.getItem('serverBaseUrl');
  return stored || BASE_URL;
};

// Set new base URL
export const setBaseUrl = (url: string): void => {
  BASE_URL = url;
  localStorage.setItem('serverBaseUrl', url);
};

// Initialize BASE_URL from localStorage on module load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('serverBaseUrl');
  if (stored) {
    BASE_URL = stored;
  }
}

export interface LoginResponse {
  username: string;
  full_name: string;
  age: number;
  gender: string;
  role: string;
  tasks?: {
    id: number;
    name: string;
    topics: string[];
  }[];
  classification_tasks?: {
    id: number;
    name: string;
    description: string;
    label1: string;
    label2: string;
    offer_message: string;
    date: string;
  }[];
}

interface GraphNode {
  id: string;
  label: string;
  type: string;
}

interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

interface UserGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}


export interface ChatInitResponse {
  session_id: string;
  task_id: number;
  task_name: string;
  user: {
    username: string;
    full_name: string;
    age: number;
    gender: string;
    role: string;
    persona_graph: UserGraph;
  };
  expires_in: number;
}


export const loginUser = async (username: string): Promise<LoginResponse> => {
  const currentBaseUrl = getBaseUrl();
  
  try {
    const response = await fetch(`${currentBaseUrl}/login?username=${username}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      mode: 'cors',
      // Add timeout for better error handling
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    
    const text = await response.text();
    console.log('Raw response:', text);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Login service not found (404). Please check server settings.`);
      } else if (response.status === 401 || response.status === 403) {
        throw new Error(`Invalid credentials (${response.status}). Please check your username.`);
      } else if (response.status === 500) {
        throw new Error(`Server error (500). Please try again later.`);
      } else {
        throw new Error(`Login failed with status: ${response.status}`);
      }
    }
    
    return JSON.parse(text);
  } catch (error: any) {
    // Handle network errors specifically
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please check your connection and try again.');
    } else if (error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
      throw new Error('Failed to fetch. Please check your internet connection or server settings.');
    } else {
      // Re-throw the original error if it's already a known error
      throw error;
    }
  }
};


export const initChat = async (username: string, task_id: number): Promise<ChatInitResponse> => {
  const currentBaseUrl = getBaseUrl();
  const response = await fetch(`${currentBaseUrl}/chat/init?username=${username}&task_id=${task_id}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    },
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error(`Chat init failed with status: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('Raw response:', data);
  return data;
};



// Synthetic function to simulate loading tasks
export const getTasks = async (): Promise<Task[]> => {
  const currentBaseUrl = getBaseUrl();
  const response = await fetch(`${currentBaseUrl}/tasks`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    },
    mode: 'cors',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks with status: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Map API response to Task interface
  return data.tasks.map((task: any) => ({
    id: task.id.toString(),
    title: task.name,
    description: task.description,
    icon: task.name === 'Content Consumption' ? '📚' : 
          task.name === 'Lifestyle Optimization' ? '🎯' : '🚀'
  }));
};

// Get persona graph from API
export const getPersonaGraph = async (username: string, taskId: number): Promise<UserGraph> => {
  const currentBaseUrl = getBaseUrl();
  const response = await fetch(`${currentBaseUrl}/persona_graph?username=${username}&task_id=${taskId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get persona graph: ${response.statusText}`);
  }

  const data = await response.json();
  return data.persona_graph;
};