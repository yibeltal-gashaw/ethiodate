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
    title: 'Holidays',
    upcoming: 'Upcoming',
    allYear: 'Full Year',
    daysAway: 'd away',
    today: 'Today',
    fixed: 'Fixed',
    movable: 'Movable',
    noHolidays: 'No holidays found',
    desc: 'About',
  },
  am: {
    title: 'በዓላት',
    upcoming: 'ቀጣይ',
    allYear: 'ዓመቱ ሙሉ',
    daysAway: ' ቀናት',
    today: 'ዛሬ',
    fixed: 'ቋሚ',
    movable: 'ተንቀሳቃሽ',
    noHolidays: 'ምንም በዓል የለም',
    desc: 'ስለ',
  },
};

/* Cycle through a palette of accent colours */
const ACCENTS = [
  { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-500', text: 'text-emerald-400', textLight: 'text-emerald-600' },
  { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   dot: 'bg-amber-400',   text: 'text-amber-400',   textLight: 'text-amber-600'   },
  { bg: 'bg-red-500/10',     border: 'border-red-500/20',     dot: 'bg-red-400',     text: 'text-red-400',     textLight: 'text-red-600'     },
  { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    dot: 'bg-blue-400',    text: 'text-blue-400',    textLight: 'text-blue-600'    },
  { bg: 'bg-purple-500/10',  border: 'border-purple-500/20',  dot: 'bg-purple-400',  text: 'text-purple-400',  textLight: 'text-purple-600'  },
];

function ChevronRight({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

export default function HolidayPanel({ lang = 'en', darkMode = false }) {
  const L = LABELS[lang];
  const [tab, setTab] = useState('upcoming');
  const [holidays, setHolidays] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const today = new Date();
    const et = gregorianToEthiopian(today);

    if (tab === 'upcoming') {
      setHolidays(getUpcomingHolidays(today, 8));
    } else {
      const all = getHolidaysForYear(et.year).map(h => {
        const gd = ethiopianToGregorian(et.year, h.month, h.day);
        return { ...h, gDate: gd, eYear: et.year };
      });
      all.sort((a, b) => a.month - b.month || a.day - b.day);
      setHolidays(all);
    }
  }, [tab]);

  const getDaysAway = (gDate) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const d = new Date(gDate);
    d.setHours(0, 0, 0, 0);
    const diff = Math.round((d - now) / 86400000);
    if (diff === 0) return { label: L.today, isToday: true };
    return { label: `${diff}${L.daysAway}`, isToday: false };
  };

  const getMonthLabel = (month) =>
    lang === 'am' ? ET_MONTHS_AM[month - 1] : ET_MONTHS_EN[month - 1];

  const surface = darkMode ? 'bg-[#181c27] border-white/[0.07]' : 'bg-white border-black/[0.06]';
  const labelColor = darkMode ? 'text-slate-400' : 'text-slate-500';
  const rowBase = darkMode ? 'border-white/[0.05]' : 'border-slate-100';

  return (
    <div
      className={`rounded-2xl border overflow-hidden shadow-lg transition-all duration-300 ${surface}`}
      style={{ boxShadow: darkMode ? '0 1px 3px rgba(0,0,0,0.4),0 4px 20px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)' }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className={`text-sm font-semibold uppercase tracking-widest ${labelColor}`}>
            {L.title}
          </h2>
        </div>

        {/* Tab toggle */}
        <div className="tab-pill mb-5">
          {['upcoming', 'allYear'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={tab === t ? 'active' : ''}
              style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : 'inherit' }}
            >
              {t === 'upcoming' ? L.upcoming : L.allYear}
            </button>
          ))}
        </div>

        {/* Holiday list */}
        <div className="space-y-1 max-h-96 overflow-y-auto scrollbar-thin pr-0.5">
          {holidays.length === 0 ? (
            <div className={`text-center py-10 text-sm ${labelColor}`}>
              {L.noHolidays}
            </div>
          ) : (
            holidays.map((h, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              const isExpanded = expanded === h.key;
              const daysAway = h.gDate ? getDaysAway(h.gDate) : null;
              const accentText = darkMode ? accent.text : accent.textLight;

              return (
                <div
                  key={h.key + i}
                  className={`rounded-xl overflow-hidden border transition-all duration-200 ${
                    darkMode ? `${accent.bg} ${accent.border}` : `${accent.bg} ${accent.border}`
                  }`}
                >
                  <button
                    onClick={() => setExpanded(isExpanded ? null : h.key)}
                    className="w-full text-left px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      {/* Colour dot */}
                      <div className={`w-2 h-2 rounded-full shrink-0 ${accent.dot}`} />

                      {/* Main content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={`text-sm font-semibold leading-tight truncate ${
                              darkMode ? 'text-slate-100' : 'text-slate-800'
                            }`}
                            style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : 'inherit' }}
                          >
                            {lang === 'am' ? h.nameAm : h.nameEn}
                          </p>
                          {daysAway && (
                            <span className={`text-[11px] font-semibold shrink-0 ${
                              daysAway.isToday
                                ? accentText
                                : darkMode ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                              {daysAway.label}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className={`text-[11px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {getMonthLabel(h.month)} {h.day}
                            {h.gDate && ` · ${h.gDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                          </p>
                          <span className={`badge text-[10px] px-1.5 py-0 ${darkMode ? 'border-white/[0.06] text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                            {h.movable ? L.movable : L.fixed}
                          </span>
                        </div>
                      </div>

                      {/* Expand chevron */}
                      <div className={`shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''} ${labelColor}`}>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </button>

                  {/* Expanded description */}
                  {isExpanded && (
                    <div className={`px-4 pb-4 pt-0`}>
                      <div className={`h-px mb-3 ${darkMode ? 'bg-white/[0.05]' : 'bg-black/[0.05]'}`} />
                      <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
                        style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : 'inherit' }}>
                        {lang === 'am' ? h.descAm : h.descEn}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
