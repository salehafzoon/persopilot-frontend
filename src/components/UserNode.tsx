import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { User } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

interface UserNodeProps {
  data: {
    label: string;
    type: string;
  };
}

const UserNode = memo(({ data }: UserNodeProps) => {
  const { userId } = useAppContext();

  return (
    <div className="flex flex-col items-center">
      {/* User ID above the icon */}
      <div className="text-xs text-muted-foreground mb-2 font-medium">
        {userId}
      </div>
      
      {/* Circled user icon */}
      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
        <User size={24} className="text-white" />
      </div>
      
      {/* Handles for connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-blue-500 border-none"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-blue-500 border-none"
      />
    </div>
  );
});

UserNode.displayName = 'UserNode';

export default UserNode;