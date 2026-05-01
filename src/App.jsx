import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import HomePage from './pages/HomePage';
import CalendarView from './components/CalendarView';
import ConverterPage from './pages/ConverterPage';
import HolidaysPage from './pages/HolidaysPage';
import HolidayDetail from './pages/HolidayDetail';

// ── Main shell ───────────────────────────────────────────────────────────────
function MainShell() {
  const { lang, setLang, darkMode, setDarkMode } = useApp();
  const [activeTab, setActiveTab] = useState('today');
  const sharedProps = { lang, darkMode };

  const bg          = darkMode ? '#0f172a' : '#f9fafb';
  const cardBg      = darkMode ? '#1e293b' : '#ffffff';
  const border      = darkMode ? '#1e293b' : '#f0f0f0';
  const textPrimary = darkMode ? '#f1f5f9' : '#111827';
  const textMuted   = darkMode ? '#94a3b8' : '#6b7280';

  return (
    <div
      className="app-shell"
      style={{
        fontFamily: lang === 'am'
          ? "'Noto Sans Ethiopic','Inter',sans-serif"
          : "'Inter',sans-serif",
      }}
    >
      {/* Left sidebar */}
      <Sidebar
        lang={lang}
        darkMode={darkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Right column: top bar + page content */}
      <div className="app-main">
        <TopBar
          lang={lang} setLang={setLang}
          darkMode={darkMode} setDarkMode={setDarkMode}
        />

        {/* ── Page views ── */}
        <div className="page-area" style={{ background: bg }}>

          {/* TODAY — full dashboard */}
          {activeTab === 'today' && (
            <div className="animate-fadeIn">
              <HomePage lang={lang} darkMode={darkMode} setActiveTab={setActiveTab} />
            </div>
          )}

          {/* CONVERTER */}
          {activeTab === 'converter' && (
            <div className="animate-fadeIn">
              <ConverterPage lang={lang} darkMode={darkMode} />
            </div>
          )}

          {/* CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="page-inner animate-fadeIn" style={{ maxWidth: 560 }}>
              <div className="page-heading">
                <h1 style={{ color: textPrimary, fontSize: 24, fontWeight: 700, margin: 0 }}>
                  {lang === 'am' ? 'ቀን መቁጠሪያ' : 'Calendar'}
                </h1>
                <p style={{ color: textMuted, fontSize: 14, marginTop: 4 }}>
                  {lang === 'am' ? 'ኢትዮጵያ ወይም ጎርጎሮሲያን ቀን ይምረጡ' : 'Switch between Ethiopian and Gregorian views'}
                </p>
              </div>
              <CalendarView {...sharedProps} />
            </div>
          )}

          {/* HOLIDAYS */}
          {activeTab === 'holidays' && (
            <div className="animate-fadeIn">
              <HolidaysPage lang={lang} darkMode={darkMode} />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer style={{
          textAlign: 'center', padding: '12px 0', fontSize: 12,
          color: textMuted,
          borderTop: `1px solid ${border}`,
          background: darkMode ? '#111827' : '#fff',
        }}>
          EthioDate &mdash; {lang === 'am' ? 'ቀን ቀያሪ' : 'Ethiopian Calendar Converter'} &mdash; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}

// ── Mobile bottom nav overlay (small screens) ────────────────────────────────
// (Handled inside MainShell via CSS)

// ── Root with routing ─────────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      <Route path="/"              element={<MainShell />} />
      <Route path="/holidays/:key" element={<HolidayDetail />} />
    </Routes>
  );
}
