import { useState } from 'react';
import {
  gregorianToEthiopian,
  getEthiopianMonthDays,
  daysInEthiopianMonth,
  getHolidayOnDate,
  ethiopianToGregorian,
  ET_MONTHS_EN,
  ET_MONTHS_AM,
  ET_DAYS_EN,
  ET_DAYS_AM,
} from '../utils/ethiopianCalendar';

const LABELS = {
  en: {
    title: 'Calendar',
    ethView: 'Ethiopian',
    gregView: 'Gregorian',
    today: 'Today',
    prev: '←',
    next: '→',
    legendToday: 'Today',
    legendHoliday: 'Holiday',
  },
  am: {
    title: 'ቀን መቁጠሪያ',
    ethView: 'ኢትዮጵያ',
    gregView: 'ጎርጎሮስ',
    today: 'ዛሬ',
    prev: '←',
    next: '→',
    legendToday: 'ዛሬ',
    legendHoliday: 'በዓል',
  },
};

const GREG_MONTHS_EN = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

export default function CalendarView({ lang = 'en', darkMode = false }) {
  const L = LABELS[lang];
  const today = new Date();
  const todayEt = gregorianToEthiopian(today);

  const [view, setView] = useState('eth');
  const [eYear, setEYear] = useState(todayEt.year);
  const [eMonth, setEMonth] = useState(todayEt.month);
  const [gYear, setGYear] = useState(today.getFullYear());
  const [gMonth, setGMonth] = useState(today.getMonth());

  const months = lang === 'am' ? ET_MONTHS_AM : ET_MONTHS_EN;

  const goToToday = () => {
    setEYear(todayEt.year);
    setEMonth(todayEt.month);
    setGYear(today.getFullYear());
    setGMonth(today.getMonth());
  };

  const prevMonth = () => {
    if (view === 'eth') {
      if (eMonth === 1) { setEYear(y => y - 1); setEMonth(13); }
      else setEMonth(m => m - 1);
    } else {
      if (gMonth === 0) { setGYear(y => y - 1); setGMonth(11); }
      else setGMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (view === 'eth') {
      if (eMonth === 13) { setEYear(y => y + 1); setEMonth(1); }
      else setEMonth(m => m + 1);
    } else {
      if (gMonth === 11) { setGYear(y => y + 1); setGMonth(0); }
      else setGMonth(m => m + 1);
    }
  };

  const surface = darkMode ? 'bg-[#181c27] border-white/[0.07]' : 'bg-white border-black/[0.06]';
  const labelColor = darkMode ? 'text-slate-400' : 'text-slate-500';
  const headColor = darkMode ? 'text-slate-500' : 'text-slate-400';
  const navBtn = darkMode
    ? 'w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white/[0.06] hover:text-white transition-colors'
    : 'w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors';

  const renderEthGrid = () => {
    const days2 = getEthiopianMonthDays(eYear, eMonth);
    const firstDow = days2[0]?.dayOfWeek ?? 0;
    const totalDays = daysInEthiopianMonth(eYear, eMonth);
    const dayHeaders = lang === 'am' ? ET_DAYS_AM : ET_DAYS_EN;

    const cells = Array(firstDow).fill(null);
    for (let d = 1; d <= totalDays; d++) {
      const gDate = ethiopianToGregorian(eYear, eMonth, d);
      const holiday = getHolidayOnDate(eYear, eMonth, d);
      const isToday = todayEt.year === eYear && todayEt.month === eMonth && todayEt.day === d;
      cells.push({ day: d, gDate, holiday, isToday });
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {dayHeaders.map((d, i) => (
          <div
            key={i}
            className={`text-center text-[10px] font-semibold uppercase py-2 ${headColor}`}
            style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : 'inherit' }}
          >
            {d.slice(0, 2)}
          </div>
        ))}
        {cells.map((cell, i) => {
          if (!cell) return <div key={`e-${i}`} />;
          return (
            <div
              key={cell.day}
              title={cell.holiday ? (lang === 'am' ? cell.holiday.nameAm : cell.holiday.nameEn) : undefined}
              className={`cal-day text-sm ${cell.isToday ? 'today' : cell.holiday ? 'holiday' : ''}`}
            >
              <span>{cell.day}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderGregGrid = () => {
    const firstDay = new Date(gYear, gMonth, 1).getDay();
    const totalDays = new Date(gYear, gMonth + 1, 0).getDate();
    const gregDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const cells = Array(firstDay).fill(null);
    for (let d = 1; d <= totalDays; d++) {
      const gDate = new Date(gYear, gMonth, d);
      const et = gregorianToEthiopian(gDate);
      const holiday = getHolidayOnDate(et.year, et.month, et.day);
      const isToday = today.getFullYear() === gYear && today.getMonth() === gMonth && today.getDate() === d;
      cells.push({ day: d, et, holiday, isToday, gDate });
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {gregDays.map((d, i) => (
          <div key={i} className={`text-center text-[10px] font-semibold uppercase py-2 ${headColor}`}>
            {d}
          </div>
        ))}
        {cells.map((cell, i) => {
          if (!cell) return <div key={`g-${i}`} />;
          return (
            <div
              key={cell.day}
              title={cell.holiday ? (lang === 'am' ? cell.holiday.nameAm : cell.holiday.nameEn) : undefined}
              className={`cal-day ${cell.isToday ? 'today' : cell.holiday ? 'holiday' : ''}`}
            >
              <span className="text-sm font-medium">{cell.day}</span>
              <span className={`text-[9px] leading-none mt-0.5 ${
                cell.isToday ? 'text-emerald-100' : darkMode ? 'text-slate-600' : 'text-slate-400'
              }`}>
                {cell.et.day}/{lang === 'am' ? ET_MONTHS_AM[cell.et.month - 1].slice(0, 3) : ET_MONTHS_EN[cell.et.month - 1].slice(0, 3)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const headerLabel = view === 'eth'
    ? `${months[eMonth - 1]} ${eYear} ${lang === 'am' ? 'ዓ.ም' : 'E.C.'}`
    : `${GREG_MONTHS_EN[gMonth]} ${gYear}`;

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
          <button
            onClick={goToToday}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
              darkMode
                ? 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.1] border border-white/[0.06]'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {L.today}
          </button>
        </div>

        {/* View toggle */}
        <div className="tab-pill mb-5">
          {['eth', 'greg'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={view === v ? 'active' : ''}
            >
              {v === 'eth' ? L.ethView : L.gregView}
            </button>
          ))}
        </div>

        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className={navBtn} aria-label="Previous month">
            {L.prev}
          </button>
          <span
            className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}
            style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : 'inherit' }}
          >
            {headerLabel}
          </span>
          <button onClick={nextMonth} className={navBtn} aria-label="Next month">
            {L.next}
          </button>
        </div>

        {/* Grid */}
        <div className="transition-all duration-200">
          {view === 'eth' ? renderEthGrid() : renderGregGrid()}
        </div>

        {/* Legend */}
        <div className={`flex gap-5 mt-4 pt-4 border-t ${darkMode ? 'border-white/[0.05]' : 'border-slate-100'}`}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span className={`text-xs ${labelColor}`}>{L.legendToday}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-amber-400/70" />
            <span className={`text-xs ${labelColor}`}>{L.legendHoliday}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
