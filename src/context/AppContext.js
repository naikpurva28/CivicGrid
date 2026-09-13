"use client";
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { mumbaiIssues } from '@/lib/mumbaiSeedData';
import { computeClusters } from '@/lib/clusteringEngine';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { role: 'citizen' | 'authority' }
  const [issues, setIssues] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Dynamically compute 1km geospatial clusters whenever issues array changes
  const clusterData = useMemo(() => {
    return computeClusters(issues || [], 1000);
  }, [issues]);

  // Fetch initial issues & notifications from backend API on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('civicfix_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    async function loadBackendData() {
      try {
        const res = await fetch('/api/issues', { cache: 'no-store' });
        const data = await res.json();
        if (data && data.success && Array.isArray(data.issues)) {
          setIssues(data.issues);
          localStorage.setItem('civicfix_issues', JSON.stringify(data.issues));
        } else {
          setIssues([]);
          localStorage.setItem('civicfix_issues', JSON.stringify([]));
        }
      } catch (err) {
        console.warn('Backend issues fetch error:', err);
        setIssues([]);
      }

      try {
        const notifRes = await fetch('/api/notifications', { cache: 'no-store' });
        const notifData = await notifRes.json();
        if (notifData && notifData.success && Array.isArray(notifData.notifications)) {
          setNotifications(notifData.notifications);
          localStorage.setItem('civicfix_notifications', JSON.stringify(notifData.notifications));
        } else {
          setNotifications([]);
          localStorage.setItem('civicfix_notifications', JSON.stringify([]));
        }
      } catch (err) {
        setNotifications([]);
      }
    }

    loadBackendData();
  }, []);

  const login = async (role) => {
    const userData = { role };
    setUser(userData);
    localStorage.setItem('civicfix_user', JSON.stringify(userData));

    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
    } catch (e) {
      console.warn('Auth sync error:', e);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('civicfix_user');
  };

  const addIssue = async (newIssue) => {
    const updatedIssues = [newIssue, ...issues];
    setIssues(updatedIssues);
    localStorage.setItem('civicfix_issues', JSON.stringify(updatedIssues));

    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIssue)
      });
      const data = await res.json();
      if (data.success && data.issue) {
        setIssues(prev => prev.map(i => i.id === newIssue.id ? data.issue : i));
      }
    } catch (err) {
      console.warn('Error saving issue to API:', err);
    }
  };

  const updateIssue = async (id, updates) => {
    const updatedIssues = issues.map(issue => 
      issue.id === id ? { ...issue, ...updates } : issue
    );
    setIssues(updatedIssues);
    localStorage.setItem('civicfix_issues', JSON.stringify(updatedIssues));

    try {
      await fetch(`/api/issues/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (err) {
      console.warn('Error updating issue on API:', err);
    }
  };

  const deleteIssue = async (id) => {
    const cleanId = id.startsWith('#') ? id.slice(1) : id;
    const updated = issues.filter(i => i.id !== cleanId && i.id !== id);
    setIssues(updated);
    localStorage.setItem('civicfix_issues', JSON.stringify(updated));

    try {
      await fetch(`/api/issues/${cleanId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Error deleting issue via API:', err);
    }
  };

  const clearAllIssues = async () => {
    setIssues([]);
    setNotifications([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('civicfix_issues');
      localStorage.removeItem('civicfix_notifications');
    }

    try {
      await fetch('/api/reset', { method: 'POST' });
    } catch (err) {
      console.warn('Error clearing issues via API:', err);
    }
  };

  const addNotification = (message, issueId) => {
    const newNotif = {
      id: Date.now().toString(),
      message,
      issueId,
      date: new Date().toLocaleString(),
      read: false
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    localStorage.setItem('civicfix_notifications', JSON.stringify(updatedNotifs));
  };

  const markNotificationRead = async (id) => {
    const updatedNotifs = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifs);
    localStorage.setItem('civicfix_notifications', JSON.stringify(updatedNotifs));

    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markRead', id })
      });
    } catch (err) {
      console.warn('Error marking notification read:', err);
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      issues,
      clusters: clusterData.clusters,
      clusterStats: clusterData.stats,
      addIssue,
      updateIssue,
      deleteIssue,
      clearAllIssues,
      notifications,
      addNotification,
      markNotificationRead
    }}>
      {children}
    </AppContext.Provider>
  );
};
