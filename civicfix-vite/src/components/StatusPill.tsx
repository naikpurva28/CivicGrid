import React from 'react';

export default function StatusPill({ status }: { status: string }) {
  if (status === 'In Progress') {
    return (
      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-blue-600"></span> In Progress
      </span>
    );
  }
  if (status === 'Pending Review') {
    return (
      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-orange-500"></span> Pending Review
      </span>
    );
  }
  if (status === 'Resolved') {
    return (
      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-green-500"></span> Resolved
      </span>
    );
  }
  if (status === 'Flagged Urgent') {
    return (
      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap">
        ! Flagged Urgent
      </span>
    );
  }
  return (
    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap">
      {status}
    </span>
  );
}
