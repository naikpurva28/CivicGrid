"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

export default function Navbar() {
  const pathname = usePathname();
  const { notifications } = useAppContext();
  
  // Hide navbar on login page
  if (pathname === '/') return null;
  
  const isAuthority = pathname.startsWith('/triage') || pathname === '/verify-resolve';

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.65rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Brand & Mode */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
        <Link href={isAuthority ? "/triage" : "/overview"} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{ background: '#1d4ed8', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <div style={{ position: 'absolute', width: '8px', height: '8px', border: '2px solid #1d4ed8', background: '#f97316', borderRadius: '50%', right: '-2px', top: '-2px' }}></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
              <span style={{ color: '#1d4ed8' }}>Civic</span><span style={{ color: '#f97316' }}>Fix</span>
            </div>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
              {isAuthority ? 'AUTHORITY DISPATCH' : 'CITIZEN PORTAL'}
            </span>
          </div>
        </Link>
      </div>

      {/* Center Search Bar */}
      <div style={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
          <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, color: '#64748b' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder={isAuthority ? "Search by Ticket ID, Sector, or Urgency level..." : "Search civic tickets, tracking IDs, infrastructure..."}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.6rem',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1.5rem', flex: 1.2 }}>
        {/* Nav Links */}
        {!isAuthority && (
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
            <Link href="/overview" style={{ color: pathname === '/overview' ? 'var(--panel-blue-dark)' : 'var(--text-secondary)', fontWeight: pathname === '/overview' ? 700 : 600, textDecoration: 'none' }}>
              Overview
            </Link>
            <Link href="/report" style={{ color: pathname === '/report' ? 'var(--panel-blue-dark)' : 'var(--text-secondary)', fontWeight: pathname === '/report' ? 700 : 600, textDecoration: 'none' }}>
              Report Issue
            </Link>
          </div>
        )}

        {isAuthority && (
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.45rem', background: '#dcfce7', padding: '0.35rem 0.75rem', borderRadius: '16px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></div>
            GRID ONLINE: 99.4% SLA
          </div>
        )}

        {/* User Profile Avatar */}
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80" 
            alt="Avatar" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>

        {/* Logout */}
        <div style={{ display: 'flex', alignItems: 'center', borderLeft: '1px solid #e2e8f0', paddingLeft: '0.75rem' }}>
          <Link href="/" style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textDecoration: 'none' }} title="Log out">
            Log out
          </Link>
        </div>
      </div>
    </nav>
  );
}
