import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { CheckSquare, Mail, Lock, Eye, Shield, Globe } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login('citizen');
    navigate('/overview');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 md:p-8 font-sans">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Panel */}
        <div className="md:w-1/2 bg-gradient-to-br from-brand-navy to-brand-blue-dark text-white p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Faint Background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center">
                <CheckSquare className="text-brand-navy" size={24} />
              </div>
              <div>
                <div className="font-extrabold text-2xl tracking-tight leading-none mb-1">
                  Civic<span className="text-brand-orange">Fix</span>
                </div>
                <div className="text-[10px] font-bold tracking-widest text-blue-200 uppercase">
                  Public Works & Citizen Grid
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight mb-6">
              Report civic issues,<br/>
              <span className="text-brand-orange">faster resolutions.</span>
            </h1>
            
            <p className="text-blue-100 text-sm leading-relaxed mb-10 max-w-sm">
              Directly connect with district municipal officers. Track repairs in real-time from report dispatch to signed completion.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="font-bold text-sm mb-1">🛣️ Roads & Grid</div>
                <div className="text-xs text-blue-200">Potholes & traffic signals triage</div>
              </div>
              <div className="bg-white/10 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="font-bold text-sm mb-1">🗑️ Sanitation</div>
                <div className="text-xs text-blue-200">Leaks, drainage & waste triage</div>
              </div>
              <div className="bg-white/10 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="font-bold text-sm mb-1">💡 Lighting</div>
                <div className="text-xs text-blue-200">Public illumination audits</div>
              </div>
              <div className="bg-white/10 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="font-bold text-sm mb-1">🛡️ Verified SLA</div>
                <div className="text-xs text-blue-200">48h escalation guarantee</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12 bg-black/20 rounded-lg p-3 flex justify-between items-center text-xs font-semibold backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              Public Node: Ward #08 Active
            </div>
            <div className="text-blue-200">
              98.4% SLA Resolved
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="md:w-1/2 p-10 flex flex-col relative">
          
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg mb-4">
            <button className="flex-1 py-2 bg-white rounded-md shadow-sm text-sm font-bold text-brand-navy flex items-center justify-center gap-2">
              👤 Citizen Login
            </button>
            <button disabled className="flex-1 py-2 rounded-md text-sm font-semibold text-slate-500 flex items-center justify-center gap-2 opacity-60 cursor-not-allowed" title="Coming soon">
              🛡️ Authority / Officer
            </button>
          </div>
          
          <p className="text-center text-xs text-slate-500 mb-8 max-w-sm mx-auto">
            Citizen portal: file reports, upload geotagged photos, and vote for repairs in your neighborhood.
          </p>

          <div className="flex items-center justify-center gap-3 text-xs font-bold text-slate-500 mb-8 uppercase tracking-wider">
            Authenticate With:
            <span className="bg-blue-100 text-brand-blue px-3 py-1 rounded-full">Official Email</span>
            <span className="text-slate-300">•</span>
            <span className="cursor-not-allowed opacity-60">Mobile SMS</span>
          </div>

          <form onSubmit={handleLogin} className="flex-1 flex flex-col justify-center">
            <div className="mb-5">
              <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                  placeholder="citizen@metropolis.gov or name@domain.com"
                  required
                />
              </div>
            </div>

            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-900">Password</label>
                <a href="#" className="text-xs font-bold text-brand-blue hover:underline">Forgot Password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                  placeholder="Enter confidential credentials"
                  required
                />
                <Eye className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600" size={18} />
              </div>
            </div>

            <div className="flex items-center mb-8">
              <input type="checkbox" id="remember" className="w-4 h-4 text-brand-blue rounded border-slate-300 focus:ring-brand-blue" />
              <label htmlFor="remember" className="ml-2 text-xs font-medium text-slate-600">Remember me on this municipal terminal</label>
            </div>

            <button type="submit" className="w-full bg-brand-navy hover:bg-brand-blue-dark text-white font-bold py-3.5 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2">
              Sign In to CivicFix &rarr;
            </button>
            
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Or Authenticate With</span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            <button type="button" disabled className="w-full bg-slate-100 text-slate-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 opacity-60 cursor-not-allowed">
              🏛️ Municipal Employee SSO / Gov ID
            </button>
            
            <div className="text-center mt-6 text-xs text-slate-500 font-medium">
              New to the municipality grid? <a href="#" className="text-brand-navy font-bold hover:underline">Create an account in 30 seconds</a>
            </div>
          </form>

          <div className="mt-10 flex flex-col items-center pt-6 border-t border-slate-100 text-[10px] text-slate-400 font-semibold text-center">
            <div className="flex items-center justify-center gap-6 mb-2 text-slate-500">
              <span className="flex items-center gap-1.5"><Shield size={12}/> 256-bit SSL Municipal Encryption</span>
              <span className="flex items-center gap-1.5"><Globe size={12}/> Official City Partner Network</span>
            </div>
            CivicFix Public Infrastructure Systems • WCAG 2.1 AAA Compliant
          </div>
        </div>
      </div>
    </div>
  );
}
