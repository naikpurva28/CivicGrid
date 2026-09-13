import React from 'react';
import { Home, List, Map, User, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomMobileNav() {
  const location = useLocation();
  if (location.pathname === '/' || location.pathname === '/login') return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50">
      <Link to="/overview" className="flex flex-col items-center text-brand-navy">
        <Home size={24} className={location.pathname === '/overview' ? 'text-brand-blue' : 'text-slate-500'} />
        <span className="text-[10px] mt-1 font-semibold text-brand-navy">Home</span>
      </Link>
      
      <button className="flex flex-col items-center text-slate-500">
        <List size={24} />
        <span className="text-[10px] mt-1 font-semibold">My Issues</span>
      </button>
      
      <Link to="/report" className="relative -top-5 flex flex-col items-center">
        <div className="w-14 h-14 bg-brand-orange rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white">
          <Plus size={32} />
        </div>
        <span className="text-[10px] mt-1 font-bold text-brand-navy">Report</span>
      </Link>
      
      <button className="flex flex-col items-center text-slate-500">
        <Map size={24} />
        <span className="text-[10px] mt-1 font-semibold">Map Pulse</span>
      </button>
      
      <button className="flex flex-col items-center text-slate-500">
        <User size={24} />
        <span className="text-[10px] mt-1 font-semibold">Profile</span>
      </button>
    </div>
  );
}
