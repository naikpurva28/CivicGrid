export type HistoryEvent = {
  status: string;
  time: string;
  detail: string;
  icon?: string;
  active?: boolean;
};

export type Issue = {
  id: string;
  type: string;
  title: string;
  location: string;
  priorityScore: number;
  status: 'In Progress' | 'Pending Review' | 'Resolved' | 'Flagged Urgent' | 'Reported';
  impact: string;
  confirmations: number;
  time: string;
  update: string;
  image: string;
  department: string;
  assignedUnit: string;
  targetSLA: string;
  jurisdiction: string;
  history: HistoryEvent[];
  reportedBy: string;
  date: string;
};

export const initialIssues: Issue[] = [
  {
    id: "CF-88219",
    type: "ROADWAY POTHOLE",
    title: "Pothole on 5th Ave & Elm St",
    location: "Corner of 5th Ave & Elm St, Eastbound Lane",
    priorityScore: 8.4,
    status: "In Progress",
    impact: "High Impact",
    confirmations: 14,
    time: "Reported 1d ago",
    update: "Last update: Assigned to Roads Dept",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80",
    department: "Transportation",
    assignedUnit: "Rapid Asphalt #3",
    targetSLA: "Within 4 Hours",
    jurisdiction: "Ward 4 Metro",
    history: [
      { status: "Reported", time: "Oct 24, 08:30 AM", detail: "Logged by citizen with geocoded photos.", icon: "✓" },
      { status: "Verified by AI & Dispatch", time: "Oct 24, 09:15 AM", detail: "Auto-merged duplicates; road hazard level 8.4 assigned.", icon: "✓" },
      { status: "Assigned", time: "Oct 24, 10:45 AM", detail: "Dispatched to Rapid Asphalt Crew #3.", icon: "✓" },
      { status: "In Progress", time: "Oct 24, 01:20 PM", detail: "Work crew on site.", icon: "⟳", active: true }
    ],
    reportedBy: "citizen",
    date: "Oct 24, 08:30 AM"
  },
  {
    id: "CF-88340",
    type: "STREET LIGHTING",
    title: "Broken Streetlight at Oak Park North",
    location: "Footpath Entrance #3 near North Pavilion",
    priorityScore: 6.1,
    status: "Pending Review",
    impact: "Moderate Risk",
    confirmations: 5,
    time: "Reported 3h ago",
    update: "Awaiting Triage Inspection",
    image: "https://images.unsplash.com/photo-1542382103-6058e5ec2605?auto=format&fit=crop&w=400&q=80",
    department: "Energy Services",
    assignedUnit: "Unassigned",
    targetSLA: "Within 48 Hours",
    jurisdiction: "Ward 4",
    history: [
      { status: "Reported", time: "Oct 25, 09:00 AM", detail: "Logged by citizen.", icon: "✓" }
    ],
    reportedBy: "citizen",
    date: "Oct 25, 09:00 AM"
  },
  {
    id: "CF-87902",
    type: "SANITATION",
    title: "Overflowing Public Waste Bin on Market Square",
    location: "Market Square Fountain Promenade",
    priorityScore: 9.0,
    status: "Resolved",
    impact: "Completed SLA",
    confirmations: 0,
    time: "Resolved 2 hours ago",
    update: "View Before / After >",
    image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=400&q=80",
    department: "Sanitation",
    assignedUnit: "Waste Mgmt Team A",
    targetSLA: "Within 24 Hours",
    jurisdiction: "Ward 2",
    history: [
      { status: "Reported", time: "Oct 24, 01:00 PM", detail: "Logged by citizen.", icon: "✓" },
      { status: "Resolved", time: "Oct 25, 08:00 AM", detail: "Bin cleared and area sanitized.", icon: "✓", active: true }
    ],
    reportedBy: "citizen",
    date: "Oct 24, 01:00 PM"
  },
  {
    id: "CF-88401",
    type: "WATER & DRAINAGE",
    title: "Water Main Leakage near High School",
    location: "Maplewood High School North Entrance",
    priorityScore: 9.8,
    status: "Flagged Urgent",
    impact: "Critical Hazard",
    confirmations: 31,
    time: "31 duplicate reports merged",
    update: "Crews Dispatched",
    image: "https://images.unsplash.com/photo-1520699049698-acd2fce187f4?auto=format&fit=crop&w=400&q=80",
    department: "Water Works",
    assignedUnit: "Hydraulics 2",
    targetSLA: "Immediate (1 Hour)",
    jurisdiction: "Ward 8",
    history: [
      { status: "Reported", time: "Oct 25, 07:00 AM", detail: "31 reports received simultaneously.", icon: "✓" },
      { status: "Verified by AI & Dispatch", time: "Oct 25, 07:15 AM", detail: "Flagged as Urgent Hazard.", icon: "✓" },
      { status: "Assigned", time: "Oct 25, 07:20 AM", detail: "Dispatched Hydraulics 2.", icon: "✓", active: true }
    ],
    reportedBy: "citizen",
    date: "Oct 25, 07:00 AM"
  }
];
