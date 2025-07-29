
import { useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAppContext } from '@/context/AppContext';
import UserNode from './UserNode';

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

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const nodeTypes = {
  user: UserNode,
};

const getNodeColor = (type: string): string => {
  switch (type) {
    case 'User':
      return '#3b82f6'; // blue
    case 'Task':
      return '#f97316'; // orange
    case 'Topic':
      return '#6b7280'; // gray
    case 'Object':
      return '#10b981'; // green
    default:
      return '#6b7280';
  }
};

// Convert graph data to React Flow format with hierarchical layout
const convertToReactFlowData = (graphData: GraphData) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Create a hierarchy map to position nodes
  const levelMap = new Map<string, number>();
  const processedNodes = new Set<string>();
  
  // Start with User nodes at level 0
  const userNodes = graphData.nodes.filter(n => n.type === 'User');
  userNodes.forEach(node => levelMap.set(node.id, 0));
  
  // Build levels based on edges
  let currentLevel = 0;
  const queue = [...userNodes.map(n => n.id)];
  
  while (queue.length > 0 && currentLevel < 10) {
    const currentLevelNodes = [...queue];
    queue.length = 0;
    
    currentLevelNodes.forEach(nodeId => {
      const connectedEdges = graphData.edges.filter(e => e.source === nodeId);
      connectedEdges.forEach(edge => {
        if (!levelMap.has(edge.target)) {
          levelMap.set(edge.target, currentLevel + 1);
          queue.push(edge.target);
        }
      });
    });
    
    currentLevel++;
  }

  // Group nodes by level for positioning
  const nodesByLevel = new Map<number, string[]>();
  levelMap.forEach((level, nodeId) => {
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)!.push(nodeId);
  });

  // Position nodes with user nodes directly above task nodes
  const taskNodes = graphData.nodes.filter(n => n.type === 'Task');
  
  graphData.nodes.forEach((graphNode) => {
    const level = levelMap.get(graphNode.id) || 0;
    const nodesAtLevel = nodesByLevel.get(level) || [];
    const nodeIndex = nodesAtLevel.indexOf(graphNode.id);
    const totalAtLevel = nodesAtLevel.length;
    
    let x: number;
    let y: number;
    
    if (graphNode.type === 'User' && taskNodes.length > 0) {
      // Position user node directly above the first task node
      const firstTaskNode = taskNodes[0];
      const taskLevel = levelMap.get(firstTaskNode.id) || 1;
      const taskNodesAtLevel = nodesByLevel.get(taskLevel) || [];
      const taskIndex = taskNodesAtLevel.indexOf(firstTaskNode.id);
      const totalTasksAtLevel = taskNodesAtLevel.length;
      
      // Calculate exact x position to match the task node + adjustment to align
      x = (taskIndex - (totalTasksAtLevel - 1) / 2) * 200 + 50; // Added +50 to align with task node
      y = level * 150;
    } else {
      // Regular positioning for other nodes
      x = (nodeIndex - (totalAtLevel - 1) / 2) * 200;
      y = level * 150;
    }

    const isUserNode = graphNode.type === 'User';
    
    nodes.push({
      id: graphNode.id,
      type: isUserNode ? 'user' : undefined,
      data: { 
        label: graphNode.label,
        type: graphNode.type
      },
      position: { x, y },
      style: isUserNode ? {
        background: 'transparent',
        border: 'none',
        padding: '0',
      } : {
        background: getNodeColor(graphNode.type),
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '10px',
        fontSize: '12px',
        fontWeight: 'bold',
        minWidth: '100px',
        textAlign: 'center',
      },
    });
  });

  // Create edges
  graphData.edges.forEach((graphEdge, index) => {
    edges.push({
      id: `edge-${index}`,
      source: graphEdge.source,
      target: graphEdge.target,
      label: graphEdge.label,
      type: 'straight',
      style: { 
        stroke: '#64748b',
        strokeWidth: 2,
      },
      labelStyle: {
        fontSize: '10px',
        fontWeight: 'bold',
        fill: '#475569',
      },
      labelBgStyle: {
        fill: 'white',
        fillOpacity: 0.8,
      },
    });
  });

  return { nodes, edges };
};

export const PersonaGraph = () => {
  const { userGraph } = useAppContext();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (userGraph) {
      const { nodes: flowNodes, edges: flowEdges } = convertToReactFlowData(userGraph);
      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [userGraph, setNodes, setEdges]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        style={{ background: 'transparent' }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e2e8f0" gap={20} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
};
