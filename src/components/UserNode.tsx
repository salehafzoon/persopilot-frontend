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
  const { userName } = useAppContext();

  return (
    <div className="flex flex-col items-center">
      {/* Larger circled user icon with user name inside */}
      <div className="w-20 h-20 rounded-full bg-blue-500 flex flex-col items-center justify-center">
        <User size={24} className="text-white mb-1" />
        <div className="text-xs text-white font-medium text-center px-1">
          {userName}
        </div>
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