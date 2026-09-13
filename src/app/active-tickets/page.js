"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function ActiveTicketsManagementPage() {
  const { issues, updateIssue } = useAppContext();
  
  const activeTicketsList = issues.map((item) => ({
    id: `#${item.id}`,
    fullId: item.id,
    status: item.status === 'Resolved' ? 'RESOLVED & VERIFIED' : item.status === 'In Progress' ? 'ON SITE: FIELD CREW WORKING' : item.isUrgent ? 'FLAGGED URGENT' : 'ASSIGNED: PENDING INTAKE',
    statusType: item.status === 'Resolved' ? 'resolved' : item.status === 'In Progress' ? 'onsite' : item.isUrgent ? 'enroute' : 'assigned',
    slaTime: item.targetSLA || "Within 24 Hours",
    slaStatus: item.isUrgent ? "warning" : "normal",
    hazardScore: item.priorityScore || 8.5,
    title: item.title,
    ward: item.ward || "Ward K-West",
    intersection: item.location,
    crewName: item.assignedUnit || "MCGM Maintenance Crew",
    crewLead: item.crewInitials ? `Unit ${item.crewInitials}` : "Foreman Marcus",
    crewRig: "Rig #V-409",
    progressPct: item.status === 'Resolved' ? 100 : item.status === 'In Progress' ? 65 : 25,
    estCompletion: "3:30 PM",
    updatedAgo: item.time || "Just now",
    category: item.type,
    gpsCoords: item.latitude ? `${item.latitude.toFixed(4)}° N, ${Math.abs(item.longitude).toFixed(4)}° W` : "19.0968° N, 72.8265° W"
  }));

  const [selectedTicketId, setSelectedTicketId] = useState(activeTicketsList[0]?.id || null);
  const [activeFilterTab, setActiveFilterTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [toastMessage, setToastMessage] = useState(null);
  const [splitViewMode, setSplitViewMode] = useState('split');
  const [newRadioMessage, setNewRadioMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const selectedTicket = activeTicketsList.find(t => t.id === selectedTicketId) || activeTicketsList[0];

  const filteredTickets = activeTicketsList.filter(t => {
    if (activeFilterTab === 'enroute' && !t.status.includes('FLAGGED')) return false;
    if (activeFilterTab === 'onsite' && !t.status.includes('ON SITE')) return false;
    if (activeFilterTab === 'pending' && !t.status.includes('ASSIGNED')) return false;
    if (activeFilterTab === 'sla' && t.hazardScore < 8.5) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.ward.toLowerCase().includes(q) ||
        t.crewName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSendRadioMessage = (e) => {
    e.preventDefault();
    if (!newRadioMessage.trim()) return;

    triggerToast(`Radio instruction logged: "${newRadioMessage.trim()}"`);
    setNewRadioMessage('');
  };

  const handlePassToVerification = () => {
    if (selectedTicket) {
      updateIssue(selectedTicket.fullId, { status: 'Resolved' });
      triggerToast(`Ticket ${selectedTicket.id} passed to Verification Queue!`);
    }
  };

  const handleExportSheet = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Title,Ward,Status,Hazard Score,SLA Remaining,Crew"]
      .concat(activeTicketsList.map(t => `"${t.id}","${t.title}","${t.ward}","${t.status}","${t.hazardScore}","${t.slaTime}","${t.crewName}"`))
      .join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Mumbai_Active_Tickets_Export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast("Exported Active Tickets Sheet to CSV");
  };

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: 'calc(100vh - 60px)' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '75px',
          right: '25px',
          zIndex: 9999,
          background: '#0f3b7a',
          color: 'white',
          padding: '0.85rem 1.25rem',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          fontSize: '0.88rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          borderLeft: '4px solid #f59e0b'
        }}>
          <span>⚡</span> {toastMessage}
        </div>
      )}

      {/* LEFT NAVIGATION SIDEBAR (250px) */}
      <aside style={{ width: '250px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#1d4ed8', background: '#eff6ff', padding: '0.6rem 0.9rem', borderRadius: '6px', letterSpacing: '0.5px' }}>
            AUTHORITY MODE <span>🛡️</span>
          </div>
        </div>

        <nav style={{ padding: '1rem 0', flex: 1 }}>
          <Link href="/triage" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1.5rem', color: '#334155', fontWeight: 600, fontSize: '0.92rem', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Triage Console
          </Link>

          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1.5rem', color: '#334155', fontWeight: 600, fontSize: '0.92rem', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            1KM AI Clusters Dashboard
          </Link>

          <Link href="/verify-resolve" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1.5rem', color: '#334155', fontWeight: 600, fontSize: '0.92rem', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
            Verify & Resolve
          </Link>

          <Link href="/active-tickets" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1.5rem', background: '#0f3b7a', color: 'white', fontWeight: 700, borderLeft: '4px solid #f59e0b', fontSize: '0.92rem', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Active Tickets
          </Link>

          <Link href="/alerts" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1.5rem', color: '#334155', fontWeight: 600, fontSize: '0.92rem', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            Alerts Stream
          </Link>
        </nav>

        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80" alt="Officer" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #cbd5e1' }} />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>Officer Dispatch</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Badge #9042</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, padding: '1.75rem 2rem', overflowX: 'hidden' }}>
        
        {/* Breadcrumb & Action Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              GRID OPERATIONS &gt; <span style={{ color: '#1d4ed8' }}>ACTIVE TICKETS HUB</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
                Active Tickets Management
              </h1>
              <span style={{ background: '#fff7ed', border: '1px solid #ffedd5', color: '#c2410c', fontSize: '0.78rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ea580c' }}></span>
                {activeTicketsList.length} Tickets in Field Execution
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={handleExportSheet} style={{ background: 'white', border: '1px solid #cbd5e1', color: '#334155', padding: '0.55rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
              📥 Export Sheet
            </button>
            <button onClick={() => setSplitViewMode(splitViewMode === 'split' ? 'full-list' : 'split')} style={{ background: 'white', border: '1px solid #cbd5e1', color: '#334155', padding: '0.55rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
              🔲 {splitViewMode === 'split' ? 'Full List View' : 'Split View'}
            </button>
          </div>
        </div>

        {/* 4 TOP KPI METRICS CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.1rem 1.25rem' }}>
            <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 800 }}>ACTIVE WORK ORDERS</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.4rem' }}>{activeTicketsList.length}</div>
            <div style={{ height: '3px', background: '#1d4ed8', width: '60%', marginTop: '0.85rem' }}></div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.1rem 1.25rem' }}>
            <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 800 }}>FIELD CREWS DEPLOYED</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.4rem' }}>14</div>
            <div style={{ height: '3px', background: '#16a34a', width: '80%', marginTop: '0.85rem' }}></div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.1rem 1.25rem' }}>
            <div style={{ color: '#dc2626', fontSize: '0.72rem', fontWeight: 800 }}>NEAR SLA BREACH (&lt;2H)</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#dc2626', marginTop: '0.4rem' }}>9</div>
            <div style={{ height: '3px', background: '#dc2626', width: '100%', marginTop: '0.85rem' }}></div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.1rem 1.25rem' }}>
            <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 800 }}>AVG. RESPONSE TIME</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.4rem' }}>3.8<span style={{ fontSize: '1.2rem' }}>h</span></div>
            <div style={{ height: '3px', background: '#16a34a', width: '90%', marginTop: '0.85rem' }}></div>
          </div>

        </div>

        {/* FILTER & SORT BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveFilterTab('all')} style={{ background: activeFilterTab === 'all' ? '#1d4ed8' : 'white', color: activeFilterTab === 'all' ? 'white' : '#475569', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
              All Active ({activeTicketsList.length})
            </button>
            <button onClick={() => setActiveFilterTab('sla')} style={{ background: activeFilterTab === 'sla' ? '#fee2e2' : 'white', color: '#dc2626', border: '1px solid #fca5a5', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
              ⚠ SLA Warning &lt;2h
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <input type="text" placeholder="Search ticket #, ward, crew..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '0.45rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', width: '240px' }} />
          </div>
        </div>

        {/* TWO COLUMN GRID LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: splitViewMode === 'split' ? '1fr 430px' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* LEFT COLUMN: ACTIVE TICKETS LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredTickets.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '3rem 2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>No Active Tickets Found</h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
                  There are currently no tickets in field execution. Submit a new report to dispatch field units.
                </p>
              </div>
            ) : (
              filteredTickets.map(ticket => {
                const isSelected = ticket.id === selectedTicket?.id;

                return (
                  <div 
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #1d4ed8' : '1px solid #e2e8f0',
                      boxShadow: isSelected ? '0 4px 16px rgba(29,78,216,0.12)' : '0 1px 3px rgba(0,0,0,0.02)',
                      padding: '1.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1d4ed8', background: '#eff6ff', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                          {ticket.id}
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '12px', background: '#dbeafe', color: '#1e40af' }}>
                          ● {ticket.status}
                        </span>
                      </div>

                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: ticket.hazardScore > 8.5 ? '#dc2626' : '#ea580c' }}>
                        Priority: {ticket.hazardScore}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                      {ticket.title}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, marginBottom: '0.85rem' }}>
                      📍 {ticket.ward} • {ticket.intersection}
                    </div>

                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>
                        <span>👷 {ticket.crewName}</span>
                        <span style={{ color: '#1d4ed8' }}>{ticket.progressPct}% Completed</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT COLUMN: TELEMETRY PANE */}
          {selectedTicket && splitViewMode === 'split' && (
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', position: 'sticky', top: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                  Field Telemetry: {selectedTicket.id}
                </div>
                <button onClick={handlePassToVerification} style={{ background: '#166534', color: 'white', border: 'none', padding: '0.45rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                  ✓ Pass to Verification
                </button>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Location & GPS</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{selectedTicket.intersection}</div>
                <div style={{ fontSize: '0.78rem', color: '#1d4ed8', fontWeight: 700, marginTop: '0.15rem' }}>GPS: {selectedTicket.gpsCoords}</div>
              </div>

              {/* Radio Log Form */}
              <form onSubmit={handleSendRadioMessage} style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Broadcast Radio Instruction</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" placeholder="Type radio log message..." value={newRadioMessage} onChange={(e) => setNewRadioMessage(e.target.value)} style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }} />
                  <button type="submit" style={{ background: '#0f3b7a', color: 'white', border: 'none', padding: '0.5rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>Broadcast</button>
                </div>
              </form>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
