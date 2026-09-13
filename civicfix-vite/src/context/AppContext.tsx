import React, { createContext, useContext, useState, useEffect } from 'react';
import { Issue, initialIssues } from '../data/mockIssues';

export type Notification = {
  id: string;
  message: string;
  issueId: string;
  date: string;
  read: boolean;
};

type AppContextType = {
  user: { role: string } | null;
  login: (role: string) => void;
  logout: () => void;
  issues: Issue[];
  addIssue: (issue: Issue) => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  notifications: Notification[];
  addNotification: (message: string, issueId: string) => void;
  markNotificationRead: (id: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ role: string } | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('civicfix_user_vite');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedIssues = localStorage.getItem('civicfix_issues_vite');
    if (savedIssues) {
      setIssues(JSON.parse(savedIssues));
    } else {
      setIssues(initialIssues);
      localStorage.setItem('civicfix_issues_vite', JSON.stringify(initialIssues));
    }
    
    const savedNotifs = localStorage.getItem('civicfix_notifications_vite');
    if (savedNotifs) {
      setNotifications(JSON.parse(savedNotifs));
    }
  }, []);

  const login = (role: string) => {
    const userData = { role };
    setUser(userData);
    localStorage.setItem('civicfix_user_vite', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('civicfix_user_vite');
  };

  const addIssue = (newIssue: Issue) => {
    const updatedIssues = [newIssue, ...issues];
    setIssues(updatedIssues);
    localStorage.setItem('civicfix_issues_vite', JSON.stringify(updatedIssues));
  };

  const updateIssue = (id: string, updates: Partial<Issue>) => {
    const updatedIssues = issues.map(issue => 
      issue.id === id ? { ...issue, ...updates } : issue
    );
    setIssues(updatedIssues);
    localStorage.setItem('civicfix_issues_vite', JSON.stringify(updatedIssues));
  };

  const addNotification = (message: string, issueId: string) => {
    const newNotif = {
      id: Date.now().toString(),
      message,
      issueId,
      date: new Date().toLocaleString(),
      read: false
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    localStorage.setItem('civicfix_notifications_vite', JSON.stringify(updatedNotifs));
  };

  const markNotificationRead = (id: string) => {
    const updatedNotifs = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifs);
    localStorage.setItem('civicfix_notifications_vite', JSON.stringify(updatedNotifs));
  };

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      issues,
      addIssue,
      updateIssue,
      notifications,
      addNotification,
      markNotificationRead
    }}>
      {children}
    </AppContext.Provider>
  );
};
