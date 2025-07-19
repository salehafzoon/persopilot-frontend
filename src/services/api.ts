import { Task } from '@/components/TaskCard';

// Synthetic function to simulate loading tasks
export const getTasks = async (): Promise<Task[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: 'content',
      title: 'Content Consumption',
      description: 'Get personalized recommendations for articles, videos, and learning resources tailored to your interests.',
      icon: '📚'
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle Optimization',
      description: 'Receive guidance on health, fitness, productivity, and daily routines to enhance your well-being.',
      icon: '🎯'
    },
    {
      id: 'career',
      title: 'Career Development',
      description: 'Access career advice, skill development plans, and professional growth strategies.',
      icon: '🚀'
    }
  ];
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