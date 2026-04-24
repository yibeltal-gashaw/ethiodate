import { useState, useEffect, useCallback } from 'react';
import {
  gregorianToEthiopian,
  ethiopianToGregorian,
  formatEthiopianDate,
  formatGregorianDate,
  getEthDayName,
  getHolidayOnDate,
  ET_MONTHS_EN,
  ET_MONTHS_AM,
} from '../utils/ethiopianCalendar';

const LABELS = {
  en: {
    title: 'Date Converter',
    subtitle: 'Convert between Gregorian and Ethiopian calendars',
    gToE: 'Gregorian → Ethiopian',
    eToG: 'Ethiopian → Gregorian',
    gregDate: 'Gregorian Date',
    ethDate: 'Ethiopian Date',
    ethYear: 'Ethiopian Year',
    ethMonth: 'Month',
    ethDay: 'Day',
    result: 'Result',
    copy: 'Copy',
    copied: 'Copied!',
    holiday: '🎉 Holiday',
    dayName: 'Day',
    swap: 'Swap',
  },
  am: {
    title: 'ቀን ቀያሪ',
    subtitle: 'በጎርጎሮስያዊ እና በኢትዮጵያ ቀን አቆጣጠር መካከል ይቀይሩ',
    gToE: 'ጎርጎሮስ → ኢትዮጵያ',
    eToG: 'ኢትዮጵያ → ጎርጎሮስ',
    gregDate: 'ጎርጎሮስያዊ ቀን',
    ethDate: 'ኢትዮጵያ ቀን',
    ethYear: 'ዓመተ ምሕረት',
    ethMonth: 'ወር',
    ethDay: 'ቀን',
    result: 'ውጤት',
    copy: 'ቅዳ',
    copied: 'ተቀድቷል!',
    holiday: '🎉 በዓል',
    dayName: 'ቀን',
    swap: 'ቀይር',
  },
};

export default function DateConverter({ lang = 'en', darkMode = false }) {
  const L = LABELS[lang];
  const [mode, setMode] = useState('gToE'); // 'gToE' | 'eToG'
  const [gregInput, setGregInput] = useState('');
  const [ethYear, setEthYear] = useState('');
  const [ethMonth, setEthMonth] = useState('1');
  const [ethDay, setEthDay] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Initialize with today
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setGregInput(`${yyyy}-${mm}-${dd}`);
  }, []);

  // Auto-convert when inputs change
  useEffect(() => {
    if (mode === 'gToE' && gregInput) {
      const parts = gregInput.split('-');
      if (parts.length === 3) {
        const gDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        if (!isNaN(gDate)) {
          const et = gregorianToEthiopian(gDate);
          const holiday = getHolidayOnDate(et.year, et.month, et.day);
          setResult({
            type: 'eth',
            label: formatEthiopianDate(et.year, et.month, et.day, lang),
            dayName: getEthDayName(gDate, lang),
            holiday: holiday ? (lang === 'am' ? holiday.nameAm : holiday.nameEn) : null,
            raw: `${formatEthiopianDate(et.year, et.month, et.day, lang)} (${getEthDayName(gDate, lang)})`,
          });
        }
      }
    } else if (mode === 'eToG' && ethYear && ethDay) {
      const y = parseInt(ethYear);
      const m = parseInt(ethMonth);
      const d = parseInt(ethDay);
      if (y > 0 && m >= 1 && m <= 13 && d >= 1 && d <= 30) {
        try {
          const gDate = ethiopianToGregorian(y, m, d);
          const holiday = getHolidayOnDate(y, m, d);
          setResult({
            type: 'greg',
            label: formatGregorianDate(gDate, lang),
            dayName: getEthDayName(gDate, lang),
            holiday: holiday ? (lang === 'am' ? holiday.nameAm : holiday.nameEn) : null,
            raw: formatGregorianDate(gDate, lang),
          });
        } catch {
          setResult(null);
        }
      }
    }
  }, [mode, gregInput, ethYear, ethMonth, ethDay, lang]);

  const handleCopy = useCallback(() => {
    if (result?.raw) {
      navigator.clipboard.writeText(result.raw).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, [result]);

  const months = lang === 'am' ? ET_MONTHS_AM : ET_MONTHS_EN;

  const cardBg = darkMode
    ? 'bg-gray-800/60 border-gray-700/50'
    : 'bg-white/80 border-gray-200/60';
  const inputCls = darkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-400'
    : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-green-500';
  const labelCls = darkMode ? 'text-gray-300' : 'text-gray-600';
  const tabActive = 'bg-green-500 text-white shadow-sm shadow-green-200/50';
  const tabInactive = darkMode
    ? 'text-gray-400 hover:text-gray-200'
    : 'text-gray-500 hover:text-gray-700';

  return (
    <div className={`rounded-2xl border backdrop-blur-sm p-6 shadow-sm ${cardBg} transition-all duration-300`}>
      {/* Header */}
      <div className="mb-5">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {L.title}
        </h2>
        <p className={`text-sm mt-1 ${labelCls}`}>{L.subtitle}</p>
      </div>

      {/* Mode toggle tabs */}
      <div className={`flex rounded-xl p-1 mb-5 ${darkMode ? 'bg-gray-700/60' : 'bg-gray-100'}`}>
        {['gToE', 'eToG'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === m ? tabActive : tabInactive
            }`}
          >
            {m === 'gToE' ? L.gToE : L.eToG}
          </button>
        ))}
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        {mode === 'gToE' ? (
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${labelCls}`}>
              {L.gregDate}
            </label>
            <input
              type="date"
              value={gregInput}
              onChange={e => setGregInput(e.target.value)}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors duration-200 ${inputCls}`}
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${labelCls}`}>{L.ethYear}</label>
              <input
                type="number"
                placeholder="2016"
                value={ethYear}
                onChange={e => setEthYear(e.target.value)}
                className={`w-full rounded-xl border px-3 py-3 text-sm outline-none transition-colors duration-200 ${inputCls}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${labelCls}`}>{L.ethMonth}</label>
              <select
                value={ethMonth}
                onChange={e => setEthMonth(e.target.value)}
                className={`w-full rounded-xl border px-3 py-3 text-sm outline-none transition-colors duration-200 ${inputCls}`}
              >
                {months.map((mn, i) => (
                  <option key={i} value={i + 1}>{mn}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${labelCls}`}>{L.ethDay}</label>
              <input
                type="number"
                placeholder="1"
                min="1"
                max="30"
                value={ethDay}
                onChange={e => setEthDay(e.target.value)}
                className={`w-full rounded-xl border px-3 py-3 text-sm outline-none transition-colors duration-200 ${inputCls}`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className={`mt-5 rounded-xl p-4 transition-all duration-300 ${
          darkMode
            ? 'bg-green-900/20 border border-green-700/40'
            : 'bg-green-50 border border-green-100'
        }`}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                {L.result}
              </p>
              <p className={`font-semibold text-base leading-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {result.label}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-500'
                }`}>
                  📅 {result.dayName}
                </span>
                {result.holiday && (
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                    darkMode ? 'bg-yellow-900/40 text-yellow-300' : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {L.holiday}: {result.holiday}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleCopy}
              title={L.copy}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                copied
                  ? darkMode ? 'bg-green-700 text-white' : 'bg-green-500 text-white'
                  : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {copied ? L.copied : L.copy}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
