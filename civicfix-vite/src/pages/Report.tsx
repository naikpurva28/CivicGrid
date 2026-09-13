import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Camera, MapPin, AlertTriangle, Building, Wrench, Lightbulb, Trash2, ShieldAlert, Car, Trees, FileQuestion, CheckCircle2, Lock } from 'lucide-react';

const CATEGORIES = [
  { id: 'ROADWAY POTHOLE', title: 'Pothole', sub: 'Road surface cavity', icon: <Wrench size={24} /> },
  { id: 'STREET LIGHTING', title: 'Streetlight', sub: 'Outage or flicker', icon: <Lightbulb size={24} /> },
  { id: 'SANITATION', title: 'Garbage', sub: 'Overflow or illegal dump', icon: <Trash2 size={24} /> },
  { id: 'WATER & DRAINAGE', title: 'Water Leak', sub: 'Hydrant or main pipe', icon: <AlertTriangle size={24} /> },
  { id: 'ROAD BARRIER', title: 'Road Barrier', sub: 'Damaged guardrail', icon: <Car size={24} /> },
  { id: 'TRAFFIC SIGNAL', title: 'Traffic Signal', sub: 'Dead light or timing issue', icon: <ShieldAlert size={24} /> },
  { id: 'TREE HAZARD', title: 'Tree Hazard', sub: 'Fallen branch or root', icon: <Trees size={24} /> },
  { id: 'OTHER HAZARD', title: 'Other Hazard', sub: 'General inquiry', icon: <FileQuestion size={24} /> }
];

export default function Report() {
  const navigate = useNavigate();
  const { addIssue, addNotification } = useAppContext();
  
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [urgent, setUrgent] = useState(false);
  const draftId = `#DPW-TMP-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleTagClick = (tag: string) => {
    setDescription(prev => prev ? `${prev} ${tag}` : tag);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      alert("Please select a category.");
      return;
    }
    
    const newId = `CF-88${Math.floor(100 + Math.random() * 900)}`;
    const newIssue = {
      id: newId,
      type: category,
      title: `${category.charAt(0) + category.slice(1).toLowerCase()} Issue`,
      location: "742 Evergreen Terrace, Ward 4",
      priorityScore: urgent ? 9.5 : 7.2,
      status: "Reported" as const,
      impact: urgent ? "High Impact" : "Moderate Risk",
      confirmations: 1,
      time: "Just now",
      update: "Awaiting Triage Inspection",
      image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80",
      department: "Dept. of Public Works (Ward 4 Maintenance)",
      assignedUnit: "Unassigned",
      targetSLA: urgent ? "Immediate (< 4 Hours)" : "Within 24 Hours",
      jurisdiction: "Ward 4",
      history: [
        { status: "Reported", time: "Just now", detail: "Logged by citizen with geocoded photos.", icon: "✓", active: true }
      ],
      reportedBy: "citizen",
      date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    addIssue(newIssue);
    addNotification(`Your report ${newId} has been submitted successfully.`, newId);
    navigate(`/issue/${newId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-8">
      
      {/* Top Warning Strip */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          CITIZEN TRIAGE INTAKE ENGINE v4.19
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5"><ShieldAlert size={12}/> WCAG 2.1 AAA Compliant</span>
          <span className="text-brand-blue flex items-center gap-1.5"><AlertTriangle size={12}/> Priority Auto-Dispatch Active</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-1">Municipal Report Dispatch</div>
            <h1 className="text-3xl font-extrabold text-slate-900">Submit Infrastructure Report</h1>
          </div>
          <div className="hidden md:flex bg-blue-50 text-brand-blue px-4 py-2 rounded-full text-xs font-bold items-center gap-2">
            Reference Draft: {draftId}
          </div>
        </div>

        {/* Stepper */}
        <div className="flex bg-white rounded-xl border border-slate-200 p-2 mb-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
          
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 p-2 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
            <div className="text-xs md:text-sm font-bold text-brand-navy leading-tight text-center md:text-left">
              <div className="text-[10px] text-brand-blue uppercase tracking-wider">Active Step</div>
              Evidence & Details
            </div>
          </div>
          
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 p-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm shrink-0">2</div>
            <div className="text-xs md:text-sm font-bold text-slate-400 leading-tight text-center md:text-left">
              <div className="text-[10px] uppercase tracking-wider">Next</div>
              Location & Pin
            </div>
          </div>
          
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 p-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm shrink-0">3</div>
            <div className="text-xs md:text-sm font-bold text-slate-400 leading-tight text-center md:text-left">
              <div className="text-[10px] uppercase tracking-wider">Final</div>
              Submit & Track
            </div>
          </div>
        </div>

        {category === 'ROADWAY POTHOLE' && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8 flex gap-4 shadow-sm items-start">
            <div className="bg-orange-100 text-orange-600 p-2 rounded-lg shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-orange-900 text-sm">Automatic Duplicate Detection Triggered</h3>
                <span className="bg-orange-200 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full">89% Correlation</span>
              </div>
              <p className="text-xs text-orange-800 mb-2">
                2 similar pothole reports were registered within <strong>150 meters</strong> in the last 48 hours. Submitting will bundle your photo evidence and automatically elevate the civic prioritization score!
              </p>
              <div className="flex items-center gap-4 text-xs font-bold text-orange-700">
                <a href="#" className="flex items-center gap-1 hover:underline"><Eye size={14}/> View existing report #DPW-8412</a>
                <span className="text-orange-900/40">•</span>
                <span className="flex items-center gap-1">⚡ SLA Acceleration Active</span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Photo & Evidence */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
            <div className="flex justify-between items-end mb-4">
              <div className="flex items-center gap-3">
                <Camera className="text-brand-blue" size={24} />
                <h2 className="text-lg font-extrabold text-slate-900">Photo & Damage Evidence</h2>
              </div>
              <span className="bg-blue-50 text-brand-blue text-[10px] font-bold px-3 py-1 rounded-full">1 of 3 Photos Added</span>
            </div>
            <p className="text-sm text-slate-500 mb-6">High-resolution, street-level photography speeds up crew mobilization.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="aspect-video md:aspect-[4/3] bg-slate-100 rounded-xl relative overflow-hidden group cursor-pointer border-2 border-transparent hover:border-brand-blue transition-colors">
                <img src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80" alt="Pothole" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded">
                  GPS: 40.3661° N, 71.9529° W
                </div>
                <div className="absolute bottom-2 right-2 bg-red-600/90 text-white p-1.5 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={14} />
                </div>
              </div>
              
              <div className="aspect-video md:aspect-[4/3] bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-xl flex flex-col items-center justify-center text-brand-blue hover:bg-blue-50 cursor-pointer transition-colors">
                <Camera size={24} className="mb-2 opacity-50" />
                <div className="font-bold text-sm">Add Context Angle</div>
                <div className="text-[10px] text-blue-400 mt-1">Side profile or wide shot</div>
              </div>
              
              <div className="aspect-video md:aspect-[4/3] bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors">
                <Camera size={24} className="mb-2 opacity-50" />
                <div className="font-bold text-sm">Optional Close-up</div>
                <div className="text-[10px] text-slate-400 mt-1">Measurement or landmark</div>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-bold">i</div>
              Tip: Placing a coin, foot, or common object next to damage helps engineers calculate asphalt repair tonnage accurately.
            </div>
          </section>

          {/* Select Category */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
            <div className="flex justify-between items-end mb-6">
              <div className="flex items-center gap-3">
                <Building className="text-brand-blue" size={24} />
                <h2 className="text-lg font-extrabold text-slate-900">Select Incident Category</h2>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Required</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATEGORIES.map(cat => (
                <div 
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col ${category === cat.id ? 'border-brand-navy bg-brand-navy text-white shadow-md' : 'border-slate-100 bg-white hover:border-brand-blue hover:bg-blue-50 text-slate-700'}`}
                >
                  <div className={`mb-3 ${category === cat.id ? 'text-white' : 'text-brand-blue'}`}>
                    {cat.icon}
                  </div>
                  <div className="font-bold text-sm mb-1">{cat.title}</div>
                  <div className={`text-[10px] leading-tight ${category === cat.id ? 'text-blue-200' : 'text-slate-500'}`}>
                    {cat.sub}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Location */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
            <div className="flex justify-between items-end mb-4">
              <div className="flex items-center gap-3">
                <MapPin className="text-brand-blue" size={24} />
                <h2 className="text-lg font-extrabold text-slate-900">Auto-Detected Geolocation</h2>
              </div>
              <button type="button" className="text-xs font-bold text-brand-blue flex items-center gap-1 hover:underline">
                <MapPin size={12} /> Recalibrate GPS
              </button>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-4 flex justify-between items-center bg-white border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg text-brand-blue">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      742 Evergreen Terrace, Ward 4
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                      Springfield Metropolitan District <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded">GPS Accurate to ±3m</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex bg-slate-100 rounded-lg p-1 text-xs font-bold">
                  <button type="button" className="px-3 py-1 bg-white shadow-sm rounded-md text-slate-700">Street</button>
                  <button type="button" className="px-3 py-1 text-slate-500">Satellite</button>
                </div>
              </div>
              
              <div className="h-64 bg-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center"></div>
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="bg-brand-blue text-white text-[10px] font-bold px-2 py-1 rounded shadow-md mb-1 whitespace-nowrap">
                    Selected Point &uarr;
                  </div>
                  <div className="w-12 h-12 bg-white rounded-lg shadow-xl border-4 border-brand-blue flex items-center justify-center text-brand-blue">
                    <MapPin size={24} />
                  </div>
                </div>
                
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2 border border-slate-200">
                  <div className="w-4 h-4 text-slate-400">☰</div>
                  Drag pin to adjust exact pothole location
                </div>

                <div className="absolute bottom-4 right-4 flex flex-col gap-1 bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
                  <button type="button" className="p-2 hover:bg-slate-50 border-b border-slate-100 font-bold text-slate-600">+</button>
                  <button type="button" className="p-2 hover:bg-slate-50 font-bold text-slate-600">-</button>
                </div>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
            <div className="flex justify-between items-end mb-4">
              <div className="flex items-center gap-3">
                <FileQuestion className="text-brand-blue" size={24} />
                <h2 className="text-lg font-extrabold text-slate-900">Description & Observations</h2>
              </div>
              <span className="text-[10px] font-bold text-slate-400">{description.length} / 500</span>
            </div>
            
            <textarea
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all resize-none text-sm mb-4"
              placeholder="Describe dimensions, vehicular hazard level, lane blockage, or impact to cyclists and pedestrians."
              value={description}
              onChange={e => setDescription(e.target.value.substring(0, 500))}
            ></textarea>
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase mr-2">Quick Details:</span>
              {['+ Deep cavity', '+ Blocking bike lane', '+ School bus route', '+ Sharp asphalt edges'].map(tag => (
                <button 
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-brand-blue border border-slate-200 hover:border-blue-200 px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8 flex items-start gap-4">
            <input 
              type="checkbox" 
              className="mt-1 w-5 h-5 text-red-600 rounded focus:ring-red-500 border-red-300"
              checked={urgent}
              onChange={e => setUrgent(e.target.checked)}
            />
            <div>
              <label className="font-extrabold text-red-700 text-sm flex items-center gap-2 mb-1">
                <AlertTriangle size={16} /> Immediate Safety & Pedestrian Transit Hazard
              </label>
              <p className="text-xs text-red-800">
                Check this box if the defect poses an imminent threat to school buses, active pedestrian crosswalks, or two-wheel transit safety. Triggers priority triage in DPW field queue.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg text-brand-blue shadow-sm">
                <Building size={16} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-0.5">Target Department</div>
                <div className="text-sm font-semibold text-slate-800">
                  Dispatched automatically to <span className="font-bold text-brand-navy">Dept. of Public Works (Ward 4 Maintenance)</span>
                </div>
              </div>
            </div>
            <div className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Target Response: &lt; 24h
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
              <Lock size={12} /> Report public record • Anonymized citizen credentials
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button type="button" className="text-sm font-bold text-slate-500 hover:text-slate-700 px-4">
                Save as Draft
              </button>
              <button type="submit" className="flex-1 md:flex-none bg-brand-navy hover:bg-brand-blue-dark text-white font-bold py-3.5 px-8 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2">
                Submit Report to City Operations &rarr;
              </button>
            </div>
          </div>

        </form>
      </main>
    </div>
  );
}

// Quick stub for Eye icon used in the warning banner
function Eye({ size = 24, className = "" }: { size?: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
