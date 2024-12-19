import React, { useEffect, useRef, useState } from 'react';
import { Edit, Trash2, PauseCircle, CheckCircle, PlayCircle } from 'lucide-react';

interface JobActionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobStatus: 'active' | 'completed' | 'on-hold';
  buttonRef: React.RefObject<HTMLButtonElement>;
  onStatusChange: (jobId: string, newStatus: 'active' | 'completed' | 'on-hold') => void;
  onDeleteJob: (jobId: string) => void;
  onEditJob: (jobId: string) => void;
}

export function JobActionsMenu({ 
  isOpen, 
  onClose, 
  jobId, 
  jobStatus, 
  buttonRef,
  onStatusChange,
  onDeleteJob,
  onEditJob
}: JobActionsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<'top' | 'bottom'>('bottom');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && 
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        onClose();
        setShowDeleteConfirm(false);
      }
    };

    const updatePosition = () => {
      if (!buttonRef.current || !menuRef.current) return;

      const buttonRect = buttonRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - buttonRect.bottom;

      setMenuPosition(spaceBelow >= menuHeight ? 'bottom' : 'top');
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
      updatePosition();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen) return null;

  const handleDelete = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    onDeleteJob(jobId);
    onClose();
  };

  const statusMenuItems = {
    active: [
      {
        icon: PauseCircle,
        label: 'Put on Hold',
        onClick: () => onStatusChange(jobId, 'on-hold'),
        color: 'text-yellow-600'
      },
      {
        icon: CheckCircle,
        label: 'Mark as Completed',
        onClick: () => onStatusChange(jobId, 'completed'),
        color: 'text-green-600'
      }
    ],
    'on-hold': [
      {
        icon: PlayCircle,
        label: 'Resume Job',
        onClick: () => onStatusChange(jobId, 'active'),
        color: 'text-green-600'
      },
      {
        icon: CheckCircle,
        label: 'Mark as Completed',
        onClick: () => onStatusChange(jobId, 'completed'),
        color: 'text-green-600'
      }
    ],
    completed: [
      {
        icon: PlayCircle,
        label: 'Reactivate Job',
        onClick: () => onStatusChange(jobId, 'active'),
        color: 'text-green-600'
      },
      {
        icon: PauseCircle,
        label: 'Put on Hold',
        onClick: () => onStatusChange(jobId, 'on-hold'),
        color: 'text-yellow-600'
      }
    ]
  };

  const menuItems = [
    {
      icon: Edit,
      label: 'Edit Job',
      onClick: () => {
        onEditJob(jobId);
        onClose();
      },
      color: 'text-gray-700'
    },
    ...statusMenuItems[jobStatus].map(item => ({
      ...item,
      onClick: () => {
        item.onClick();
        onClose();
      }
    })),
    {
      icon: Trash2,
      label: showDeleteConfirm ? 'Click again to confirm' : 'Delete Job',
      onClick: handleDelete,
      color: 'text-red-600',
      isDanger: true
    }
  ];

  return (
    <div
      ref={menuRef}
      className={`
        absolute right-0 z-50 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
        ${menuPosition === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'}
      `}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="py-1" role="menu" aria-orientation="vertical">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={`
              w-full text-left px-4 py-2 text-sm flex items-center space-x-2
              ${item.color}
              ${item.isDanger ? 'hover:bg-red-50' : 'hover:bg-gray-50'}
              transition-colors duration-150
            `}
            role="menuitem"
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}