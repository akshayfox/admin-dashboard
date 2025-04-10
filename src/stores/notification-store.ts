import { create } from 'zustand';
import { nanoid } from 'nanoid';

export type NotificationType = 'info' | 'success' | 'error' | 'warning';

export interface Notification {
  id: string;
  title: string;
  message?: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
}

interface NotificationState {
  notifications: Notification[];
  enableNotifications: boolean;
  showNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void;
  dismissNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  toggleNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  enableNotifications: true,
  
  showNotification: (notification) => {
    const id = nanoid();
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id,
          isRead: false,
          createdAt: new Date()
        }
      ]
    }));
    
    // Auto remove notification after 6 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      }));
    }, 6000);
  },
  
  dismissNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    }));
  },
  
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    }));
  },
  
  clearAllNotifications: () => {
    set({ notifications: [] });
  },
  
  toggleNotifications: () => {
    set((state) => ({
      enableNotifications: !state.enableNotifications
    }));
  }
}));
