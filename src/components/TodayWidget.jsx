import { useState, useEffect } from 'react';
import {
  gregorianToEthiopian,
  formatEthiopianDate,
  formatGregorianDate,
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
    holiday: '🎉 Today is a Holiday',
    monthLabel: 'Month',
  },
  am: {
    title: 'ዛሬ ምን ቀን ነው',
    gregorian: 'ጎርጎሮሲያን',
    ethiopian: 'ኢትዮጵያ',
    dayName: 'የሳምንቱ ቀን',
    holiday: '🎉 ዛሬ በዓል ነው',
    monthLabel: 'ወር',
  },
};

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
  const monthsAm = ET_MONTHS_AM;
  const monthsEn = ET_MONTHS_EN;

  const card = darkMode
    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50'
    : 'bg-gradient-to-br from-white to-gray-50/80 border-gray-200/60';

  return (
    <div className={`rounded-2xl border backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300 ${card}`}>
      {/* Top accent stripe */}
      <div className="h-1 bg-gradient-to-r from-green-500 via-yellow-400 to-red-500" />

      <div className="p-6">
        <h2 className={`text-xl font-semibold mb-5 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {L.title}
        </h2>

        {/* Date grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Gregorian */}
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-700/40' : 'bg-blue-50/60'}`}>
            <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-500'}`}>
              🌍 {L.gregorian}
            </p>
            <p className={`text-2xl font-bold leading-none ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {now.getDate()}
            </p>
            <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {now.toLocaleDateString(lang === 'am' ? 'am-ET' : 'en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Ethiopian */}
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-green-900/30' : 'bg-green-50/80'}`}>
            <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              🇪🇹 {L.ethiopian}
            </p>
            <p className={`text-2xl font-bold leading-none ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {ethDate.day}
            </p>
            <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {lang === 'am' ? monthsAm[ethDate.month - 1] : monthsEn[ethDate.month - 1]}{' '}
              {ethDate.year} {lang === 'am' ? 'ዓ.ም' : 'E.C.'}
            </p>
          </div>
        </div>

        {/* Day name */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <span className="text-lg">📅</span>
            <span className={`font-medium text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>
              {dayNameAm}
            </span>
            {lang === 'en' && (
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                · {dayNameEn}
              </span>
            )}
          </div>
        </div>

        {/* Holiday banner */}
        {holiday && (
          <div className={`mt-4 rounded-xl p-3 text-center text-sm font-medium animate-pulse ${
            darkMode
              ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/40'
              : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
          }`}>
            {L.holiday}: {lang === 'am' ? holiday.nameAm : holiday.nameEn}
          </div>
        )}
      </div>
    </div>
  );
}
