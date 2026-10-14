import React, { createContext, useContext, useState, useEffect } from 'react';
import { InAppNotification } from '@/types';
import { demoStore } from '@/lib/demo/demoStore';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface NotificationContextType {
  notifications: InAppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  sendNotification: (
    title: string,
    message: string,
    type: InAppNotification['type'],
    linkUrl?: string
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);

  useEffect(() => {
    // Load notifications for active user
    const notifs = demoStore.getNotifications(user?.id);
    setNotifications(notifs);
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = (id: string) => {
    demoStore.markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllAsRead = () => {
    notifications.forEach((n) => {
      if (!n.is_read) demoStore.markNotificationAsRead(n.id);
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const sendNotification = (
    title: string,
    message: string,
    type: InAppNotification['type'],
    linkUrl?: string
  ) => {
    if (!user) return;
    demoStore.addNotification(user.id, title, message, type, linkUrl);
    setNotifications(demoStore.getNotifications(user.id));
    toast.info(title, {
      description: message,
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        sendNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
