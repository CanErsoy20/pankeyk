import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { TranslationProvider } from './translation-module/TranslationProvider';
import LanguageSelector from './components/LanguageSelector';
import HomePage from './pages/HomePage';
import CompanyPage from './pages/CompanyPage';

// Simple Nav Component for styling
const NavBar = () => {
  const location = useLocation();
  const linkStyle = (path: string) => ({
    marginRight: '20px',
    textDecoration: 'none',
    color: location.pathname === path ? '#0056b3' : '#333',
    fontWeight: location.pathname === path ? 'bold' : 'normal',
    borderBottom: location.pathname === path ? '2px solid #0056b3' : 'none',
    paddingBottom: '5px'
  });

  return (
    <nav style={{ padding: '15px 40px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2 style={{ margin: '0 30px 0 0', color: '#d32f2f' }}>AROL GROUP</h2>
        <Link to="/" style={linkStyle('/')}>HOME</Link>
        <Link to="/company" style={linkStyle('/company')}>COMPANY</Link>
      </div>
      <LanguageSelector />
    </nav>
  );
};

function App() {
  return (
    <TranslationProvider>
      <BrowserRouter>
        <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: '#333', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/company" element={<CompanyPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TranslationProvider>
  );
}

export default App;