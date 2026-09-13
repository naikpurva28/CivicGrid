import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

import TopNav from './components/TopNav';
import BottomMobileNav from './components/BottomMobileNav';
import Footer from './components/Footer';

import Login from './pages/Login';
import Overview from './pages/Overview';
import Report from './pages/Report';
import IssueDetail from './pages/IssueDetail';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      {children}
      <Footer />
      <BottomMobileNav />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/report" element={<Report />} />
            <Route path="/issue/:id" element={<IssueDetail />} />
          </Routes>
        </AppLayout>
      </Router>
    </AppProvider>
  );
}

export default App;
