import { useState, useEffect } from 'react';
import {
  gregorianToEthiopian,
  getEthiopianMonthDays,
  daysInEthiopianMonth,
  getHolidayOnDate,
  getCurrentEthiopianPage,
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
    prev: '‹',
    next: '›',
  },
  am: {
    title: 'ቀን መቁጠሪያ',
    ethView: 'ኢትዮጵያ',
    gregView: 'ጎርጎሮስ',
    today: 'ዛሬ',
    prev: '‹',
    next: '›',
  },
};

const GREG_MONTHS_EN = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

export default function CalendarView({ lang = 'en', darkMode = false }) {
  const L = LABELS[lang];
  const today = new Date();
  const todayEt = gregorianToEthiopian(today);

  const [view, setView] = useState('eth'); // 'eth' | 'greg'
  const [eYear, setEYear] = useState(todayEt.year);
  const [eMonth, setEMonth] = useState(todayEt.month);
  // Gregorian view state
  const [gYear, setGYear] = useState(today.getFullYear());
  const [gMonth, setGMonth] = useState(today.getMonth()); // 0-indexed

  const months = lang === 'am' ? ET_MONTHS_AM : ET_MONTHS_EN;
  const days = lang === 'am' ? ET_DAYS_AM : ET_DAYS_EN;

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

  const cardBg = darkMode
    ? 'bg-gray-800/60 border-gray-700/50'
    : 'bg-white/80 border-gray-200/60';

  // ── Ethiopian calendar grid ──────────────────────────────────────────────
  const renderEthiopianGrid = () => {
    const days2 = getEthiopianMonthDays(eYear, eMonth);
    const firstDow = days2[0]?.dayOfWeek ?? 0; // 0=Sun
    const totalDays = daysInEthiopianMonth(eYear, eMonth);

    // Build padded array
    const cells = Array(firstDow).fill(null);
    for (let d = 1; d <= totalDays; d++) {
      const gDate = ethiopianToGregorian(eYear, eMonth, d);
      const holiday = getHolidayOnDate(eYear, eMonth, d);
      const isToday = todayEt.year === eYear && todayEt.month === eMonth && todayEt.day === d;
      cells.push({ day: d, gDate, holiday, isToday });
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {(lang === 'am' ? ET_DAYS_AM : ET_DAYS_EN).map((d, i) => (
          <div key={i} className={`text-center text-xs font-medium py-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}
            style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : 'inherit' }}>
            {d.slice(0, 2)}
          </div>
        ))}
        {/* Day cells */}
        {cells.map((cell, i) => {
          if (!cell) return <div key={`empty-${i}`} />;
          return (
            <div
              key={cell.day}
              title={cell.holiday ? (lang === 'am' ? cell.holiday.nameAm : cell.holiday.nameEn) : undefined}
              className={`
                relative flex flex-col items-center justify-center rounded-lg
                aspect-square text-sm font-medium cursor-default
                transition-colors duration-150
                ${cell.isToday
                  ? 'bg-green-500 text-white shadow-sm shadow-green-300/50'
                  : cell.holiday
                    ? darkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-50 text-yellow-700'
                    : darkMode
                      ? 'text-gray-200 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <span>{cell.day}</span>
              {cell.holiday && !cell.isToday && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-yellow-400" />
              )}
              {cell.isToday && cell.holiday && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-yellow-300" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ── Gregorian calendar grid ─────────────────────────────────────────────
  const renderGregorianGrid = () => {
    const firstDay = new Date(gYear, gMonth, 1).getDay();
    const totalDays = new Date(gYear, gMonth + 1, 0).getDate();
    const gregDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const cells = Array(firstDay).fill(null);
    for (let d = 1; d <= totalDays; d++) {
      const gDate = new Date(gYear, gMonth, d);
      const et = gregorianToEthiopian(gDate);
      const holiday = getHolidayOnDate(et.year, et.month, et.day);
      const isToday =
        today.getFullYear() === gYear && today.getMonth() === gMonth && today.getDate() === d;
      cells.push({ day: d, et, holiday, isToday, gDate });
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {gregDays.map((d, i) => (
          <div key={i} className={`text-center text-xs font-medium py-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
            {d}
          </div>
        ))}
        {cells.map((cell, i) => {
          if (!cell) return <div key={`empty-${i}`} />;
          return (
            <div
              key={cell.day}
              title={cell.holiday ? (lang === 'am' ? cell.holiday.nameAm : cell.holiday.nameEn) : undefined}
              className={`
                relative flex flex-col items-center justify-center rounded-lg
                aspect-square text-xs font-medium cursor-default
                transition-colors duration-150
                ${cell.isToday
                  ? 'bg-green-500 text-white'
                  : cell.holiday
                    ? darkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-50 text-yellow-700'
                    : darkMode
                      ? 'text-gray-200 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <span className="text-sm">{cell.day}</span>
              <span className={`text-[9px] leading-none ${cell.isToday ? 'text-green-100' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {cell.et.day}/{lang === 'am' ? ET_MONTHS_AM[cell.et.month - 1] : ET_MONTHS_EN[cell.et.month - 1]}
              </span>
              {cell.holiday && !cell.isToday && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-yellow-400" />
              )}
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
    <div className={`rounded-2xl border backdrop-blur-sm p-6 shadow-sm ${cardBg} transition-all duration-300`}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {L.title}
        </h2>
        <button
          onClick={goToToday}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
            darkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {L.today}
        </button>
      </div>

      {/* View toggle */}
      <div className={`flex rounded-xl p-1 mb-5 ${darkMode ? 'bg-gray-700/60' : 'bg-gray-100'}`}>
        {['eth', 'greg'].map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              view === v
                ? 'bg-green-500 text-white shadow-sm'
                : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {v === 'eth' ? L.ethView : L.gregView}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg font-medium transition-colors ${
            darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          {L.prev}
        </button>
        <span
          className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}
          style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : 'inherit' }}
        >
          {headerLabel}
        </span>
        <button
          onClick={nextMonth}
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg font-medium transition-colors ${
            darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          {L.next}
        </button>
      </div>

      {/* Grid */}
      <div className="transition-all duration-200">
        {view === 'eth' ? renderEthiopianGrid() : renderGregorianGrid()}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 pt-4 border-t border-dashed border-gray-200/50">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Holiday</span>
        </div>
      </div>
    </div>
  );
}
