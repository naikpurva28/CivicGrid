import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import StatusPill from '../components/StatusPill';
import { ArrowLeft, Share2, BellRing, MapPin, ZoomIn, CheckCircle2, RefreshCcw, Send, Check, AlertTriangle } from 'lucide-react';

export default function IssueDetail() {
  const { id } = useParams<{ id: string }>();
  const { issues, updateIssue } = useAppContext();
  const [comment, setComment] = useState('');
  
  const issue = issues.find(i => i.id === id);
  
  if (!issue) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Issue Not Found</h2>
        <Link to="/overview" className="text-brand-blue font-bold hover:underline">
          &larr; Back to Overview
        </Link>
      </div>
    );
  }

  const handleResolve = () => {
    updateIssue(issue.id, { 
      status: 'Resolved',
      impact: 'Completed SLA',
      history: [
        ...issue.history.map(h => ({ ...h, active: false })),
        { status: 'Resolved', time: 'Just now', detail: 'Citizen confirmed resolution.', icon: '✓', active: true }
      ]
    });
  };

  const handleReopen = () => {
    updateIssue(issue.id, { 
      status: 'In Progress',
      history: [
        ...issue.history.map(h => ({ ...h, active: false })),
        { status: 'Reopened', time: 'Just now', detail: 'Citizen reported issue persists.', icon: '⟳', active: true }
      ]
    });
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    // In a real app we'd add to a separate comments array, 
    // for this mock we just add it to history
    updateIssue(issue.id, {
      history: [
        ...issue.history.map(h => ({ ...h, active: false })),
        { status: 'Citizen Follow-up', time: 'Just now', detail: comment, icon: '💬', active: true }
      ]
    });
    setComment('');
  };

  const currentPhase = issue.history.length;
  const totalPhases = 5;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-8">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* Top Nav Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link to="/overview" className="flex items-center gap-2 text-brand-navy font-bold hover:underline bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
              <ArrowLeft size={16} /> Back to My Reports
            </Link>
            <span className="bg-blue-50 text-brand-blue px-3 py-1.5 rounded-full text-sm font-extrabold tracking-wide">
              {issue.id}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button className="flex items-center gap-2 text-slate-600 font-bold hover:bg-slate-200 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-colors">
              <Share2 size={16} /> Share Incident
            </button>
            <button className="flex items-center gap-2 text-white font-bold bg-brand-navy hover:bg-brand-blue px-4 py-2 rounded-lg shadow-sm transition-colors">
              <BellRing size={16} /> Following Updates
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Hero Photo */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video md:aspect-[21/9]">
              <img src={issue.image} alt={issue.title} className="w-full h-full object-cover opacity-80" />
              
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
                  <MapPin size={12} className="text-brand-orange" /> MUNICIPALITY — {issue.location.split(',')[0].toUpperCase()}
                </span>
                <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
                  <ShieldAlert size={12} /> AI Validated Photo
                </span>
              </div>

              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded text-xs font-bold">
                {issue.date}
              </div>

              <div className="absolute bottom-4 left-4 flex gap-2">
                <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded text-[10px] font-bold">
                  <MapPin size={10} className="inline mr-1 text-brand-orange" /> Lat 40.7128° N, Long 74.0060° W
                </span>
                <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded text-[10px] font-bold">
                  DIRECTION: EB
                </span>
              </div>
              
              <div className="absolute bottom-4 right-4 text-white">
                <ZoomIn size={20} className="opacity-70 hover:opacity-100 cursor-pointer" />
              </div>
              <div className="absolute bottom-4 right-12 text-white/50 text-[10px] font-bold tracking-widest">
                REF: MOPW-24
              </div>
            </div>

            {/* Issue Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-50 text-brand-blue px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide">
                  <AlertTriangle size={14} /> {issue.type}
                </span>
                <span className="bg-orange-50 text-brand-orange px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide">
                  🔥 Priority {issue.priorityScore} / 10
                </span>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide">
                  👥 {issue.confirmations} Citizens Reported This
                </span>
              </div>

              <h1 className="text-3xl font-extrabold text-slate-900 mb-4">{issue.title}</h1>
              
              <p className="text-slate-600 leading-relaxed mb-8">
                {issue.type === 'ROADWAY POTHOLE' 
                  ? "Deep road subsidence measuring approximately 1.2 meters across and 15 cm deep directly on the driving line of 5th Ave. Vehicles are swerving into oncoming traffic to avoid rim damage and suspension impact."
                  : "Issue reported via the CivicFix public portal. Awaiting further detailed analysis from the assigned field inspection unit."}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department</div>
                  <div className="font-bold text-slate-800 text-sm">{issue.department}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Assigned Unit</div>
                  <div className="font-bold text-slate-800 text-sm">{issue.assignedUnit}</div>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                  <div className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1">Target SLA</div>
                  <div className="font-bold text-green-700 text-sm">{issue.targetSLA}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Jurisdiction</div>
                  <div className="font-bold text-slate-800 text-sm">{issue.jurisdiction}</div>
                </div>
              </div>
            </div>

            {/* Satisfaction Audit */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex gap-4 items-center w-full md:w-auto">
                <div className="bg-white p-3 rounded-xl text-brand-blue shadow-sm">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900">Citizen Satisfaction Audit</h3>
                    <span className="bg-slate-200 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Community Vote</span>
                  </div>
                  <p className="text-xs text-slate-600">Has this infrastructure hazard been resolved to city standards?</p>
                </div>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={handleResolve}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-green-50 text-green-700 font-bold px-6 py-2.5 rounded-lg border border-green-200 shadow-sm transition-colors"
                >
                  <Check size={16} /> Confirm Resolved
                </button>
                <button 
                  onClick={handleReopen}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-orange-50 text-orange-700 font-bold px-6 py-2.5 rounded-lg border border-orange-200 shadow-sm transition-colors"
                >
                  <RefreshCcw size={16} /> Reopen Issue
                </button>
              </div>
            </div>

            {/* Stream */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare size={20} className="text-brand-blue" /> Community & Dispatch Stream
                </h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{issue.history.length} Updates</span>
              </div>
              
              <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
                {/* Fixed Mock Update from Inspector */}
                <div className="flex flex-col gap-2 relative pl-6 border-l-2 border-slate-100 pb-2">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-brand-blue rounded-full border-4 border-white"></div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-brand-navy flex items-center gap-1">
                        <Users size={14} /> Official City Inspector (Crew #3)
                      </span>
                      <span className="bg-blue-50 text-brand-blue text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Municipal Staff</span>
                    </div>
                    <span className="text-xs text-slate-400">12 mins ago</span>
                  </div>
                  <p className="text-sm text-slate-700">
                    Paving compound applied, hot-mix curing in progress. Lane coned off with high-visibility markers. Expected reopening in 45 minutes.
                  </p>
                  <div className="mt-2 flex items-center gap-3 bg-slate-50 border border-slate-100 p-2 rounded-lg w-max">
                    <div className="w-10 h-10 rounded bg-slate-200 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=100&q=80" alt="Curing" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Evidence upload: IMG_9921_cure.jpg</span>
                  </div>
                </div>

                {issue.history.slice().reverse().map((event, idx) => (
                  <div key={idx} className="flex flex-col gap-2 relative pl-6 border-l-2 border-slate-100 pb-2">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-300 rounded-full border-4 border-white"></div>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-700">{event.status}</span>
                      </div>
                      <span className="text-xs text-slate-400">{event.time}</span>
                    </div>
                    <p className="text-sm text-slate-600">{event.detail}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <form onSubmit={handlePostComment} className="relative">
                  <input 
                    type="text" 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add official note or citizen follow-up photo..."
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-4 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-navy hover:bg-brand-blue text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                  >
                    <Send size={14} /> Post
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            
            {/* Location Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <MapPin size={18} className="text-brand-blue" /> Incident Location
                </h3>
                <span className="bg-blue-50 text-brand-blue text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">GIS Grid 44-B</span>
              </div>
              
              <div className="bg-slate-100 rounded-xl h-48 mb-4 relative overflow-hidden flex items-center justify-center border border-slate-200">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-blue-500/5"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-10 h-10 bg-white rounded-lg shadow-xl border-4 border-brand-blue flex items-center justify-center text-brand-blue mb-1">
                    <MapPin size={20} />
                  </div>
                  <div className="bg-brand-blue text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">
                    Eastbound Lane
                  </div>
                </div>

                <div className="absolute bottom-2 right-2 flex gap-1 bg-white rounded-md shadow-md overflow-hidden">
                  <button className="px-2 py-1 font-bold text-slate-600 hover:bg-slate-50 border-r border-slate-100">+</button>
                  <button className="px-2 py-1 font-bold text-slate-600 hover:bg-slate-50">-</button>
                </div>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-sm text-slate-900">{issue.location.split(',')[0]}</div>
                  <div className="text-xs text-slate-500">{issue.jurisdiction} District, Metro</div>
                </div>
                <a href="#" className="text-xs font-bold text-brand-blue hover:underline">City GIS ↗</a>
              </div>
            </div>

            {/* Resolution Progress */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <RefreshCcw size={18} className="text-brand-blue" /> Resolution Progress
                </h3>
                <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Phase {Math.min(currentPhase, totalPhases)} of {totalPhases}
                </span>
              </div>

              <div className="space-y-0 relative">
                {/* Connecting Line */}
                <div className="absolute top-4 bottom-8 left-[11px] w-[2px] bg-slate-100"></div>
                
                {issue.history.map((step, idx) => (
                  <div key={idx} className="flex gap-4 pb-6 relative z-10">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5
                      ${step.active 
                        ? 'bg-brand-blue text-white ring-4 ring-blue-50' 
                        : (step.status === 'Reported' || step.icon === '✓' ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-400')}`}
                    >
                      {step.active ? <RefreshCcw size={12} /> : (step.icon === '✓' ? <Check size={12}/> : <div className="w-2 h-2 rounded-full bg-slate-400"></div>)}
                    </div>
                    <div className="flex-1 bg-white">
                      <div className="flex justify-between items-start mb-1">
                        <div className={`font-bold text-sm ${step.active ? 'text-brand-blue' : 'text-slate-900'}`}>
                          {step.status}
                        </div>
                        {step.active && (
                          <span className="bg-blue-100 text-brand-blue text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Active Now</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{step.time}</div>
                      <div className="text-xs text-slate-600 leading-snug bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2">
                        {step.detail}
                      </div>
                    </div>
                  </div>
                ))}
                
                {issue.status !== 'Resolved' && (
                  <div className="flex gap-4 pb-0 relative z-10 opacity-50">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-slate-100 border-2 border-slate-200">
                      <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-500 mb-1">Resolved</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Pending Final Crew Sign-off</div>
                      <div className="text-xs text-slate-500">Awaiting final inspection photo and citizen feedback confirmation.</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Info */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-sm flex items-start gap-4">
              <div className="text-orange-600 bg-orange-100 p-2 rounded-full shrink-0">
                <AlertTriangle size={16} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Emergency Road Conditions?</h4>
                <p className="text-xs text-slate-600">If this hazard presents immediate danger to <strong>life</strong>, dial 311 or 911 dispatch immediately.</p>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}

// Stub for MessageSquare and Users icons
function MessageSquare({ size = 24, className = "" }: { size?: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ShieldAlert({ size = 24, className = "" }: { size?: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function Users({ size = 24, className = "" }: { size?: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
