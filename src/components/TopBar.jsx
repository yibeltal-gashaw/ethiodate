export default function TopBar({ lang, setLang, darkMode, setDarkMode }) {
  return (
    <div
      className="topbar"
      style={{
        background: darkMode ? '#111827' : '#f9fafb',
        borderBottom: darkMode ? '1px solid #1f2937' : '1px solid #eeeeee',
      }}
    >
      {/* Search */}
      <div className="topbar-search" style={{ background: darkMode ? '#1f2937' : '#fff', border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={darkMode ? '#6b7280' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder={lang === 'am' ? 'ቀናት፣ በዓላት ይፈልጉ...' : 'Search dates, holidays...'}
          className="topbar-search-input"
          style={{ color: darkMode ? '#d1d5db' : '#374151', background: 'transparent' }}
        />
      </div>

      {/* Controls */}
      <div className="topbar-controls">
        {/* Language */}
        <button
          onClick={() => setLang(l => l === 'en' ? 'am' : 'en')}
          className="topbar-btn"
          title="Switch language"
          style={{
            background: darkMode ? '#1f2937' : '#fff',
            border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
            color: darkMode ? '#9ca3af' : '#6b7280',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </button>

        {/* Dark mode */}
        <button
          onClick={() => setDarkMode(d => !d)}
          className="topbar-btn"
          title={darkMode ? 'Light mode' : 'Dark mode'}
          style={{
            background: darkMode ? '#1f2937' : '#fff',
            border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
            color: darkMode ? '#f9d24f' : '#6b7280',
          }}
        >
          {darkMode ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
