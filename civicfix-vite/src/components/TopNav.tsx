import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, CheckSquare, MessageSquare } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function TopNav() {
  const location = useLocation();
  const { notifications, markNotificationRead } = useAppContext();
  const [showNotifications, setShowNotifications] = useState(false);
  
  if (location.pathname === '/' || location.pathname === '/login') return null;
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="bg-white border-b border-slate-200 px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6 flex-1">
        <Link to="/overview" className="flex items-center gap-2 no-underline">
          <div className="bg-brand-blue w-8 h-8 rounded-lg flex items-center justify-center relative">
            <CheckSquare className="text-white" size={18} />
            <div className="absolute w-2 h-2 border-2 border-brand-blue bg-brand-orange rounded-full -right-0.5 -top-0.5"></div>
          </div>
          <div className="font-extrabold text-xl tracking-tight">
            <span className="text-brand-blue">Civic</span><span className="text-brand-orange">Fix</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-3">
          <span className="font-extrabold text-brand-navy text-lg tracking-tight">CivicFix</span>
          <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            CITIZEN PORTAL
          </span>
        </div>
      </div>

      <div className="flex-[2] hidden md:flex justify-center">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search civic tickets, tracking IDs, infrastructure..."
            className="w-full py-2.5 pl-11 pr-4 rounded-full bg-slate-100 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-6 flex-1">
        <div className="hidden md:flex items-center gap-6 font-semibold text-sm">
          <Link 
            to="/overview" 
            className={`${location.pathname === '/overview' ? 'text-brand-navy font-bold' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Overview
          </Link>
          <Link 
            to="/report" 
            className={`${location.pathname === '/report' ? 'text-brand-navy font-bold' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Report Issue
          </Link>
          <Link 
            to="/issue/CF-88219" 
            className={`${location.pathname.startsWith('/issue') ? 'text-brand-navy font-bold' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Alerts
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div 
              className="relative cursor-pointer text-slate-500 hover:text-slate-700"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-600 rounded-full border-2 border-white box-content"></div>
              )}
            </div>
            
            {showNotifications && (
              <div className="absolute top-10 right-0 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-[100] overflow-hidden">
                <div className="p-4 border-b border-slate-100 font-bold text-sm flex justify-between items-center bg-slate-50">
                  <span>Notifications</span>
                  {unreadCount > 0 && <span className="bg-blue-50 text-brand-blue px-2 py-0.5 rounded-full text-xs">{unreadCount} New</span>}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">No notifications yet</div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${n.read ? 'bg-white' : 'bg-slate-50'}`}
                        onClick={() => {
                          markNotificationRead(n.id);
                          setShowNotifications(false);
                          if (n.id) {
                            window.location.href = `/issue/${n.id}`;
                          } else {
                            window.location.href = `/issue/CF-88219`;
                          }
                        }}
                      >
                        <div className="flex gap-3">
                          <div className="mt-0.5 text-brand-blue"><MessageSquare size={16} /></div>
                          <div>
                            <div className={`text-sm mb-1 text-slate-800 ${n.read ? 'font-medium' : 'font-bold'}`}>{n.message}</div>
                            <div className="text-xs text-slate-400">{n.date}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <Link to="/login" className="hidden md:block text-xs font-semibold text-slate-500 hover:text-slate-700 ml-1">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
