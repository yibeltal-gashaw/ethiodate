import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  gregorianToEthiopian,
  getHolidaysForYear,
  getUpcomingHolidays,
  ethiopianToGregorian,
  ET_MONTHS_EN,
  ET_MONTHS_AM,
} from '../utils/ethiopianCalendar';

const LABELS = {
  en: {
    title: 'Ethiopian Holidays',
    upcoming: 'Upcoming',
    allYear: 'Full Year',
    daysAway: 'd away',
    today: 'Today! 🎉',
    tomorrow: 'Tomorrow',
    fixed: 'Fixed',
    movable: 'Movable',
    noHolidays: 'No upcoming holidays found.',
    viewDetails: 'View details →',
  },
  am: {
    title: 'የኢትዮጵያ በዓላት',
    upcoming: 'ቀጣይ',
    allYear: 'ዓመቱ ሙሉ',
    daysAway: ' ቀናት',
    today: 'ዛሬ! 🎉',
    tomorrow: 'ነገ',
    fixed: 'ቋሚ',
    movable: 'ተንቀሳቃሽ',
    noHolidays: 'ቀጣይ በዓላት አልተገኙም',
    viewDetails: 'ዝርዝር →',
  },
};

const CARD_THEMES = [
  { gradient: 'from-green-500 to-emerald-600',  light: 'bg-green-50  border-green-100',  dark: 'bg-green-900/20  border-green-700/30',  tag: 'text-green-600 bg-green-100',  tagDark: 'text-green-300 bg-green-900/40'  },
  { gradient: 'from-yellow-400 to-orange-500',  light: 'bg-yellow-50 border-yellow-100', dark: 'bg-yellow-900/20 border-yellow-700/30', tag: 'text-yellow-700 bg-yellow-100', tagDark: 'text-yellow-300 bg-yellow-900/40' },
  { gradient: 'from-red-500 to-rose-600',       light: 'bg-red-50    border-red-100',    dark: 'bg-red-900/20    border-red-700/30',    tag: 'text-red-600   bg-red-100',    tagDark: 'text-red-300   bg-red-900/40'    },
  { gradient: 'from-blue-500 to-indigo-600',    light: 'bg-blue-50   border-blue-100',   dark: 'bg-blue-900/20   border-blue-700/30',   tag: 'text-blue-600  bg-blue-100',   tagDark: 'text-blue-300  bg-blue-900/40'   },
  { gradient: 'from-purple-500 to-violet-600',  light: 'bg-purple-50 border-purple-100', dark: 'bg-purple-900/20 border-purple-700/30', tag: 'text-purple-600 bg-purple-100', tagDark: 'text-purple-300 bg-purple-900/40' },
  { gradient: 'from-teal-500 to-cyan-600',      light: 'bg-teal-50   border-teal-100',   dark: 'bg-teal-900/20   border-teal-700/30',   tag: 'text-teal-600  bg-teal-100',   tagDark: 'text-teal-300  bg-teal-900/40'   },
];

const HOLIDAY_ICONS = {
  enkutatash: '🌸', meskel: '✝️', gena: '⭐', timkat: '💧',
  adwa: '🦁', laborday: '⚒️', patriots: '🏆', dergfall: '🕊️',
  fasika: '🐣', seklet: '🙏', hosanna: '🌿',
};

export default function HolidayPanel({ lang = 'en', darkMode = false }) {
  const L = LABELS[lang];
  const [tab, setTab] = useState('upcoming');
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const today = new Date();
    const et = gregorianToEthiopian(today);

    if (tab === 'upcoming') {
      setHolidays(getUpcomingHolidays(today, 9));
    } else {
      const all = getHolidaysForYear(et.year).map(h => ({
        ...h,
        gDate: ethiopianToGregorian(et.year, h.month, h.day),
        eYear: et.year,
      }));
      all.sort((a, b) => a.month - b.month || a.day - b.day);
      setHolidays(all);
    }
  }, [tab]);

  const getDaysAway = (gDate) => {
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const d = new Date(gDate); d.setHours(0, 0, 0, 0);
    const diff = Math.round((d - now) / 86400000);
    if (diff === 0) return { label: L.today, urgent: true };
    if (diff === 1) return { label: L.tomorrow, urgent: false };
    return { label: `${diff} ${L.daysAway}`, urgent: false };
  };

  const getMonthLabel = (m) => lang === 'am' ? ET_MONTHS_AM[m - 1] : ET_MONTHS_EN[m - 1];

  const wrapBg = darkMode ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/80 border-gray-200/60';
  const tabBg  = darkMode ? 'bg-gray-700/60' : 'bg-gray-100';
  const tabOff = darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700';

  return (
    <div className={`rounded-2xl border backdrop-blur-sm p-6 shadow-sm transition-all duration-300 ${wrapBg}`}>
      {/* Header */}
      <h2 className={`text-xl font-semibold mb-5 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        {L.title}
      </h2>

      {/* Tab toggle */}
      <div className={`flex rounded-xl p-1 mb-5 ${tabBg}`}>
        {['upcoming', 'allYear'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === t ? 'bg-green-500 text-white shadow-sm' : tabOff
            }`}
          >
            {t === 'upcoming' ? L.upcoming : L.allYear}
          </button>
        ))}
      </div>

      {/* ── Horizontal scroll row ────────────────────────────────────── */}
      {holidays.length === 0 ? (
        <div className={`text-center py-12 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {L.noHolidays}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-thin">
          {holidays.map((h, i) => {
            const theme    = CARD_THEMES[i % CARD_THEMES.length];
            const icon     = HOLIDAY_ICONS[h.key] ?? '🎊';
            const daysObj  = h.gDate ? getDaysAway(h.gDate) : null;
            const cardBase = darkMode ? theme.dark : theme.light;
            const tagCls   = darkMode ? theme.tagDark : theme.tag;

            return (
              <Link
                key={h.key + i}
                to={`/holidays/${h.key}`}
                className={`w-56 shrink-0 snap-start rounded-2xl border overflow-hidden block transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] ${cardBase}`}
              >
                {/* Top colour bar */}
                <div className={`h-1.5 bg-gradient-to-r ${theme.gradient}`} />

                <div className="p-4">
                  {/* Icon + days badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${theme.gradient} shadow-sm`}>
                      {icon}
                    </div>
                    {daysObj && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        daysObj.urgent
                          ? 'bg-green-500 text-white'
                          : darkMode
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-white text-gray-500 border border-gray-200'
                      }`}>
                        {daysObj.label}
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <h3
                    className={`font-semibold text-sm leading-snug mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                    style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic',sans-serif" : 'inherit' }}
                  >
                    {lang === 'am' ? h.nameAm : h.nameEn}
                  </h3>

                  {/* Date */}
                  <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {getMonthLabel(h.month)} {h.day}
                    {h.gDate && (
                      <span className="ml-1 opacity-70">
                        · {h.gDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </p>

                  {/* Bottom row: type tag + arrow */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tagCls}`}>
                      {h.movable ? L.movable : L.fixed}
                    </span>
                    <span className={`text-xs font-medium ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
