import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { TranslationProvider } from './translation-module/TranslationProvider';
import LanguageSelector from './components/LanguageSelector';
import HomePage from './pages/pages/HomePage';
import CompanyPage from './pages/pages/CompanyPage';
import CustomerCarePage from "./pages/pages/CustomerCarePage.tsx";
import ContactPage from "./pages/pages/ContactPage.tsx";
import WorkWithUsPage from "./pages/pages/WorkWithUsPage.tsx";

// Simple Nav Component for styling
const NavBar = () => {
  const location = useLocation();
  const [contactOpen, setContactOpen] = React.useState(false);

  const linkStyle = (path: string) => ({
    marginRight: '20px',
    textDecoration: 'none',
    color: location.pathname === path ? '#0056b3' : '#333',
    fontWeight: location.pathname === path ? 'bold' : 'normal',
    borderBottom: location.pathname === path ? '2px solid #0056b3' : 'none',
    paddingBottom: '5px'
  });

  return (
      <nav
          style={{
            padding: '15px 40px',
            borderBottom: '1px solid #ddd',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#fff'
          }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2 style={{ margin: '0 30px 0 0', color: '#d32f2f' }}>
            AROL GROUP
          </h2>

          <Link to="/" style={linkStyle('/')}>HOME</Link>
          <Link to="/company" style={linkStyle('/company')}>COMPANY</Link>
          <Link to="/customerCare" style={linkStyle('/customerCare')}>
            CUSTOMER CARE
          </Link>

          {/* CONTACT DROPDOWN */}
          <div
              style={{ position: 'relative', marginRight: '20px' }}
              onMouseEnter={() => setContactOpen(true)}
              onMouseLeave={() => setContactOpen(false)}
          >
          <span
              style={{
                cursor: 'pointer',
                color:
                    location.pathname === '/contact' ||
                    location.pathname === '/workWithUs'
                        ? '#0056b3'
                        : '#333',
                fontWeight:
                    location.pathname === '/contact' ||
                    location.pathname === '/workWithUs'
                        ? 'bold'
                        : 'normal',
                borderBottom:
                    location.pathname === '/contact' ||
                    location.pathname === '/workWithUs'
                        ? '2px solid #0056b3'
                        : 'none',
                paddingBottom: '5px'
              }}
          >
            CONTACT ▾
          </span>

            {contactOpen && (
                <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      background: 'white',
                      border: '1px solid #ddd',
                      minWidth: '180px',
                      zIndex: 10
                    }}
                >
                  <Link
                      to="/contact"
                      style={{
                        display: 'block',
                        padding: '10px',
                        textDecoration: 'none',
                        color: '#333'
                      }}
                  >
                    Contact
                  </Link>

                  <Link
                      to="/workWithUs"
                      style={{
                        display: 'block',
                        padding: '10px',
                        textDecoration: 'none',
                        color: '#333'
                      }}
                  >
                    Work with us
                  </Link>
                </div>
            )}
          </div>
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
            <Route path="/customerCare" element={<CustomerCarePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/workWithUs" element={<WorkWithUsPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TranslationProvider>
  );
}

export default App;