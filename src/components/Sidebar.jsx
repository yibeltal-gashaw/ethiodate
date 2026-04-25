import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { id: 'today',     icon: CalendarIcon,    en: 'Today',     am: 'ዛሬ' },
  { id: 'converter', icon: SwapIcon,        en: 'Converter', am: 'ቀያሪ' },
  { id: 'calendar',  icon: CalendarGridIcon,en: 'Calendar',  am: 'ቀን' },
  { id: 'holidays',  icon: StarIcon,        en: 'Holidays',  am: 'በዓላት' },
];

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function SwapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  );
}
function CalendarGridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="15" x2="21" y2="15"/>
      <line x1="9" y1="10" x2="9" y2="21"/>
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

export default function Sidebar({ lang, darkMode, activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDetailPage = location.pathname !== '/';

  const handleTabClick = (id) => {
    if (isDetailPage) {
      navigate('/');
      setTimeout(() => setActiveTab(id), 50);
    } else {
      setActiveTab(id);
    }
  };

  const handleLogoClick = () => {
    if (isDetailPage) navigate('/');
    else setActiveTab('today');
  };

  return (
    <aside
      className="sidebar"
      style={{
        background: darkMode ? '#111827' : '#ffffff',
        borderRight: darkMode ? '1px solid #1f2937' : '1px solid #f0f0f0',
      }}
    >
      {/* Logo */}
      <button className="sidebar-logo" onClick={handleLogoClick} aria-label="EthioDate Home">
        <span className="sidebar-logo-text">
          <span style={{ color: '#16a34a' }}>Ethio</span>Date
        </span>
        <span
          className="sidebar-logo-sub"
          style={{ color: darkMode ? '#6b7280' : '#9ca3af' }}
        >
          Ethiopian Calendar
        </span>
      </button>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ id, icon: Icon, en, am }) => {
          const isActive = !isDetailPage && activeTab === id;
          return (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              className={`sidebar-nav-item${isActive ? ' active' : ''}`}
              style={{
                color: isActive
                  ? '#16a34a'
                  : darkMode ? '#9ca3af' : '#6b7280',
                background: isActive
                  ? darkMode ? 'rgba(22,163,74,0.12)' : 'rgba(22,163,74,0.08)'
                  : 'transparent',
                fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : 'inherit',
              }}
            >
              <span className="sidebar-nav-icon">
                <Icon />
              </span>
              <span>{lang === 'am' ? am : en}</span>
            </button>
          );
        })}
      </nav>

      {/* User profile at bottom */}
      <div
        className="sidebar-user"
        style={{
          borderTop: darkMode ? '1px solid #1f2937' : '1px solid #f0f0f0',
        }}
      >
        <div className="sidebar-avatar">
          <span style={{ fontSize: 16 }}>🧑🏾</span>
        </div>
        <div className="sidebar-user-info">
          <span
            className="sidebar-user-name"
            style={{ color: darkMode ? '#f9fafb' : '#111827' }}
          >
            Abebe B.
          </span>
          <span
            className="sidebar-user-role"
            style={{ color: darkMode ? '#6b7280' : '#9ca3af' }}
          >
            Premium Member
          </span>
        </div>
      </div>
    </aside>
  );
}
