import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  if (location.pathname === '/' || location.pathname === '/login') return null;

  return (
    <footer className="bg-white border-t border-slate-200 px-8 py-6 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 pb-24 md:pb-6">
      <div>
        © {new Date().getFullYear()} CivicFix Municipal Infrastructure Dispatch. All rights reserved.
      </div>
      <div className="flex gap-6 mt-4 md:mt-0 font-semibold text-slate-700">
        <a href="#" className="hover:text-brand-blue">Public Ticker</a>
        <a href="#" className="hover:text-brand-blue">Accessibility (WCAG 2.1)</a>
        <a href="#" className="hover:text-brand-blue">Agency Portal</a>
      </div>
    </footer>
  );
}
