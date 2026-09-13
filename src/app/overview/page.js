"use client";
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function Overview() {
  const { issues } = useAppContext();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [selectedIssueId, setSelectedIssueId] = useState(null);

  const citizenIssues = issues;

  const getStatusStyle = (status) => {
    if (status === 'In Progress') return { bg: '#dbeafe', color: '#1e40af' };
    if (status === 'Pending Review' || status === 'Submitted') return { bg: '#ffedd5', color: '#c2410c' };
    if (status === 'Resolved') return { bg: '#dcfce7', color: '#166534' };
    if (status === 'Flagged Urgent') return { bg: '#991b1b', color: 'white' };
    return { bg: '#fee2e2', color: '#991b1b' };
  };
  
  const getTypeStyle = (type) => {
    if (type.includes('POTHOLE') || type.includes('ROAD')) return { bg: '#eff6ff', color: '#2563eb' };
    if (type.includes('LIGHT') || type.includes('STREETLIGHT')) return { bg: '#f1f5f9', color: '#475569' };
    if (type.includes('SANITATION') || type.includes('GARBAGE')) return { bg: '#fef3c7', color: '#b45309' };
    if (type.includes('WATER')) return { bg: '#fee2e2', color: '#dc2626' };
    if (type.includes('TREE')) return { bg: '#dcfce7', color: '#15803d' };
    if (type.includes('SIGNAL') || type.includes('BARRIER')) return { bg: '#ffe4e6', color: '#e11d48' };
    return { bg: '#f1f5f9', color: '#475569' };
  };

  const getBarColor = (score) => {
    if (score >= 9) return '#dc2626';
    if (score >= 8) return '#f59e0b';
    return '#8b5cf6';
  };

  // Mumbai map position distribution coordinates across GIS viewport
  const mapPositions = [
    { x: '18%', y: '45%' }, // Juhu Tara Road
    { x: '22%', y: '88%' }, // Marine Drive
    { x: '24%', y: '58%' }, // Hill Road Bandra
    { x: '45%', y: '25%' }, // WEH Goregaon
    { x: '21%', y: '68%' }, // Sea Link Toll
    { x: '48%', y: '72%' }, // Dadar TT Circle
    { x: '35%', y: '38%' }, // S.V. Road Andheri
    { x: '28%', y: '92%' }, // Colaba Causeway
    { x: '30%', y: '20%' }, // Link Road Malad
    { x: '32%', y: '76%' }, // Lower Parel
    { x: '75%', y: '35%' }, // Powai Lake
    { x: '25%', y: '86%' }, // Churchgate
    { x: '52%', y: '55%' }, // BKC Connector
    { x: '15%', y: '78%' }, // Breach Candy
    { x: '42%', y: '42%' }, // Vile Parle East
    { x: '70%', y: '56%' }, // Chembur Naka
    { x: '78%', y: '48%' }, // LBS Marg Ghatkopar
    { x: '20%', y: '73%' }, // Worli Sea Face
    { x: '48%', y: '12%' }, // Borivali Skywalk
    { x: '55%', y: '65%' }, // Sion Circle
    { x: '58%', y: '70%' }  // Eastern Freeway Wadala
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 64px)', paddingBottom: '100px', display: 'flex', flexDirection: 'column' }}>
      <main style={{ padding: '2.5rem 4rem', maxWidth: '1400px', margin: '0 auto', flex: 1, width: '100%' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.75rem' }}>
              <h1 style={{ fontSize: '2.75rem', fontWeight: 700, margin: 0, color: 'var(--panel-blue-dark)' }}>Good morning, Maya Lin 👋</h1>
              <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '0.45rem 1rem', borderRadius: '20px', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#f59e0b' }}>●</span> {citizenIssues.length} Active Issues in Greater Mumbai Region
              </span>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span>🏢 Greater Mumbai • MCGM Municipal Corporation</span>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <span style={{ opacity: 0.7 }}>Precinct ID #BOM-4092</span>
            </div>
          </div>
          <Link href="/report" style={{ background: '#f59e0b', color: 'var(--text-primary)', padding: '1rem 2rem', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', boxShadow: '0 4px 8px -1px rgba(245, 158, 11, 0.3)' }}>
            <span style={{ fontSize: '1.75rem' }}>+</span> 
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.15rem', lineHeight: 1, marginBottom: '4px' }}>Report an Issue</span>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.8, lineHeight: 1 }}>AVG RESPONSE 3.8H</span>
            </div>
          </Link>
        </div>

        {/* View Mode Toggle Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', background: '#f1f5f9', padding: '0.5rem', borderRadius: '32px' }}>
            <button style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: 'none', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: '24px', fontSize: '1.1rem' }}>Mumbai Reports ({citizenIssues.length})</button>
            <button style={{ padding: '0.75rem 1.5rem', background: 'white', border: 'none', fontWeight: 600, color: 'var(--panel-blue-dark)', cursor: 'pointer', borderRadius: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', fontSize: '1.1rem' }}>Active Wards (Wards A - S)</button>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '32px', padding: '0.5rem' }}>
            <button 
              onClick={() => setViewMode('list')}
              style={{ 
                padding: '0.7rem 1.5rem', 
                background: viewMode === 'list' ? 'var(--panel-blue-dark)' : 'transparent', 
                color: viewMode === 'list' ? 'white' : 'var(--text-secondary)', 
                border: 'none', 
                borderRadius: '24px', 
                fontWeight: 600, 
                fontSize: '1.05rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              List View ({citizenIssues.length})
            </button>
            <button 
              onClick={() => setViewMode('map')}
              style={{ 
                padding: '0.7rem 1.5rem', 
                background: viewMode === 'map' ? 'var(--panel-blue-dark)' : 'transparent', 
                color: viewMode === 'map' ? 'white' : 'var(--text-secondary)', 
                border: 'none', 
                borderRadius: '24px', 
                fontWeight: 600, 
                fontSize: '1.05rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
              Mumbai GIS Map View
            </button>
          </div>
        </div>

        {/* LIST VIEW MODE */}
        {viewMode === 'list' && citizenIssues.length === 0 && (
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.4rem', fontWeight: 800 }}>No Reports in Database</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 1.5rem 0' }}>There are currently no civic incident reports recorded.</p>
            <Link href="/report" className="btn btn-primary" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', textDecoration: 'none', borderRadius: '8px', fontWeight: 700 }}>
              + Submit First Report
            </Link>
          </div>
        )}

        {viewMode === 'list' && citizenIssues.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
            {citizenIssues.map(issue => (
              <Link href={`/issue/${issue.id}`} key={issue.id} style={{ textDecoration: 'none', color: 'inherit', background: 'white', borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }} 
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                
                <div style={{ padding: '2rem', flex: 1 }}>
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', fontWeight: 700, color: getTypeStyle(issue.type).color, background: getTypeStyle(issue.type).bg, padding: '0.45rem 0.85rem', borderRadius: '8px' }}>
                        {issue.typeIcon || '⚠️'} {issue.type}
                      </span>
                      <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>#{issue.id}</span>
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, background: getStatusStyle(issue.status).bg, color: getStatusStyle(issue.status).color, padding: '0.45rem 1.25rem', borderRadius: '24px' }}>
                      ● {issue.status}
                    </span>
                  </div>
                  
                  {/* Card Body */}
                  <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    {/* Image with Badge */}
                    <div style={{ position: 'relative', width: '150px', height: '150px', flexShrink: 0 }}>
                      <img src={issue.image} alt={issue.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                      <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: issue.badgeColor || 'rgba(0,0,0,0.6)', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {issue.imageBadge || 'Photo'}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '1.4rem', margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{issue.title}</h3>
                      <div style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: 'auto', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <span style={{ marginTop: '2px' }}>📍</span> {issue.location}
                      </div>
                      
                      <div style={{ marginTop: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                          <span style={{ color: getBarColor(issue.priorityScore) }}>Priority Score {issue.priorityScore}/10</span>
                          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{issue.impact}</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${issue.priorityScore * 10}%`, height: '100%', background: getBarColor(issue.priorityScore) }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Card Footer */}
                <div style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: issue.status === 'Flagged Urgent' ? '#fff1f2' : '#f8fafc', fontSize: '1.05rem', color: issue.status === 'Flagged Urgent' ? '#e11d48' : 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
                    <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {issue.status === 'Flagged Urgent' ? '⚠' : (issue.confirmations > 0 ? '👍' : '✅')} 
                      {issue.status === 'Flagged Urgent' ? issue.confirmations + ' duplicate reports merged' : (issue.confirmations > 0 ? issue.confirmations + ' Upvotes' : issue.time)}
                    </span>
                    {issue.confirmations > 0 && <span>{issue.time}</span>}
                  </div>
                  <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {issue.updateIcon || '⏱️'} {issue.update || 'Awaiting Triage'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* MUMBAI GIS MAP VIEW MODE WITH ALL 21 CASES SHOWCASING DAMAGE IMAGES */}
        {viewMode === 'map' && (
          <div style={{ background: 'white', borderRadius: '24px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
            
            {/* Map Header Control Panel */}
            <div style={{ padding: '1.25rem 2rem', background: '#f8fafc', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.25rem' }}>🗺️</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: 800 }}>Mumbai Civic Infrastructure GIS Map</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Displaying {citizenIssues.length} active incident locations across Mumbai Wards with damage photo callouts</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ background: '#dcfce7', color: '#166534', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></span> MCGM Live Telemetry
                </span>
                <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                  {citizenIssues.length} Mumbai Pins Rendered
                </span>
              </div>
            </div>

            {/* Interactive Vector GIS Map Canvas */}
            <div style={{ position: 'relative', height: '720px', background: '#e2e8f0', overflow: 'hidden' }}>
              
              <svg width="100%" height="100%" viewBox="0 0 1200 720" preserveAspectRatio="xMidYMid slice" style={{ background: '#e2e8f0' }}>
                {/* Arabian Sea & Water Bodies */}
                <path d="M 0,0 L 220,0 Q 180,300 240,720 L 0,720 Z" fill="#e0f2fe" opacity="0.8"/>
                <path d="M 720,240 Q 920,280 1040,260 L 1200,340 L 1200,720 L 680,720 Z" fill="#e0f2fe" opacity="0.6"/>
                <path d="M 680,220 Q 780,180 880,240 L 820,320 Q 720,280 680,220 Z" fill="#bae6fd" opacity="0.9"/> {/* Powai Lake */}

                {/* Major Mumbai Arterials & Western Express Highway */}
                <line x1="240" y1="720" x2="520" y2="0" stroke="#cbd5e1" strokeWidth="20"/>
                <line x1="240" y1="720" x2="520" y2="0" stroke="white" strokeWidth="14"/> {/* Western Express Highway */}
                <line x1="560" y1="720" x2="820" y2="0" stroke="#cbd5e1" strokeWidth="16"/>
                <line x1="560" y1="720" x2="820" y2="0" stroke="white" strokeWidth="10"/> {/* LBS Marg / Eastern Express */}
                <line x1="220" y1="520" x2="560" y2="480" stroke="#fed7aa" strokeWidth="14"/>
                <line x1="220" y1="520" x2="560" y2="480" stroke="#ffedd5" strokeWidth="8"/> {/* BKC Connector */}

                {/* Ward Labels */}
                <text x="240" y="680" fontSize="13" fontWeight="800" fill="#64748b">South Mumbai (Ward A-D)</text>
                <text x="260" y="520" fontSize="13" fontWeight="800" fill="#64748b">Bandra / Khar (Ward H-West)</text>
                <text x="500" y="500" fontSize="13" fontWeight="800" fill="#1d4ed8">BKC Hub</text>
                <text x="310" y="360" fontSize="13" fontWeight="800" fill="#64748b">Andheri / Juhu (Ward K-West)</text>
                <text x="480" y="240" fontSize="13" fontWeight="800" fill="#64748b">Goregaon / Malad (Ward P)</text>
                <text x="740" y="220" fontSize="13" fontWeight="800" fill="#059669">Powai Lake Reserve (Ward S)</text>
                <text x="750" y="440" fontSize="13" fontWeight="800" fill="#64748b">Ghatkopar / Chembur (Ward N/M)</text>
              </svg>

              {/* RENDER ALL 21 MUMBAI ISSUE PINS WITH DAMAGE IMAGES DISPLAYED DIRECTLY ON CALLOUT CARDS */}
              {citizenIssues.map((issue, idx) => {
                const pos = mapPositions[idx % mapPositions.length];
                const isSelected = selectedIssueId === issue.id;

                return (
                  <div 
                    key={issue.id}
                    style={{
                      position: 'absolute',
                      left: pos.x,
                      top: pos.y,
                      transform: 'translate(-50%, -100%)',
                      zIndex: isSelected ? 60 : (idx + 10),
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    onClick={() => setSelectedIssueId(issue.id)}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-50%, -105%) scale(1.04)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(-50%, -100%) scale(1)'; }}
                  >
                    {/* RICH FLOATING LOCATION CALLOUT CARD WITH DAMAGE PHOTO IMAGE */}
                    <div 
                      style={{
                        background: 'white',
                        borderRadius: '12px',
                        border: `2px solid ${isSelected ? '#2563eb' : (issue.priorityScore >= 8.8 ? '#dc2626' : '#cbd5e1')}`,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                        padding: '0.65rem',
                        width: '250px',
                        display: 'flex',
                        gap: '0.65rem',
                        alignItems: 'center',
                        position: 'relative',
                        marginBottom: '6px'
                      }}
                    >
                      {/* Issue Thumbnail Photo */}
                      <div style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid #e2e8f0' }}>
                        <img src={issue.image} alt={issue.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: '2px', left: '2px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '0.1rem 0.3rem', borderRadius: '3px', fontSize: '0.58rem', fontWeight: 800 }}>
                          Mumbai Photo
                        </div>
                      </div>

                      {/* Issue Details Callout Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: getTypeStyle(issue.type).color, background: getTypeStyle(issue.type).bg, padding: '0.12rem 0.4rem', borderRadius: '4px' }}>
                            {issue.typeIcon || '⚠️'} {issue.type}
                          </span>
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#dc2626', background: '#fee2e2', padding: '0.12rem 0.4rem', borderRadius: '4px' }}>
                            {issue.priorityScore}/10
                          </span>
                        </div>

                        <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.15rem' }}>
                          {issue.title}
                        </div>

                        <div style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <span>📍</span> {issue.location}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.3rem' }}>
                          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: getStatusStyle(issue.status).color }}>
                            ● {issue.status}
                          </span>
                          <Link href={`/issue/${issue.id}`} style={{ fontSize: '0.68rem', fontWeight: 800, color: '#1d4ed8', textDecoration: 'none' }}>
                            Inspect →
                          </Link>
                        </div>
                      </div>

                      {/* Callout Triangle pointer */}
                      <div 
                        style={{
                          position: 'absolute',
                          bottom: '-8px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 0,
                          height: 0,
                          borderLeft: '8px solid transparent',
                          borderRight: '8px solid transparent',
                          borderTop: `8px solid ${isSelected ? '#2563eb' : (issue.priorityScore >= 8.8 ? '#dc2626' : '#cbd5e1')}`
                        }}
                      ></div>
                    </div>

                    {/* RED/BLUE GEOLOCATION PIN MARKER */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div 
                        style={{ 
                          width: '34px', 
                          height: '34px', 
                          borderRadius: '50%', 
                          background: issue.priorityScore >= 8.8 ? '#dc2626' : '#2563eb', 
                          border: '3px solid white', 
                          color: 'white', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontWeight: 900, 
                          fontSize: '0.95rem',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.3)' 
                        }}
                      >
                        📍
                      </div>
                      <div style={{ width: '12px', height: '4px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)', marginTop: '2px' }}></div>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        )}

      </main>

      {/* Bottom Navigation */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid var(--border-color)', zIndex: 100, display: 'flex', justifyContent: 'center', padding: '0.75rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '800px', position: 'relative' }}>
          
          <Link href="/overview" onClick={() => setViewMode('list')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 1rem', cursor: 'pointer', color: 'var(--panel-blue-dark)', textDecoration: 'none' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '6px' }}>Home</span>
          </Link>

          <Link href="/overview" onClick={() => setViewMode('list')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 1rem', cursor: 'pointer', color: 'var(--text-secondary)', textDecoration: 'none' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '6px' }}>My Issues</span>
          </Link>

          {/* Floating Report Action Button */}
          <Link href="/report" style={{ position: 'relative', width: '100px', display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>
            <div style={{ position: 'absolute', top: '-40px', width: '80px', height: '80px', background: '#f97316', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2.5rem', boxShadow: '0 4px 10px rgba(249, 115, 22, 0.4)', cursor: 'pointer', border: '5px solid #f8fafc' }}>
              +
            </div>
            <span style={{ position: 'absolute', bottom: '0.5rem', fontSize: '0.9rem', fontWeight: 700, color: '#f97316' }}>Report</span>
          </Link>

          <div onClick={() => setViewMode('map')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 1rem', cursor: 'pointer', color: viewMode === 'map' ? 'var(--panel-blue-dark)' : 'var(--text-secondary)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '6px' }}>Map Pulse</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 1rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '6px' }}>Profile</span>
          </div>
          
        </div>
      </nav>

      {/* Footer */}
      <footer style={{ padding: '2.5rem 4rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem', color: 'var(--text-secondary)', background: 'white' }}>
        <div>© 2025 CivicFix Municipal Infrastructure Dispatch. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '2.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          <span style={{ cursor: 'pointer' }}>Public Ticker</span>
          <span style={{ cursor: 'pointer' }}>Accessibility (WCAG 2.1)</span>
          <span style={{ cursor: 'pointer' }}>Agency Portal</span>
        </div>
      </footer>
    </div>
  );
}
