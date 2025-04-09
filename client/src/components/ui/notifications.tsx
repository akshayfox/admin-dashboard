import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, AlertCircle, Info } from "lucide-react";
import { useNotificationStore } from "@/stores/notification-store";

export function Notifications() {
  const { 
    notifications, 
    dismissNotification,
    clearAllNotifications
  } = useNotificationStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-md pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="pointer-events-auto"
          >
            <Notification 
              notification={notification} 
              onDismiss={() => dismissNotification(notification.id)} 
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

const Notification = ({ notification, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Auto-dismiss after timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onDismiss();
      }, 300); // Allow animation to complete
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onDismiss]);

  // Handle manual dismiss
  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  // Define icon based on type
  let Icon = Info;
  let iconClass = "text-blue-500 dark:text-blue-400";
  let bgClass = "bg-blue-100 dark:bg-blue-900";
  
  if (notification.type === "success") {
    Icon = Check;
    iconClass = "text-green-500 dark:text-green-400";
    bgClass = "bg-green-100 dark:bg-green-900";
  } else if (notification.type === "error") {
    Icon = AlertCircle;
    iconClass = "text-red-500 dark:text-red-400";
    bgClass = "bg-red-100 dark:bg-red-900";
  } else if (notification.type === "warning") {
    Icon = AlertCircle;
    iconClass = "text-amber-500 dark:text-amber-400";
    bgClass = "bg-amber-100 dark:bg-amber-900";
  }

  return (
    <div 
      className={`${
        isVisible ? 'opacity-100' : 'opacity-0'
      } transform transition-all duration-300 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <div className={`h-10 w-10 rounded-full ${bgClass} flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${iconClass}`} />
          </div>
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {notification.title}
          </p>
          {notification.message && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {notification.message}
            </p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={handleDismiss}
            className="inline-flex text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
