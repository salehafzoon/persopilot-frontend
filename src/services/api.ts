import { Task } from '@/components/TaskCard';

let BASE_URL = 'https://9e5f6543f808.ngrok-free.app';

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
  const response = await fetch(`${currentBaseUrl}/login?username=${username}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    },
    mode: 'cors',
  });
  
  const text = await response.text();
  console.log('Raw response:', text);
  
  if (!response.ok) {
    throw new Error(`Login failed with status: ${response.status}`);
  }
  
  return JSON.parse(text);
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
  
  return await response.json();
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

// Synthetic function to simulate getting user graph
export const getUserGraph = async (userId: string, taskTitle: string): Promise<UserGraph> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return task-specific graph data
  const baseGraph = {
    nodes: [
      { id: userId, label: userId, type: "User" },
      { id: taskTitle, label: taskTitle, type: "Task" },
    ],
    edges: [
      { source: userId, target: taskTitle, label: "has_task" },
    ]
  };

  // Add task-specific nodes and edges
  if (taskTitle === 'Lifestyle Optimization') {
    baseGraph.nodes.push(
      { id: "Exercise", label: "Exercise", type: "Topic" },
      { id: "jogging", label: "jogging", type: "Object" },
      { id: "Skill", label: "Skill", type: "Topic" },
      { id: "meditate", label: "meditate", type: "Object" }
    );
    baseGraph.edges.push(
      { source: taskTitle, target: "Exercise", label: "has_topic" },
      { source: "Exercise", target: "jogging", label: "has_hobby" },
      { source: taskTitle, target: "Skill", label: "has_topic" },
      { source: "Skill", target: "meditate", label: "has_ability" }
    );
  } else if (taskTitle === 'Content Consumption') {
    baseGraph.nodes.push(
      { id: "Reading", label: "Reading", type: "Topic" },
      { id: "articles", label: "articles", type: "Object" },
      { id: "Learning", label: "Learning", type: "Topic" },
      { id: "tutorials", label: "tutorials", type: "Object" }
    );
    baseGraph.edges.push(
      { source: taskTitle, target: "Reading", label: "has_topic" },
      { source: "Reading", target: "articles", label: "prefers" },
      { source: taskTitle, target: "Learning", label: "has_topic" },
      { source: "Learning", target: "tutorials", label: "enjoys" }
    );
  } else if (taskTitle === 'Career Development') {
    baseGraph.nodes.push(
      { id: "Skills", label: "Skills", type: "Topic" },
      { id: "programming", label: "programming", type: "Object" },
      { id: "Networking", label: "Networking", type: "Topic" },
      { id: "conferences", label: "conferences", type: "Object" }
    );
    baseGraph.edges.push(
      { source: taskTitle, target: "Skills", label: "has_topic" },
      { source: "Skills", target: "programming", label: "developing" },
      { source: taskTitle, target: "Networking", label: "has_topic" },
      { source: "Networking", target: "conferences", label: "attends" }
    );
  }

  return baseGraph;
};