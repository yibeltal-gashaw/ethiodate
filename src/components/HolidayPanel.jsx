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
    today: 'Today!',
    fixed: 'Fixed',
    movable: 'Movable',
    noHolidays: 'No holidays this month',
    loading: 'Loading holidays...',
    desc: 'About',
  },
  am: {
    title: 'የኢትዮጵያ በዓላት',
    upcoming: 'ቀጣይ በዓላት',
    allYear: 'ዓመቱ ሙሉ',
    daysAway: ' ቀናት ይቀሩታል',
    today: 'ዛሬ!',
    fixed: 'ቋሚ',
    movable: 'ተንቀሳቃሽ',
    noHolidays: 'በዚህ ወር ምንም በዓል የለም',
    loading: 'በዓላት እየተጫኑ...',
    desc: 'ስለ',
  },
};

export default function HolidayPanel({ lang = 'en', darkMode = false }) {
  const L = LABELS[lang];
  const [tab, setTab] = useState('upcoming');
  const [holidays, setHolidays] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const today = new Date();
    const et = gregorianToEthiopian(today);

    if (tab === 'upcoming') {
      const up = getUpcomingHolidays(today, 8);
      setHolidays(up);
    } else {
      const all = getHolidaysForYear(et.year).map(h => {
        const gd = ethiopianToGregorian(et.year, h.month, h.day);
        return { ...h, gDate: gd, eYear: et.year };
      });
      // Sort by month/day
      all.sort((a, b) => a.month - b.month || a.day - b.day);
      setHolidays(all);
    }
  }, [tab]);

  const cardBg = darkMode
    ? 'bg-gray-800/60 border-gray-700/50'
    : 'bg-white/80 border-gray-200/60';

  const getDaysAway = (gDate) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const d = new Date(gDate);
    d.setHours(0, 0, 0, 0);
    const diff = Math.round((d - now) / 86400000);
    if (diff === 0) return L.today;
    return `${diff} ${L.daysAway}`;
  };

  const getMonthLabel = (month) =>
    lang === 'am' ? ET_MONTHS_AM[month - 1] : ET_MONTHS_EN[month - 1];

  const HOLIDAY_COLORS = [
    { bg: darkMode ? 'bg-green-900/30' : 'bg-green-50', dot: 'bg-green-500', text: darkMode ? 'text-green-300' : 'text-green-700' },
    { bg: darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50', dot: 'bg-yellow-500', text: darkMode ? 'text-yellow-300' : 'text-yellow-700' },
    { bg: darkMode ? 'bg-red-900/30' : 'bg-red-50', dot: 'bg-red-500', text: darkMode ? 'text-red-300' : 'text-red-700' },
    { bg: darkMode ? 'bg-blue-900/30' : 'bg-blue-50', dot: 'bg-blue-500', text: darkMode ? 'text-blue-300' : 'text-blue-700' },
    { bg: darkMode ? 'bg-purple-900/30' : 'bg-purple-50', dot: 'bg-purple-500', text: darkMode ? 'text-purple-300' : 'text-purple-700' },
  ];

  return (
    <div className={`rounded-2xl border backdrop-blur-sm p-6 shadow-sm ${cardBg} transition-all duration-300`}>
      <h2 className={`text-xl font-semibold mb-5 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        {L.title}
      </h2>

      {/* Tab toggle */}
      <div className={`flex rounded-xl p-1 mb-5 ${darkMode ? 'bg-gray-700/60' : 'bg-gray-100'}`}>
        {['upcoming', 'allYear'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === t
                ? 'bg-green-500 text-white shadow-sm'
                : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'upcoming' ? L.upcoming : L.allYear}
          </button>
        ))}
      </div>

      {/* Holiday list */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
        {holidays.length === 0 ? (
          <div className={`text-center py-8 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {L.noHolidays}
          </div>
        ) : (
          holidays.map((h, i) => {
            const color = HOLIDAY_COLORS[i % HOLIDAY_COLORS.length];
            const isExpanded = expanded === h.key;
            const daysAway = h.gDate ? getDaysAway(h.gDate) : null;

            return (
              <div
                key={h.key + i}
                className={`rounded-xl overflow-hidden transition-all duration-200 ${color.bg}`}
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : h.key)}
                  className="w-full text-left p-3.5"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${color.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm font-medium leading-tight ${color.text}`}
                          style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : 'inherit' }}
                        >
                          {lang === 'am' ? h.nameAm : h.nameEn}
                        </p>
                        {daysAway && (
                          <span className={`text-xs shrink-0 ${
                            daysAway === L.today
                              ? 'font-bold ' + color.text
                              : darkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {daysAway}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {getMonthLabel(h.month)} {h.day}
                        {h.gDate && ` · ${h.gDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                        {' '}
                        <span className={`inline-flex items-center px-1.5 py-0 rounded text-[10px] font-medium ${
                          h.movable
                            ? darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                            : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {h.movable ? L.movable : L.fixed}
                        </span>
                      </p>
                    </div>
                    <span className={`text-xs transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''} ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      ›
                    </span>
                  </div>
                </button>

                {/* Expanded description */}
                {isExpanded && (
                  <div className={`px-4 pb-3 pt-0 text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className={`h-px mb-3 ${darkMode ? 'bg-gray-700/60' : 'bg-gray-200/60'}`} />
                    {lang === 'am' ? h.descAm : h.descEn}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
