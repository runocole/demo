import { useState, useEffect } from 'react';

// --------------------
// NOTIFICATION INTERFACES
// --------------------
export interface Tool {
  id: string;
  name: string;
  code: string;
  stock: number;
  supplier?: string;
  supplier_name?: string;
  category?: string;
  invoice_no?: string;
  date_added?: string;
  updated_at?: string;
  description?: string;
  box_type?: string;
  expiry_date?: string;
  serials?: any;
}

export interface Notification {
  id: string;
  type: 'low_stock' | 'expiry';
  message: string;
  toolId: string;
  toolName: string;
  priority: 'high' | 'medium';
  timestamp: Date;
  read: boolean;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  showDropdown: boolean;
}

// --------------------
// NOTIFICATION HOOK
// --------------------
export const useNotifications = (tools: Tool[]) => {
  const [notificationState, setNotificationState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    showDropdown: false
  });

  useEffect(() => {
    if (tools.length === 0) return;

    const newNotifications: Notification[] = [];

    tools.forEach(tool => {
      // Low stock alerts (stock < 5)
      if (tool.stock < 5) {
        newNotifications.push({
          id: `low-stock-${tool.id}`,
          type: 'low_stock',
          message: `${tool.name} is running low (${tool.stock} items left)`,
          toolId: tool.id,
          toolName: tool.name,
          priority: 'high',
          timestamp: new Date(),
          read: false
        });
      }

      // Expiry date alerts (less than 2 weeks)
      if (tool.expiry_date) {
        const expiryDate = new Date(tool.expiry_date);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry <= 14 && daysUntilExpiry >= 0) {
          newNotifications.push({
            id: `expiry-${tool.id}`,
            type: 'expiry',
            message: `${tool.name} expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`,
            toolId: tool.id,
            toolName: tool.name,
            priority: daysUntilExpiry <= 7 ? 'high' : 'medium',
            timestamp: new Date(),
            read: false
          });
        }
        
        // Already expired
        if (daysUntilExpiry < 0) {
          newNotifications.push({
            id: `expired-${tool.id}`,
            type: 'expiry',
            message: `${tool.name} has expired ${Math.abs(daysUntilExpiry)} day${Math.abs(daysUntilExpiry) !== 1 ? 's' : ''} ago`,
            toolId: tool.id,
            toolName: tool.name,
            priority: 'high',
            timestamp: new Date(),
            read: false
          });
        }
      }
    });

    // Sort by priority and timestamp
    newNotifications.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    setNotificationState(prev => ({
      ...prev,
      notifications: newNotifications,
      unreadCount: newNotifications.filter(n => !n.read).length
    }));
  }, [tools]);

  const toggleNotificationDropdown = () => {
    setNotificationState(prev => ({
      ...prev,
      showDropdown: !prev.showDropdown
    }));
  };

  const markAsRead = (notificationId: string) => {
    setNotificationState(prev => ({
      ...prev,
      notifications: prev.notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ),
      unreadCount: prev.notifications.filter(n => !n.read && n.id !== notificationId).length
    }));
  };

  const markAllAsRead = () => {
    setNotificationState(prev => ({
      ...prev,
      notifications: prev.notifications.map(notif => ({ ...notif, read: true })),
      unreadCount: 0
    }));
  };

  const closeDropdown = () => {
    setNotificationState(prev => ({
      ...prev,
      showDropdown: false
    }));
  };

  return {
    notificationState,
    toggleNotificationDropdown,
    markAsRead,
    markAllAsRead,
    closeDropdown
  };
};