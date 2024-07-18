// components/Notification.tsx

import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCircleCheck, faCircleXmark, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Remove notification after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  let styles: string;
  let icon: IconDefinition | null;

  switch (type) {
    case 'success':
      styles = 'bg-green-100 border border-green-400 text-green-700';
      icon = faCircleCheck;
      break;
    case 'error':
      styles = 'bg-red-100 border border-red-400 text-red-700';
      icon = faCircleXmark;
      break;
    case 'warning':
      styles = 'bg-orange-100 border border-orange-400 text-orange-700';
      icon = faCircleExclamation;
      break;
    default:
      styles = '';
      icon = null;
      break;
  }

  return (
    <div className={`mb-4 px-4 py-3 rounded relative ${styles}`} role="alert">
      <span className="flex items-center">
        {icon && <FontAwesomeIcon icon={icon} className="w-6 h-6 mr-2" />}
        {message}
      </span>
      <div className={`progress-bar-${type}`} />
    </div>
  );
};

export default Notification;
