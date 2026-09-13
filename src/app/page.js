"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

export default function Home() {
  const [loginType, setLoginType] = useState('citizen');
  const router = useRouter();
  const { login } = useAppContext();

  const handleLogin = (e) => {
    e.preventDefault();
    login(loginType);
    if (loginType === 'citizen') {
      router.push('/overview');
    } else {
      router.push('/triage');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <main style={{
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        background: 'var(--bg-white)',
        borderRadius: '20px',
        boxShadow: 'var(--shadow-main)',
        display: 'flex',
        overflow: 'hidden',
        minHeight: '650px'
      }}>
      
      {/* Left Panel - Branding & Info */}
      <div style={{
        flex: '1.2',
        background: 'var(--panel-blue)',
        color: 'white',
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Logo Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '4rem' }}>
          <div style={{ background: 'white', padding: '0.5rem', borderRadius: '8px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z" stroke="var(--panel-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 12L11 15L16 9" stroke="var(--panel-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '-0.5px' }}>CivicFix</h2>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>
              Public Works & Citizen Grid
            </div>
          </div>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: '2.5rem', lineHeight: '1.2', marginBottom: '1.5rem', fontWeight: 600 }}>
          Report civic issues,<br/>
          <span style={{ color: 'var(--text-orange)' }}>faster resolutions.</span>
        </h1>
        
        <p style={{ fontSize: '1rem', lineHeight: '1.5', opacity: 0.9, marginBottom: '3rem', maxWidth: '350px' }}>
          Directly connect with district municipal officers. Track repairs in real-time from report dispatch to signed completion.
        </p>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: 'auto' }}>
          {/* Card 1 */}
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.25rem', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 500 }}>
              <span style={{ fontSize: '1.2rem' }}>⛙</span> Roads & Grid
            </div>
            <p style={{ fontSize: '0.85rem', opacity: 0.8, margin: 0 }}>Potholes & traffic signals triage</p>
          </div>
          {/* Card 2 */}
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.25rem', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 500 }}>
              <span style={{ fontSize: '1.2rem' }}>💧</span> Sanitation
            </div>
            <p style={{ fontSize: '0.85rem', opacity: 0.8, margin: 0 }}>Leaks, drainage & waste triage</p>
          </div>
          {/* Card 3 */}
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.25rem', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 500 }}>
              <span style={{ fontSize: '1.2rem' }}>💡</span> Lighting
            </div>
            <p style={{ fontSize: '0.85rem', opacity: 0.8, margin: 0 }}>Public illumination audits</p>
          </div>
          {/* Card 4 */}
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.25rem', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 500 }}>
              <span style={{ fontSize: '1.2rem' }}>🛡️</span> Verified SLA
            </div>
            <p style={{ fontSize: '0.85rem', opacity: 0.8, margin: 0 }}>48h escalation guarantee</p>
          </div>
        </div>

        {/* Footer Status */}
        <div style={{ 
          background: 'var(--panel-blue-dark)', 
          padding: '0.75rem 1rem', 
          borderRadius: '6px', 
          fontSize: '0.8rem',
          display: 'inline-flex',
          gap: '1.5rem',
          marginTop: '3rem',
          width: 'fit-content'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }}></div>
            Public Node: Ward #08 Active
          </div>
          <div style={{ opacity: 0.8 }}>98.4% SLA Resolved</div>
        </div>
      </div>


      {/* Right Panel - Login */}
      <div style={{ flex: '1', padding: '4rem 3.5rem', display: 'flex', flexDirection: 'column' }}>
        
        {/* Toggle */}
        <div className="toggle-group">
          <button 
            className={`toggle-btn ${loginType === 'citizen' ? 'active' : ''}`}
            onClick={() => setLoginType('citizen')}
          >
            👤 Citizen Login
          </button>
          <button 
            className={`toggle-btn ${loginType === 'authority' ? 'active' : ''}`}
            onClick={() => setLoginType('authority')}
          >
            🏛️ Authority / Officer
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem', lineHeight: '1.5', minHeight: '40px' }}>
          {loginType === 'citizen' 
            ? 'Citizen portal: file reports, upload geotagged photos, and vote for repairs in your neighborhood.'
            : 'Authority console: triage reports, dispatch crews, and monitor real-time infrastructure SLA.'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          <span>AUTHENTICATE WITH:</span>
          <span style={{ background: 'var(--bg-blue-light)', color: 'var(--panel-blue-dark)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>Official Email</span>
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }}></span>
          <span>Mobile SMS</span>
        </div>

        {/* Form */}
        <form style={{ marginBottom: '2rem' }}>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="input-icon-wrapper">
              <span className="input-icon">✉️</span>
              <input type="email" className="input-field" placeholder="citizen@metropolis.gov or name@domain.com" />
            </div>
          </div>

          <div className="input-group">
            <div className="input-label">
              <span>Password</span>
              <a href="#" style={{ fontSize: '0.8rem' }}>Forgot Password?</a>
            </div>
            <div className="input-icon-wrapper">
              <span className="input-icon">🔒</span>
              <input type="password" className="input-field" placeholder="Enter confidential credentials" />
              <span className="input-icon-right">👁️</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <input type="checkbox" id="remember" style={{ accentColor: 'var(--panel-blue-dark)' }} />
            <label htmlFor="remember">Remember me on this municipal terminal</label>
          </div>

          <button onClick={handleLogin} className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', width: '100%', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '1rem' }}>
            Sign In to CivicFix <span>→</span>
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>OR AUTHENTICATE WITH</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
        </div>

        <button onClick={(e) => { setLoginType('authority'); handleLogin(e); }} className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', width: '100%', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', padding: '1rem' }}>
          🏛️ Municipal Employee SSO / Gov ID
        </button>

        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 'auto' }}>
          New to the municipality grid? <a href="#">Create an account in 30 seconds</a>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2rem', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            🔒 256-bit SSL Municipal Encryption
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            🛡️ Official City Partner Network
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.65rem', color: '#cbd5e1', marginTop: '0.5rem' }}>
          CivicFix Public Infrastructure Systems • WCAG 2.1 AAA Compliant
        </div>
      </div>
      </main>
    </div>
  );
}
