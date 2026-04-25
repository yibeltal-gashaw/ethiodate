import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import {
  getHolidaysForYear,
  gregorianToEthiopian,
  ethiopianToGregorian,
  ET_MONTHS_EN,
  ET_MONTHS_AM,
} from '../utils/ethiopianCalendar';

const HOLIDAY_ICONS = {
  enkutatash: '🌸', meskel: '✝️', gena: '⭐', timkat: '💧',
  adwa: '🦁', laborday: '⚒️', patriots: '🏆', dergfall: '🕊️',
  fasika: '🐣', seklet: '🙏', hosanna: '🌿',
};

const GRADIENTS = [
  'from-green-500 to-emerald-600',
  'from-yellow-400 to-orange-500',
  'from-red-500 to-rose-600',
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-violet-600',
  'from-teal-500 to-cyan-600',
];

const ALL_KEYS_ORDER = [
  'enkutatash','meskel','gena','timkat','adwa',
  'laborday','patriots','dergfall','hosanna','seklet','fasika',
];

const LABELS = {
  en: {
    back: '← Back to Holidays',
    ethDate: 'Ethiopian Date',
    gregDate: 'Gregorian Date',
    type: 'Holiday Type',
    fixed: 'Fixed Holiday',
    movable: 'Movable Holiday',
    about: 'About this Holiday',
    daysAway: 'days away',
    today: 'Today! 🎉',
    tomorrow: 'Tomorrow',
    notFound: 'Holiday not found.',
    goBack: 'Go Back',
  },
  am: {
    back: '← ወደ በዓላት ተመለስ',
    ethDate: 'የኢትዮጵያ ቀን',
    gregDate: 'ጎርጎሮሲያን ቀን',
    type: 'የበዓሉ ዓይነት',
    fixed: 'ቋሚ በዓል',
    movable: 'ተንቀሳቃሽ በዓል',
    about: 'ስለ ዚህ በዓል',
    daysAway: 'ቀናት ይቀሩታል',
    today: 'ዛሬ! 🎉',
    tomorrow: 'ነገ',
    notFound: 'በዓሉ አልተገኘም።',
    goBack: 'ተመለስ',
  },
};

export default function HolidayDetail() {
  const { key } = useParams();
  const navigate = useNavigate();
  const { lang, setLang, darkMode, setDarkMode } = useApp();
  const L = LABELS[lang];

  const [holiday, setHoliday] = useState(null);
  const [gradient, setGradient] = useState(GRADIENTS[0]);

  useEffect(() => {
    const today = new Date();
    const et = gregorianToEthiopian(today);
    const all = getHolidaysForYear(et.year).map(h => {
      const gd = ethiopianToGregorian(et.year, h.month, h.day);
      return { ...h, gDate: gd, eYear: et.year };
    });
    const found = all.find(h => h.key === key);
    setHoliday(found || null);

    const idx = ALL_KEYS_ORDER.indexOf(key);
    setGradient(GRADIENTS[idx >= 0 ? idx % GRADIENTS.length : 0]);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [key]);

  const getDaysAway = (gDate) => {
    if (!gDate) return null;
    const now = new Date(); now.setHours(0,0,0,0);
    const d = new Date(gDate); d.setHours(0,0,0,0);
    const diff = Math.round((d - now) / 86400000);
    if (diff === 0) return { label: L.today, urgent: true };
    if (diff === 1) return { label: L.tomorrow, urgent: false };
    if (diff < 0) return null;
    return { label: `${diff} ${L.daysAway}`, urgent: false };
  };

  const getMonthLabel = (m) => lang === 'am' ? ET_MONTHS_AM[m - 1] : ET_MONTHS_EN[m - 1];
  const icon = HOLIDAY_ICONS[key] ?? '🎊';

  const bg = darkMode ? 'bg-gray-900' : 'bg-slate-50';
  const cardBg = darkMode ? 'bg-gray-800 border-gray-700/50' : 'bg-white border-gray-200/60';
  const sectionBg = darkMode ? 'bg-gray-800/60' : 'bg-gray-50';
  const mutedText = darkMode ? 'text-gray-400' : 'text-gray-500';
  const headingText = darkMode ? 'text-white' : 'text-gray-900';
  const bodyText = darkMode ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${bg}`}
      style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic','Inter',sans-serif" : "'Inter',sans-serif" }}
    >
      {/* Animated Glass Bubbles Background */}
      <div className="glass-bubble glass-bubble-1"></div>
      <div className="glass-bubble glass-bubble-2"></div>
      <div className="glass-bubble glass-bubble-3"></div>

      <div className="glass-container">
        <Navbar
          lang={lang} setLang={setLang}
          darkMode={darkMode} setDarkMode={setDarkMode}
          activeTab={null}
          setActiveTab={() => {}}
        />

        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-16 animate-fadeIn relative">

        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors duration-150 ${
            darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {L.back}
        </button>

        {!holiday ? (
          <div className={`rounded-2xl border p-10 text-center ${cardBg}`}>
            <p className={`text-lg mb-4 ${mutedText}`}>{L.notFound}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
            >
              {L.goBack}
            </button>
          </div>
        ) : (
          <>
            {/* ── Hero banner ─────────────────────────────────────────── */}
            <div className={`rounded-2xl overflow-hidden shadow-sm mb-6 bg-gradient-to-br ${gradient}`}>
              <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                <span className="text-7xl mb-4 drop-shadow-lg">{icon}</span>
                <h1
                  className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm leading-tight"
                  style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic',sans-serif" : 'inherit' }}
                >
                  {lang === 'am' ? holiday.nameAm : holiday.nameEn}
                </h1>

                {/* Days away badge */}
                {(() => {
                  const d = getDaysAway(holiday.gDate);
                  return d ? (
                    <span className={`mt-3 inline-block text-sm font-semibold px-4 py-1 rounded-full ${
                      d.urgent ? 'bg-white text-green-600' : 'bg-white/20 text-white'
                    }`}>
                      {d.label}
                    </span>
                  ) : null;
                })()}
              </div>
            </div>

            {/* ── Date info card ───────────────────────────────────────── */}
            <div className={`rounded-2xl border p-5 mb-5 shadow-sm ${cardBg}`}>
              <div className="grid grid-cols-2 gap-6">
                {/* Ethiopian date */}
                <div>
                  <p className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>
                    🇪🇹 {L.ethDate}
                  </p>
                  <p className={`text-xl font-bold ${headingText}`}
                    style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic',sans-serif" : 'inherit' }}>
                    {holiday.day}
                  </p>
                  <p className={`text-sm font-medium ${bodyText}`}
                    style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic',sans-serif" : 'inherit' }}>
                    {getMonthLabel(holiday.month)} {holiday.eYear}
                  </p>
                  <p className={`text-xs mt-0.5 ${mutedText}`}>
                    {lang === 'am' ? 'ዓ.ም' : 'Ethiopian Calendar'}
                  </p>
                </div>

                {/* Gregorian date */}
                {holiday.gDate && (
                  <div>
                    <p className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>
                      🌍 {L.gregDate}
                    </p>
                    <p className={`text-xl font-bold ${headingText}`}>
                      {holiday.gDate.getDate()}
                    </p>
                    <p className={`text-sm font-medium ${bodyText}`}>
                      {holiday.gDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                    <p className={`text-xs mt-0.5 ${mutedText}`}>
                      Gregorian Calendar
                    </p>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className={`my-4 h-px ${darkMode ? 'bg-gray-700/60' : 'bg-gray-100'}`} />

              {/* Type */}
              <div className="flex items-center justify-between">
                <p className={`text-[11px] font-semibold uppercase tracking-wider ${mutedText}`}>
                  {L.type}
                </p>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  holiday.movable
                    ? darkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-50 text-blue-600'
                    : darkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-50 text-green-600'
                }`}>
                  {holiday.movable ? L.movable : L.fixed}
                </span>
              </div>
            </div>

            {/* ── Description ─────────────────────────────────────────── */}
            <div className={`rounded-2xl border p-5 shadow-sm ${cardBg}`}>
              <p className={`text-[11px] font-semibold uppercase tracking-wider mb-3 ${mutedText}`}>
                {L.about}
              </p>
              <p
                className={`text-base leading-relaxed ${bodyText}`}
                style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic',sans-serif" : 'inherit' }}
              >
                {lang === 'am' ? holiday.descAm : holiday.descEn}
              </p>
            </div>
          </>
        )}
      </main>
      </div>
    </div>
  );
}
