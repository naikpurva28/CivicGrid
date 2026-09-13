"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

export default function TriageConsole() {
  const router = useRouter();
  const { issues, deleteIssue, clearAllIssues } = useAppContext();
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingVerification: 0,
    highPriorityAlerts: 0,
    resolvedThisWeek: 0,
    categories: [
      { name: 'Road Damage & Potholes', pct: 42, count: 524, color: '#1d4ed8' },
      { name: 'Waste Management & Illegal Dumping', pct: 28, count: 349, color: '#f59e0b' },
      { name: 'Streetlighting & Power Grid', pct: 16, count: 200, color: '#2563eb' },
      { name: 'Water Mains & Storm Drainage', pct: 14, count: 175, color: '#15803d' }
    ],
    resolutionTrend: [
      { week: "Week 1", hours: 48 },
      { week: "Week 2", hours: 44 },
      { week: "Week 3", hours: 36 },
      { week: "Week 4", hours: 29 },
      { week: "Week 5", hours: 22 },
      { week: "Week 6", hours: 18.5 }
    ]
  });

  // Map AppContext issues directly into triageRecords
  const triageRecords = issues.map(item => ({
    id: `#${item.id}`,
    fullId: item.id,
    category: item.type,
    categoryColor: item.priorityScore >= 8.5 ? "#e11d48" : "#1d4ed8",
    categoryBg: item.priorityScore >= 8.5 ? "#ffe4e6" : "#dbeafe",
    title: item.title,
    desc: item.description || item.location,
    score: item.priorityScore || 7.5,
    scoreLevel: item.priorityScore >= 9.0 ? "LEVEL 1 CRIT" : "STANDARD",
    scoreImpact: item.impact || "Pending Review",
    scoreColor: item.priorityScore >= 8.5 ? "#dc2626" : "#f59e0b",
    scoreBg: item.priorityScore >= 8.5 ? "#fee2e2" : "#fef3c7",
    address: item.location || "742 Evergreen Terrace",
    ward: item.ward || "Ward 4",
    status: item.status.toUpperCase(),
    statusColor: item.status === 'Resolved' ? '#166534' : item.status === 'In Progress' ? '#1d4ed8' : '#dc2626',
    statusBg: item.status === 'Resolved' ? '#dcfce7' : item.status === 'In Progress' ? '#dbeafe' : '#fee2e2',
    crewInitials: item.crewInitials || "PW",
    crewName: item.assignedUnit || "Unassigned",
    crewDept: item.department || "Transportation",
    evidenceImg: item.image || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=300&q=80",
    badgeCount: item.confirmations > 0 ? `+${item.confirmations}` : null
  }));

  // Fetch KPI stats from backend
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/triage/stats');
        const data = await res.json();
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.warn('Triage stats API fallback:', err);
      }
    }
    fetchStats();
  }, [issues]);

  const filteredRecords = triageRecords.filter(item => {
    if (activeFilter === 'duplicates' && !item.badgeCount) return false;
    if (activeFilter === 'sla' && item.score < 8.5) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.id.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q) ||
        item.crewName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDelete = (e, recordId) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ticket ${recordId} from the database and remove its map location?`)) {
      deleteIssue(recordId);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to permanently delete ALL database records and clear all locations from the map?')) {
      await clearAllIssues();
      setStats({
        totalReports: 0,
        pendingVerification: 0,
        highPriorityAlerts: 0,
        resolvedThisWeek: 0,
        slaOnTimePct: 100,
        avgResponseHours: 0,
        categories: [],
        resolutionTrend: []
      });
    }
  };

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: 'calc(100vh - 60px)' }}>
      
      {/* Sidebar Components */}
      <aside style={{ width: '250px', background: 'white', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Authority Mode Header */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: 800, color: 'var(--panel-blue-dark)', background: '#eff6ff', padding: '0.6rem 0.9rem', borderRadius: '6px', letterSpacing: '0.5px' }}>
            AUTHORITY MODE <span>🛡️</span>
          </div>
        </div>
        
        {/* Navigation Options */}
        <nav style={{ padding: '1rem 0', flex: 1 }}>
          <Link 
            href="/triage" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.85rem', 
              padding: '0.85rem 1.5rem', 
              background: '#0f3b7a', 
              color: 'white', 
              fontWeight: 700, 
              borderLeft: '4px solid #f59e0b', 
              fontSize: '0.92rem',
              textDecoration: 'none'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Triage Console
          </Link>

          <Link 
            href="/verify-resolve" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.85rem', 
              padding: '0.85rem 1.5rem', 
              color: '#334155', 
              fontWeight: 600, 
              fontSize: '0.92rem',
              textDecoration: 'none'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            Verify & Resolve
          </Link>

          <Link 
            href="/active-tickets" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.85rem', 
              padding: '0.85rem 1.5rem', 
              color: '#334155', 
              fontWeight: 600, 
              fontSize: '0.92rem',
              textDecoration: 'none'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            Active Tickets
          </Link>

          <Link 
            href="/alerts" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.85rem', 
              padding: '0.85rem 1.5rem', 
              color: '#334155', 
              fontWeight: 600, 
              fontSize: '0.92rem',
              textDecoration: 'none'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            Alerts Stream
          </Link>
        </nav>

        {/* Officer Badge */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.85rem', background: '#f8fafc' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #cbd5e1', flexShrink: 0 }}>
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80" alt="Officer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>Officer Dispatch</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Badge #9042</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '1.75rem 2.25rem', overflowY: 'auto' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.4px' }}>
              Municipal Incident Triage & Verification Console
            </h1>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.88rem', color: '#64748b' }}>
              Real-time multi-hazard telemetry, AI duplication clustering & dispatch management
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button 
              onClick={handleClearAll}
              style={{ background: '#fff1f2', color: '#e11d48', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.55rem 1rem', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              🗑️ Clear / Reset All Database Records
            </button>
            <div style={{ background: '#dcfce7', color: '#166534', padding: '0.45rem 0.9rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></span>
              GRID ONLINE: 99.4% SLA
            </div>
          </div>
        </div>

        {/* Live Verification Queue Table */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          
          <div style={{ padding: '1rem 1.35rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Live Verification Queue</h3>
              <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                {filteredRecords.length} Triage Records Loaded
              </span>
            </div>

            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '0.85rem' }}>🔍</span>
              <input 
                type="text" 
                placeholder="Search ticket #, address, crew..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  padding: '0.45rem 0.85rem 0.45rem 2rem', 
                  borderRadius: '6px', 
                  border: '1px solid #cbd5e1', 
                  fontSize: '0.82rem', 
                  width: '260px',
                  background: 'white',
                  outline: 'none'
                }} 
              />
            </div>
          </div>

          {filteredRecords.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🗑️</div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>Database Issues Cleared</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>All ticket records have been deleted from the database and map locations.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'white', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '0.85rem 1.35rem', fontWeight: 800 }}>Evidence</th>
                  <th style={{ padding: '0.85rem 1.35rem', fontWeight: 800 }}>Ticket & Description</th>
                  <th style={{ padding: '0.85rem 1.35rem', fontWeight: 800 }}>Hazard Score</th>
                  <th style={{ padding: '0.85rem 1.35rem', fontWeight: 800 }}>Location / Ward</th>
                  <th style={{ padding: '0.85rem 1.35rem', fontWeight: 800 }}>Status</th>
                  <th style={{ padding: '0.85rem 1.35rem', fontWeight: 800 }}>Assigned Crew</th>
                  <th style={{ padding: '0.85rem 1.35rem', fontWeight: 800, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((q, i) => (
                  <tr 
                    key={i} 
                    style={{ borderTop: '1px solid #e2e8f0', cursor: 'pointer', transition: 'background-color 0.15s' }}
                    onClick={() => router.push('/verify-resolve')}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; }}
                  >
                    {/* Evidence Photo */}
                    <td style={{ padding: '1rem 1.35rem', width: '80px' }}>
                      <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                        <img src={q.evidenceImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {q.badgeCount && (
                          <div style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.75)', color: 'white', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800 }}>
                            {q.badgeCount}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Ticket & Description */}
                    <td style={{ padding: '1rem 1.35rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                        <span style={{ color: '#1d4ed8', fontWeight: 800, fontSize: '0.85rem' }}>{q.id}</span>
                        <span style={{ background: q.categoryBg, color: q.categoryColor, padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800 }}>
                          {q.category}
                        </span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', marginBottom: '0.25rem' }}>
                        {q.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {q.desc}
                      </div>
                    </td>

                    {/* Hazard Score */}
                    <td style={{ padding: '1rem 1.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: q.scoreBg, color: q.scoreColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem' }}>
                          {q.score}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: q.scoreColor }}>{q.scoreLevel}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{q.scoreImpact}</div>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td style={{ padding: '1rem 1.35rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>📍</span> {q.address}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                        {q.ward}
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '1rem 1.35rem' }}>
                      <span style={{ background: q.statusBg, color: q.statusColor, padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        ● {q.status}
                      </span>
                    </td>

                    {/* Crew */}
                    <td style={{ padding: '1rem 1.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800, border: '1px solid #cbd5e1' }}>
                          {q.crewInitials}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{q.crewName}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{q.crewDept}</div>
                        </div>
                      </div>
                    </td>

                    {/* Actions Column with Delete Button */}
                    <td style={{ padding: '1rem 1.35rem', textAlign: 'right' }}>
                      <button 
                        onClick={(e) => handleDelete(e, q.fullId)}
                        style={{ background: '#fff1f2', color: '#e11d48', border: '1px solid #fecaca', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                        title="Delete ticket from database and map"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </main>
    </div>
  );
}
