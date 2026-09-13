import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import IssueCard from '../components/IssueCard';
import { Building2, FileText, CheckCircle2, ThumbsUp, Activity, List, Map as MapIcon, Plus } from 'lucide-react';

export default function Overview() {
  const navigate = useNavigate();
  const { issues } = useAppContext();
  const [activeTab, setActiveTab] = useState('my_reports');
  const [viewMode, setViewMode] = useState('list');

  // Filter issues based on active tab for the prototype
  // If 'my_reports', we show all issues reported by 'citizen'
  // If 'community', we just show all issues as a mock
  const displayIssues = activeTab === 'my_reports' 
    ? issues.filter(i => i.reportedBy === 'citizen') 
    : issues;

  const reportedCount = issues.filter(i => i.reportedBy === 'citizen').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-0">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
              Good morning, Maya Lin <span className="text-3xl">👋</span>
              <span className="bg-slate-200/50 text-slate-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 tracking-wide uppercase mt-1">
                <span className="w-2 h-2 rounded-full bg-brand-orange"></span> 3 Active Issues in your neighborhood
              </span>
            </h1>
            <div className="text-slate-500 font-medium flex items-center gap-2">
              <Building2 size={16} className="text-brand-blue" />
              Ward 4 • North Maplewood Community <span className="text-slate-300">•</span> Precinct ID #4092-B
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/report')}
            className="hidden md:flex bg-brand-orange hover:bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/30 px-6 py-3 transition-colors items-center gap-3"
          >
            <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center">
              <Plus size={20} className="text-white" />
            </div>
            <div className="text-left">
              <div className="font-extrabold text-[15px] leading-tight">Report an Issue</div>
              <div className="text-[10px] font-bold text-orange-100 tracking-wider">AVG RESPONSE 4.2H</div>
            </div>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-blue-50 text-brand-blue w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 leading-none mb-1">{reportedCount}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Reported by you</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-green-50 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 leading-none mb-1">6</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Resolved Cases</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-orange-50 text-brand-orange w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
              <ThumbsUp size={20} />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 leading-none mb-1">42</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Community Upvotes</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-indigo-50 text-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
              <Activity size={20} />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 leading-none mb-1">92%</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">SLA Resolution Rate</div>
            </div>
          </div>
        </div>

        {/* Tabs & View Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 mb-6 gap-4">
          <div className="flex gap-8">
            <button 
              className={`pb-4 font-bold text-sm transition-colors relative ${activeTab === 'my_reports' ? 'text-brand-navy' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('my_reports')}
            >
              My Reports ({reportedCount})
              {activeTab === 'my_reports' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-blue rounded-t-full"></div>}
            </button>
            <button 
              className={`pb-4 font-bold text-sm transition-colors relative ${activeTab === 'community' ? 'text-brand-navy' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('community')}
            >
              Nearby Community Reports ({issues.length})
              {activeTab === 'community' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-blue rounded-t-full"></div>}
            </button>
          </div>
          
          <div className="flex bg-slate-100 rounded-lg p-1 mb-4 md:mb-2">
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-brand-navy text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              <List size={16} /> List View
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-brand-navy text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              <MapIcon size={16} /> Map View
            </button>
          </div>
        </div>

        {/* Content Area */}
        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayIssues.map(issue => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
            {displayIssues.length === 0 && (
              <div className="col-span-1 lg:col-span-2 text-center py-12 text-slate-500">
                No issues found.
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-200 rounded-2xl h-[500px] border border-slate-300 flex items-center justify-center relative overflow-hidden">
            {/* Mock Map Background */}
            <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-blue-500/10"></div>
            
            <div className="relative z-10 bg-white p-6 rounded-xl shadow-lg text-center max-w-sm">
              <MapIcon size={48} className="mx-auto text-brand-blue mb-4" />
              <h3 className="font-bold text-lg mb-2">Interactive Map Mode</h3>
              <p className="text-sm text-slate-500">
                Map view is disabled in this prototype. Switch to List View to see reports.
              </p>
              <button 
                onClick={() => setViewMode('list')}
                className="mt-4 bg-brand-navy text-white px-6 py-2 rounded-lg font-bold text-sm"
              >
                Switch to List
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
