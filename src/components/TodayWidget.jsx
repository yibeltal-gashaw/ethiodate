import { useState, useEffect } from 'react';
import {
  gregorianToEthiopian,
  getEthDayName,
  getHolidayOnDate,
  ET_MONTHS_EN,
  ET_MONTHS_AM,
} from '../utils/ethiopianCalendar';

const LABELS = {
  en: {
    title: "Today's Date",
    gregorian: 'Gregorian',
    ethiopian: 'Ethiopian',
    dayName: 'Day of Week',
    holiday: 'Holiday',
    ec: 'E.C.',
  },
  am: {
    title: 'ዛሬ ምን ቀን ነው',
    gregorian: 'ጎርጎሮሲያን',
    ethiopian: 'ኢትዮጵያ',
    dayName: 'የሳምንቱ ቀን',
    holiday: 'በዓል',
    ec: 'ዓ.ም',
  },
};

function CalendarDotIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"/>
      <rect x="2" y="7" width="20" height="5"/>
      <line x1="12" y1="22" x2="12" y2="7"/>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  );
}

export default function TodayWidget({ lang = 'en', darkMode = false }) {
  const L = LABELS[lang];
  const [now, setNow] = useState(new Date());
  const [ethDate, setEthDate] = useState(null);
  const [holiday, setHoliday] = useState(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const et = gregorianToEthiopian(now);
    setEthDate(et);
    const h = getHolidayOnDate(et.year, et.month, et.day);
    setHoliday(h);
  }, [now]);

  if (!ethDate) return null;

  const dayNameAm = getEthDayName(now, 'am');
  const dayNameEn = getEthDayName(now, 'en');
  const monthsEn = ET_MONTHS_EN;
  const monthsAm = ET_MONTHS_AM;

  const surface = darkMode ? 'bg-[#181c27] border-white/[0.07]' : 'bg-white border-black/[0.06]';
  const inner = darkMode ? 'bg-white/[0.04] border-white/[0.06]' : 'bg-slate-50 border-black/[0.05]';
  const innerEth = darkMode ? 'bg-emerald-500/[0.08] border-emerald-500/20' : 'bg-emerald-50 border-emerald-100';
  const labelColor = darkMode ? 'text-slate-400' : 'text-slate-500';
  const bigNum = darkMode ? 'text-white' : 'text-slate-900';
  const subText = darkMode ? 'text-slate-400' : 'text-slate-500';
  const accentGreen = darkMode ? 'text-emerald-400' : 'text-emerald-600';
  const accentBlue = darkMode ? 'text-blue-400' : 'text-blue-500';

  return (
    <div className={`rounded-2xl border overflow-hidden shadow-lg transition-all duration-300 ${surface}`}
      style={{ boxShadow: darkMode ? '0 1px 3px rgba(0,0,0,0.4),0 4px 20px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)' }}>
      {/* Ethiopian flag stripe */}
      <div className="eth-stripe" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className={`text-sm font-semibold uppercase tracking-widest ${labelColor}`}>
            {L.title}
          </h2>
          <div className={`flex items-center gap-1.5 text-xs ${labelColor}`}>
            <CalendarDotIcon />
            <span>{now.toLocaleDateString(lang === 'am' ? 'am-ET' : 'en-US', { weekday: 'long' })}</span>
          </div>
        </div>

        {/* Date display — two columns */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Gregorian */}
          <div className={`rounded-xl border p-4 ${inner}`}>
            <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${accentBlue}`}>
              {L.gregorian}
            </p>
            <p className={`text-4xl font-bold leading-none tabular-nums ${bigNum}`}>
              {String(now.getDate()).padStart(2, '0')}
            </p>
            <p className={`text-xs mt-2 leading-relaxed ${subText}`}>
              {now.toLocaleDateString(lang === 'am' ? 'am-ET' : 'en-US', { month: 'long' })}
              <br />
              {now.getFullYear()}
            </p>
          </div>

          {/* Ethiopian */}
          <div className={`rounded-xl border p-4 ${innerEth}`}>
            <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${accentGreen}`}>
              {L.ethiopian}
            </p>
            <p className={`text-4xl font-bold leading-none tabular-nums ${bigNum}`}>
              {String(ethDate.day).padStart(2, '0')}
            </p>
            <p
              className={`text-xs mt-2 leading-relaxed ${subText}`}
              style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : 'inherit' }}
            >
              {lang === 'am' ? monthsAm[ethDate.month - 1] : monthsEn[ethDate.month - 1]}
              <br />
              {ethDate.year} {L.ec}
            </p>
          </div>
        </div>

        {/* Day name pill */}
        <div className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 border ${inner}`}>
          <span
            className={`text-sm font-medium ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}
            style={{ fontFamily: "'Noto Sans Ethiopic', sans-serif" }}
          >
            {dayNameAm}
          </span>
          {lang === 'en' && (
            <>
              <span className={`text-xs ${labelColor}`}>·</span>
              <span className={`text-sm font-medium ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                {dayNameEn}
              </span>
            </>
          )}
        </div>

        {/* Holiday banner */}
        {holiday && (
          <div className={`mt-3 rounded-xl px-4 py-3 flex items-center gap-2.5 animate-pulse ${
            darkMode
              ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
              : 'bg-amber-50 border border-amber-100 text-amber-700'
          }`}>
            <GiftIcon />
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest opacity-70">{L.holiday}</span>
              <p className="text-sm font-semibold leading-tight">
                {lang === 'am' ? holiday.nameAm : holiday.nameEn}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
