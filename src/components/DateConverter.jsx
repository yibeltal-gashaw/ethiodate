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
    subtitle: 'Gregorian ↔ Ethiopian',
    gToE: 'Gregorian → Ethiopian',
    eToG: 'Ethiopian → Gregorian',
    gregDate: 'Gregorian Date',
    ethYear: 'Year (E.C.)',
    ethMonth: 'Month',
    ethDay: 'Day',
    result: 'Converted Date',
    copy: 'Copy',
    copied: 'Copied',
    holiday: 'Holiday',
    dayName: 'Day',
  },
  am: {
    title: 'ቀን ቀያሪ',
    subtitle: 'ጎርጎሮስ ↔ ኢትዮጵያ',
    gToE: 'ጎርጎሮስ → ኢትዮጵያ',
    eToG: 'ኢትዮጵያ → ጎርጎሮስ',
    gregDate: 'ጎርጎሮስያዊ ቀን',
    ethYear: 'ዓ.ም',
    ethMonth: 'ወር',
    ethDay: 'ቀን',
    result: 'ውጤት',
    copy: 'ቅዳ',
    copied: 'ተቀድቷል',
    holiday: 'በዓል',
    dayName: 'ቀን',
  },
};

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <polyline points="19 12 12 19 5 12"/>
    </svg>
  );
}

function ChevronDown({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

export default function DateConverter({ lang = 'en', darkMode = false }) {
  const L = LABELS[lang];
  const [mode, setMode] = useState('gToE');
  const [gregInput, setGregInput] = useState('');
  const [ethYear, setEthYear] = useState('');
  const [ethMonth, setEthMonth] = useState('1');
  const [ethDay, setEthDay] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setGregInput(`${yyyy}-${mm}-${dd}`);
  }, []);

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

  const surface = darkMode ? 'bg-[#181c27] border-white/[0.07]' : 'bg-white border-black/[0.06]';
  const inner = darkMode ? 'bg-white/[0.04] border-white/[0.06]' : 'bg-slate-50 border-black/[0.05]';
  const labelColor = darkMode ? 'text-slate-400' : 'text-slate-500';
  const inputCls = `input-base ${darkMode ? 'bg-white/[0.05] border-white/[0.08] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`;

  return (
    <div
      className={`rounded-2xl border overflow-hidden shadow-lg transition-all duration-300 ${surface}`}
      style={{ boxShadow: darkMode ? '0 1px 3px rgba(0,0,0,0.4),0 4px 20px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)' }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="mb-5">
          <h2 className={`text-sm font-semibold uppercase tracking-widest ${labelColor}`}>
            {L.title}
          </h2>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            {L.subtitle}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="tab-pill mb-5">
          {['gToE', 'eToG'].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={mode === m ? 'active' : ''}
              style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : 'inherit' }}
            >
              {m === 'gToE' ? L.gToE : L.eToG}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="space-y-3">
          {mode === 'gToE' ? (
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${labelColor}`}>{L.gregDate}</label>
              <input
                type="date"
                value={gregInput}
                onChange={e => setGregInput(e.target.value)}
                className={inputCls}
              />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${labelColor}`}>{L.ethYear}</label>
                <input
                  type="number"
                  placeholder="2016"
                  value={ethYear}
                  onChange={e => setEthYear(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${labelColor}`}>{L.ethMonth}</label>
                <div className="relative">
                  <select
                    value={ethMonth}
                    onChange={e => setEthMonth(e.target.value)}
                    className={`${inputCls} pr-8`}
                  >
                    {months.map((mn, i) => (
                      <option key={i} value={i + 1}>{mn}</option>
                    ))}
                  </select>
                  <div className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${labelColor}`}>
                    <ChevronDown />
                  </div>
                </div>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${labelColor}`}>{L.ethDay}</label>
                <input
                  type="number"
                  placeholder="1"
                  min="1"
                  max="30"
                  value={ethDay}
                  onChange={e => setEthDay(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          )}
        </div>

        {/* Arrow divider */}
        {result && (
          <div className={`flex justify-center my-4 ${labelColor}`}>
            <ArrowDownIcon />
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`rounded-xl border p-4 transition-all duration-300 ${
            darkMode
              ? 'bg-emerald-500/[0.08] border-emerald-500/20'
              : 'bg-emerald-50 border-emerald-100'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className={`text-[10px] font-semibold uppercase tracking-widest mb-1.5 ${
                  darkMode ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  {L.result}
                </p>
                <p className={`font-bold text-lg leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {result.label}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className={`badge`}>
                    {result.dayName}
                  </span>
                  {result.holiday && (
                    <span className={`badge ${darkMode ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
                      {L.holiday}: {result.holiday}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleCopy}
                title={L.copy}
                className={`shrink-0 flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  copied
                    ? 'bg-emerald-500 text-white'
                    : darkMode
                      ? 'bg-white/[0.08] text-slate-300 hover:bg-white/[0.12]'
                      : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? L.copied : L.copy}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
