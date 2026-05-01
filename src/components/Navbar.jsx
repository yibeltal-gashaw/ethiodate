const NAV_LINKS = {
  en: [
    { id: 'converter', label: 'Converter' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'holidays', label: 'Holidays' },
  ],
  am: [
    { id: 'converter', label: 'ቀን ቀያሪ' },
    { id: 'calendar', label: 'ቀን መቁጠሪያ' },
    { id: 'holidays', label: 'በዓላት' },
  ],
};

const MOBILE_TABS = {
  en: [
    { id: 'today', icon: HomeIcon, label: 'Home' },
    { id: 'converter', icon: ArrowsIcon, label: 'Convert' },
    { id: 'calendar', icon: CalendarIcon, label: 'Calendar' },
    { id: 'holidays', icon: StarIcon, label: 'Holidays' },
  ],
  am: [
    { id: 'today', icon: HomeIcon, label: 'ዋና' },
    { id: 'converter', icon: ArrowsIcon, label: 'ቀያሪ' },
    { id: 'calendar', icon: CalendarIcon, label: 'ቀን' },
    { id: 'holidays', icon: StarIcon, label: 'በዓላት' },
  ],
};

function HomeIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function ArrowsIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 16V4m0 0L3 8m4-4 4 4"/>
      <path d="M17 8v12m0 0 4-4m-4 4-4-4"/>
    </svg>
  );
}

function CalendarIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function StarIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function GlobeIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

function SunIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function Navbar({ lang, setLang, darkMode, setDarkMode, activeTab, setActiveTab }) {
  const links = NAV_LINKS[lang];
  const mobileTabs = MOBILE_TABS[lang];

  const navBg = darkMode
    ? 'bg-[#0f1117]/90 border-white/[0.06]'
    : 'bg-white/90 border-black/[0.06]';

  const btnBase = darkMode
    ? 'bg-white/[0.06] border border-white/[0.08] text-[#94a3b8] hover:bg-white/[0.1] hover:text-white'
    : 'bg-black/[0.04] border border-black/[0.06] text-slate-500 hover:bg-black/[0.08] hover:text-slate-800';

  const mobileTabBg = darkMode
    ? 'bg-[#0f1117]/95 border-white/[0.06]'
    : 'bg-white/95 border-black/[0.06]';

  return (
    <>
      {/* Desktop header */}
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${navBg}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[60px]">
          {/* Logo */}
          <button
            onClick={() => setActiveTab('today')}
            className="flex items-center gap-2.5 group"
            aria-label="EthioDate Home"
          >
            {/* Logo mark — Ethiopian cross / star motif */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors" />
              <span
                className="relative text-emerald-400 text-[15px] font-bold leading-none"
                style={{ fontFamily: "'Noto Sans Ethiopic', sans-serif" }}
              >
                ቀ
              </span>
            </div>
            <span
              className={`font-bold text-[17px] tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}
            >
              Ethio<span className="text-emerald-500">Date</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-0.5">
            {links.map(({ id, label }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? darkMode
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-emerald-600 bg-emerald-50'
                      : darkMode
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                  style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : 'inherit' }}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(l => l === 'en' ? 'am' : 'en')}
              title="Switch language / ቋንቋ ቀይር"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${btnBase}`}
            >
              <GlobeIcon />
              <span>{lang === 'en' ? 'አማ' : 'EN'}</span>
            </button>
            <button
              onClick={() => setDarkMode(d => !d)}
              title={darkMode ? 'Light mode' : 'Dark mode'}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${btnBase}`}
            >
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <div
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl ${mobileTabBg}`}
      >
        <div className="flex">
          {mobileTabs.map(({ id, icon: Icon, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-emerald-500'
                    : darkMode ? 'text-slate-500' : 'text-slate-400'
                }`}
                style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : 'inherit' }}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
