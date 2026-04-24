import { useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = {
  en: ['Converter', 'Calendar', 'Holidays'],
  am: ['ቀን ቀያሪ', 'ቀን መቁጠሪያ', 'በዓላት'],
};

export default function Navbar({ lang, setLang, darkMode, setDarkMode, activeTab, setActiveTab }) {
  const links = NAV_LINKS[lang];
  const navigate = useNavigate();
  const location = useLocation();

  // On sub-routes (e.g. /holidays/:key), nav tabs navigate home with a hash
  const isDetailPage = location.pathname !== '/';

  const handleTabClick = (id) => {
    if (isDetailPage) {
      navigate('/');
      // Small delay to let the main shell mount before setting tab
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
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        darkMode
          ? 'bg-gray-900/90 border-gray-700/60'
          : 'bg-white/90 border-gray-200/60'
      } border-b backdrop-blur-md`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 group"
          aria-label="EthioDate Home"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm shadow-green-300/30 group-hover:scale-105 transition-transform duration-200">
            <span className="text-white text-sm font-bold">ቀ</span>
          </div>
          <span className={`font-bold text-lg tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Ethio<span className="text-green-500">Date</span>
          </span>
        </button>

        {/* Nav tabs — hidden on mobile */}
        <nav className="hidden sm:flex items-center gap-1">
          {[['converter', links[0]], ['calendar', links[1]], ['holidays', links[2]]].map(([id, label]) => (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                !isDetailPage && activeTab === id
                  ? 'bg-green-500/10 text-green-600'
                  : darkMode
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : 'inherit' }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={() => setLang(l => l === 'en' ? 'am' : 'en')}
            title="Switch language / ቋንቋ ቀይር"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              darkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            <span className="text-base">🌐</span>
            <span>{lang === 'en' ? 'አማ' : 'EN'}</span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(d => !d)}
            title={darkMode ? 'Light mode' : 'Dark mode'}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-base transition-all duration-200 ${
              darkMode
                ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700 border border-gray-700'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Mobile bottom nav — only on main shell */}
      {!isDetailPage && (
        <div className={`sm:hidden flex border-t ${darkMode ? 'border-gray-700/60' : 'border-gray-100'}`}>
          {[
            ['today', '🏠', lang === 'am' ? 'ዋና' : 'Home'],
            ['converter', '🔄', lang === 'am' ? 'ቀያሪ' : 'Convert'],
            ['calendar', '📅', lang === 'am' ? 'ቀን' : 'Calendar'],
            ['holidays', '🎉', lang === 'am' ? 'በዓላት' : 'Holidays'],
          ].map(([id, icon, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                activeTab === id ? 'text-green-500' : darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}
              style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : 'inherit' }}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
