import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp, Clock, Users, Wrench, AlertTriangle, Lightbulb, Trash2, MapPin } from 'lucide-react';
import { Issue } from '../data/mockIssues';
import StatusPill from './StatusPill';

const typeIcons: Record<string, React.ReactNode> = {
  'ROADWAY POTHOLE': <Wrench size={14} />,
  'STREET LIGHTING': <Lightbulb size={14} />,
  'SANITATION': <Trash2 size={14} />,
  'WATER & DRAINAGE': <AlertTriangle size={14} />
};

export default function IssueCard({ issue }: { issue: Issue }) {
  const navigate = useNavigate();

  const getPriorityColor = (score: number) => {
    if (score >= 9) return 'bg-red-600';
    if (score >= 8) return 'bg-orange-500';
    if (score >= 6) return 'bg-amber-600';
    return 'bg-blue-600';
  };

  const priorityColor = getPriorityColor(issue.priorityScore);

  return (
    <div 
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
    >
      <div className="p-5 pb-4 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <span className="bg-blue-50 text-brand-blue px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 uppercase tracking-wide">
            {typeIcons[issue.type] || <Wrench size={14} />} {issue.type}
          </span>
          <span className="text-slate-400 text-sm font-semibold">{issue.id}</span>
        </div>
        <StatusPill status={issue.status} />
      </div>

      <div className="px-5 flex gap-5 mb-5">
        <div className="w-24 h-24 rounded-lg overflow-hidden relative shrink-0">
          <img src={issue.image} alt="Issue" className="w-full h-full object-cover" />
          <div 
            className="absolute bottom-1 right-1 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md"
            style={{ backgroundColor: issue.status === 'Resolved' ? 'rgba(22, 163, 74, 0.8)' : (issue.status === 'Flagged Urgent' ? 'rgba(220, 38, 38, 0.8)' : 'rgba(0,0,0,0.6)') }}
          >
            {issue.status === 'Resolved' ? 'Cleared' : (issue.status === 'Flagged Urgent' ? 'Hazard' : 'Photo')}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-[17px] font-bold text-slate-900 mb-1 leading-snug">{issue.title}</h3>
          <div className="text-slate-500 text-sm flex items-center gap-1.5 mb-3">
            <MapPin size={14} className="text-slate-400" /> {issue.location}
          </div>
          
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className={issue.priorityScore >= 9 ? 'text-red-700' : 'text-orange-700'}>
              Priority Score {issue.priorityScore}/10
            </span>
            <span className="text-slate-600">{issue.impact}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${priorityColor}`} 
              style={{ width: `${(issue.priorityScore / 10) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex justify-between items-center text-xs font-semibold text-slate-500 mt-auto">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-brand-navy">
            {issue.status === 'Flagged Urgent' ? (
              <><Users size={14} className="text-red-600" /> <span className="text-red-700">{issue.confirmations} duplicate reports merged</span></>
            ) : (
              <><ThumbsUp size={14} /> {issue.confirmations} {issue.status === 'Resolved' ? 'Resolved' : 'Confirmations'}</>
            )}
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            {issue.status === 'Resolved' ? <></> : <>{issue.time}</>}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {issue.status === 'Resolved' ? (
             <span className="text-brand-blue">{issue.update}</span>
          ) : (issue.status === 'Flagged Urgent' ? (
             <span className="text-red-600 flex items-center gap-1"><AlertTriangle size={14}/> {issue.update}</span>
          ) : (
             <span className="text-slate-700 flex items-center gap-1"><Clock size={14}/> {issue.update}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
