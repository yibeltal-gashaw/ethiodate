import { useState, useEffect, useCallback } from 'react';
import {
  gregorianToEthiopian,
  ethiopianToGregorian,
  getEthDayName,
  getHolidayOnDate,
  ET_MONTHS_EN,
  ET_MONTHS_AM,
  ET_DAYS_AM,
} from '../utils/ethiopianCalendar';

// ── Zemene (4-year evangelist cycle) ────────────────────────────────────────
const ZEMENE_EN = ['Matewos', 'Marqos', 'Luqas', 'Yohannes'];
const ZEMENE_AM = ['ማቴዎስ', 'ማርቆስ', 'ሉቃስ', 'ዮሐንስ'];
const ZEMENE_LABEL_EN = ['Zemene Matewos', 'Zemene Marqos', 'Zemene Luqas', 'Zemene Yohannes'];
const ZEMENE_LABEL_AM = ['ዘመነ ማቴዎስ', 'ዘመነ ማርቆስ', 'ዘመነ ሉቃስ', 'ዘመነ ዮሐንስ'];

function getZemene(eYear) {
  return eYear % 4;
}

// ── Initial recent conversions ────────────────────────────────────────────────
const INITIAL_RECENT = [
  { greg: 'Sep 11, 2024', eth: 'Meskerem 1' },
  { greg: 'Jan 7, 2024',  eth: 'Tahsas 28'  },
];

function toDateInputValue(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_NAMES_AM = ['ጃንዩወሪ','ፌብሩወሪ','ማርች','ኤፕሪል','ሜይ','ጁን','ጁላይ','ኦገስት','ሴፕቴምበር','ኦክቶበር','ኖቬምበር','ዲሴምበር'];

export default function ConverterPage({ lang, darkMode }) {
  const [direction, setDirection] = useState('gToE');
  const [gregYear, setGregYear]   = useState(() => new Date().getFullYear().toString());
  const [gregMonth, setGregMonth] = useState(() => (new Date().getMonth() + 1).toString());
  const [gregDay, setGregDay]     = useState(() => new Date().getDate().toString());
  const [ethYear, setEthYear]     = useState(() => gregorianToEthiopian(new Date()).year.toString());
  const [ethMonth, setEthMonth]   = useState(() => gregorianToEthiopian(new Date()).month.toString());
  const [ethDay, setEthDay]       = useState(() => gregorianToEthiopian(new Date()).day.toString());
  const [result, setResult]       = useState(null);
  const [copied, setCopied]       = useState(false);
  const [recent, setRecent]       = useState(INITIAL_RECENT);

  // Derive result whenever inputs change
  useEffect(() => {
    let gDate;
    let et;
    
    if (direction === 'gToE') {
      if (!gregYear || !gregMonth || !gregDay) return;
      const y = +gregYear;
      const m = +gregMonth;
      const d = +gregDay;
      if (y < 1000 || m < 1 || m > 12 || d < 1 || d > 31) return;
      gDate = new Date(y, m - 1, d);
      // Validate correct parsing (e.g. catch Feb 30 becoming Mar 2)
      if (isNaN(gDate) || gDate.getMonth() !== m - 1 || gDate.getDate() !== d) return;
      et = gregorianToEthiopian(gDate);
    } else {
      if (!ethYear || !ethMonth || !ethDay) return;
      const y = +ethYear;
      const m = +ethMonth;
      const d = +ethDay;
      if (y < 1 || m < 1 || m > 13 || d < 1 || d > 30) return;
      try {
        gDate = ethiopianToGregorian(y, m, d);
        et = { year: y, month: m, day: d };
      } catch (e) {
        return;
      }
    }

    const months  = ET_MONTHS_EN;
    const monthsAm= ET_MONTHS_AM;
    const zi      = getZemene(et.year);
    const holiday = getHolidayOnDate(et.year, et.month, et.day);

    setResult({
      gDate,
      gDay:   gDate.getDate(),
      gMonth: MONTH_NAMES[gDate.getMonth()],
      gMonthAm: MONTH_NAMES_AM[gDate.getMonth()],
      gYear:  gDate.getFullYear(),
      et,
      etMonthEn: months[et.month - 1],
      etMonthAm: monthsAm[et.month - 1],
      dayNameEn: getEthDayName(gDate, 'en'),
      dayNameAm: ET_DAYS_AM[gDate.getDay()],
      zemeneIdx: zi,
      zemeneEn:  ZEMENE_LABEL_EN[zi],
      zemeneAm:  ZEMENE_LABEL_AM[zi],
      holiday:   holiday ? (lang === 'am' ? holiday.nameAm : holiday.nameEn) : null,
    });
  }, [gregYear, gregMonth, gregDay, ethYear, ethMonth, ethDay, direction, lang]);

  const toggleDirection = () => {
    setDirection(d => d === 'gToE' ? 'eToG' : 'gToE');
  };

  const handleCopy = useCallback(() => {
    if (!result) return;
    const text = lang === 'am'
      ? `${result.etMonthAm} ${result.et.day}፣ ${result.et.year}`
      : `${result.etMonthEn} ${result.et.day}, ${result.et.year} E.C.`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      // Add to recent
      const gregLabel = result.gDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const ethLabel  = `${result.etMonthEn} ${result.et.day}`;
      setRecent(prev => [{ greg: gregLabel, eth: ethLabel }, ...prev].slice(0, 4));
    });
  }, [result, lang]);

  const handleShare = useCallback(() => {
    if (!result) return;
    
    const text = lang === 'am'
      ? `📅 ቀን ቀያሪ - EthioDate\n\n🌍 ጎርጎሮሲያን: ${result.gMonth} ${result.gDay}, ${result.gYear}\n🇪🇹 ኢትዮጵያ: ${result.etMonthAm} ${result.et.day}, ${result.et.year}\n${result.holiday ? `🎉 በዓል: ${result.holiday}\n` : ''}\n✨ በ EthioDate መተግበሪያ የተጋራ`
      : `📅 Date Conversion - EthioDate\n\n🌍 Gregorian: ${result.gMonth} ${result.gDay}, ${result.gYear}\n🇪🇹 Ethiopian: ${result.etMonthEn} ${result.et.day}, ${result.et.year} E.C.\n${result.holiday ? `🎉 Holiday: ${result.holiday}\n` : ''}\n✨ Shared from the EthioDate app`;

    if (navigator.share) {
      navigator.share({ title: 'EthioDate Conversion', text }).catch(err => console.log('Error sharing', err));
    } else {
      navigator.clipboard.writeText(text);
      alert(lang === 'am' ? 'ወደ ክሊፕቦርድ ተቀድቷል!' : 'Copied to clipboard!');
    }
  }, [result, lang]);

  const handleAddToCalendar = useCallback(() => {
    if (!result) return;
    const { gDate, etMonthEn, etMonthAm, et, holiday } = result;
    
    const startDate = new Date(gDate);
    const endDate = new Date(gDate);
    endDate.setDate(endDate.getDate() + 1);

    const formatCalDate = (date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}${mm}${dd}`;
    };

    const dtStart = formatCalDate(startDate);
    const dtEnd = formatCalDate(endDate);
    
    const eventName = holiday 
      ? (lang === 'am' ? `የኢትዮጵያ በዓል: ${holiday}` : `Ethiopian Holiday: ${holiday}`)
      : (lang === 'am' ? `የኢትዮጵያ ቀን: ${etMonthAm} ${et.day}` : `Ethiopian Date: ${etMonthEn} ${et.day}, ${et.year}`);
    
    const description = lang === 'am' 
      ? `በጎርጎሮሲያን: ${gDate.toDateString()}\nበኢትዮጵያ: ${etMonthAm} ${et.day}, ${et.year}`
      : `Gregorian: ${gDate.toDateString()}\nEthiopian: ${etMonthEn} ${et.day}, ${et.year}`;
      
    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.append('action', 'TEMPLATE');
    url.searchParams.append('text', eventName);
    url.searchParams.append('dates', `${dtStart}/${dtEnd}`);
    url.searchParams.append('details', description);

    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  }, [result, lang]);

  // ── Colours ──────────────────────────────────────────────────────────────
  const pageBg   = darkMode ? '#0f172a' : '#f9fafb';
  const cardBg   = darkMode ? '#1e293b' : '#ffffff';
  const border   = darkMode ? '#334155' : '#e5e7eb';
  const textPrimary   = darkMode ? '#f1f5f9' : '#111827';
  const textSecondary = darkMode ? '#94a3b8' : '#6b7280';
  const inputBg  = darkMode ? '#0f172a' : '#f9fafb';
  const infoBg   = darkMode ? '#1e293b' : '#f9fafb';

  return (
    <div style={{ background: pageBg, minHeight: '100vh', overflowY: 'auto' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 24px 48px' }}>

        {/* ── Page heading ── */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{ color: textPrimary, fontSize: 30, fontWeight: 800, margin: 0 }}>
            {lang === 'am' ? 'ቀን ቀያሪ' : 'Date Converter'}
          </h1>
          <p style={{ color: textSecondary, fontSize: 14, marginTop: 8, lineHeight: 1.6, maxWidth: 480, margin: '8px auto 0' }}>
            {lang === 'am'
              ? 'በጎርጎሮሲያን እና ኢትዮጵያ ቀን አቆጣጠር መካከል ያለ ልዩነትን በትክክል ያሳዩ።'
              : 'Seamlessly bridge time between the Gregorian and Ethiopian calendars with cultural accuracy.'}
          </p>
        </div>

        {/* ── Converter panels ── */}
        <div style={{ display: 'flex', gap: 0, alignItems: 'stretch', marginBottom: 20, borderRadius: 20, overflow: 'hidden', boxShadow: darkMode ? '0 4px 32px rgba(0,0,0,0.4)' : '0 4px 32px rgba(0,0,0,0.08)', position: 'relative' }}>

          {/* LEFT: Input */}
          <div style={{ flex: 1, background: cardBg, padding: '28px 28px 28px', minWidth: 0 }}>
            {direction === 'gToE' ? (
              <>
                {/* Header Gregorian */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: darkMode ? '#0f172a' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={darkMode ? '#94a3b8' : '#6b7280'} strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                  </div>
                  <div>
                    <div style={{ color: textPrimary, fontWeight: 700, fontSize: 17 }}>
                      {lang === 'am' ? 'ጎርጎሮሲያን' : 'Gregorian'}
                    </div>
                    <div style={{ color: textSecondary, fontSize: 12 }}>
                      {lang === 'am' ? 'ዓለምአቀፍ ደረጃ' : 'Standard International'}
                    </div>
                  </div>
                </div>

                {/* Date input */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', color: textSecondary, fontSize: 12, fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {lang === 'am' ? 'ቀን ይምረጡ' : 'Select Date'}
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1fr', gap: 8 }}>
                    <input
                      type="number"
                      placeholder={lang === 'am' ? 'ዓመት' : 'Year'}
                      value={gregYear}
                      onChange={e => setGregYear(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 12,
                        border: `1px solid ${border}`, background: inputBg,
                        color: textPrimary, fontSize: 16, fontWeight: 600,
                        outline: 'none', boxSizing: 'border-box'
                      }}
                    />
                    <select
                      value={gregMonth}
                      onChange={e => setGregMonth(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 12,
                        border: `1px solid ${border}`, background: inputBg,
                        color: textPrimary, fontSize: 16, fontWeight: 600,
                        outline: 'none', cursor: 'pointer', boxSizing: 'border-box'
                      }}
                    >
                      {(lang === 'am' ? MONTH_NAMES_AM : MONTH_NAMES).map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                    </select>
                    <input
                      type="number"
                      placeholder={lang === 'am' ? 'ቀን' : 'Day'}
                      min="1" max="31"
                      value={gregDay}
                      onChange={e => setGregDay(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 12,
                        border: `1px solid ${border}`, background: inputBg,
                        color: textPrimary, fontSize: 16, fontWeight: 600,
                        outline: 'none', boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Month / Day / Year breakdown */}
                {result && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {[
                      { label: lang === 'am' ? 'ወር' : 'Month', value: lang === 'am' ? result.gMonthAm : result.gMonth },
                      { label: lang === 'am' ? 'ቀን' : 'Day',   value: result.gDay   },
                      { label: lang === 'am' ? 'ዓመት' : 'Year', value: result.gYear  },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ background: darkMode ? '#0f172a' : '#f9fafb', borderRadius: 10, padding: '12px 10px', textAlign: 'center', border: `1px solid ${border}` }}>
                        <div style={{ color: textSecondary, fontSize: 11, fontWeight: 600, marginBottom: 4 }}>{label}</div>
                        <div style={{ color: textPrimary, fontWeight: 700, fontSize: 15 }}>{value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Header Ethiopian */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: darkMode ? '#0f172a' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={darkMode ? '#94a3b8' : '#6b7280'} strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                  </div>
                  <div>
                    <div style={{ color: textPrimary, fontWeight: 700, fontSize: 17 }}>
                      {lang === 'am' ? 'ኢትዮጵያ' : 'Ethiopian'}
                    </div>
                    <div style={{ color: textSecondary, fontSize: 12 }}>
                      {lang === 'am' ? 'ጥንታዊ ቅርስ' : 'Ancient Heritage'}
                    </div>
                  </div>
                </div>

                {/* Ethiopian Date Inputs */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', color: textSecondary, fontSize: 12, fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {lang === 'am' ? 'ቀን ይምረጡ' : 'Select Date'}
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1fr', gap: 8 }}>
                    <input
                      type="number"
                      placeholder={lang === 'am' ? 'ዓመት' : 'Year'}
                      value={ethYear}
                      onChange={e => setEthYear(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 12,
                        border: `1px solid ${border}`, background: inputBg,
                        color: textPrimary, fontSize: 16, fontWeight: 600,
                        outline: 'none', boxSizing: 'border-box'
                      }}
                    />
                    <select
                      value={ethMonth}
                      onChange={e => setEthMonth(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 12,
                        border: `1px solid ${border}`, background: inputBg,
                        color: textPrimary, fontSize: 16, fontWeight: 600,
                        outline: 'none', cursor: 'pointer', boxSizing: 'border-box'
                      }}
                    >
                      {(lang === 'am' ? ET_MONTHS_AM : ET_MONTHS_EN).map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                    </select>
                    <input
                      type="number"
                      placeholder={lang === 'am' ? 'ቀን' : 'Day'}
                      min="1" max="30"
                      value={ethDay}
                      onChange={e => setEthDay(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 12,
                        border: `1px solid ${border}`, background: inputBg,
                        color: textPrimary, fontSize: 16, fontWeight: 600,
                        outline: 'none', boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Month / Day / Year breakdown */}
                {result && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {[
                      { label: lang === 'am' ? 'ወር' : 'Month', value: lang === 'am' ? result.etMonthAm : result.etMonthEn },
                      { label: lang === 'am' ? 'ቀን' : 'Day',   value: result.et.day   },
                      { label: lang === 'am' ? 'ዓመት' : 'Year', value: result.et.year  },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ background: darkMode ? '#0f172a' : '#f9fafb', borderRadius: 10, padding: '12px 10px', textAlign: 'center', border: `1px solid ${border}` }}>
                        <div style={{ color: textSecondary, fontSize: 11, fontWeight: 600, marginBottom: 4 }}>{label}</div>
                        <div style={{ color: textPrimary, fontWeight: 700, fontSize: 15 }}>{value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Swap button (absolute center) */}
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
            <button onClick={toggleDirection} style={{ width: 44, height: 44, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(22,163,74,0.4)', border: 'none', cursor: 'pointer', transition: 'transform 0.2s', padding: 0 }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
              </svg>
            </button>
          </div>

          {/* RIGHT: Output */}
          <div style={{ flex: 1, background: '#1a6e35', padding: '28px 28px 28px', minWidth: 0 }}>
            {direction === 'gToE' ? (
              <>
                {/* Header Ethiopian */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>
                      {lang === 'am' ? 'ኢትዮጵያ' : 'Ethiopian'}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>
                      {lang === 'am' ? 'ጥንታዊ ቅርስ' : 'Ancient Heritage'}
                    </div>
                  </div>
                </div>

                {/* Big Ethiopian date */}
                {result ? (
                  <>
                    <div style={{ marginBottom: 4 }}>
                      <div style={{ color: '#fff', fontSize: 34, fontWeight: 800, fontFamily: "'Noto Sans Ethiopic', sans-serif", lineHeight: 1.15 }}>
                        {result.etMonthAm} {result.et.day}, {result.et.year}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, marginTop: 4 }}>
                        {result.etMonthEn} {result.et.day}, {result.et.year}
                      </div>
                      {result.holiday && (
                        <div style={{ marginTop: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px', color: '#fff', fontSize: 12, fontWeight: 600, display: 'inline-block' }}>
                          🎉 {result.holiday}
                        </div>
                      )}
                    </div>

                    {/* Zemene + Day */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 0, marginTop: 20, background: 'rgba(0,0,0,0.18)', borderRadius: 12, overflow: 'hidden' }}>
                      <div style={{ padding: '14px 16px' }}>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', marginBottom: 4 }}>
                          {lang === 'am' ? 'ዘመን' : 'Zemene'}
                        </div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>
                          {lang === 'am' ? result.zemeneAm : result.zemeneEn}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.15)' }} />
                      <div style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', marginBottom: 4 }}>
                          {lang === 'am' ? 'ቀን' : 'Day'}
                        </div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>
                          {lang === 'am'
                            ? `${result.dayNameAm}`
                            : `${result.dayNameAm} (${result.dayNameEn})`}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Calculating…</div>
                )}
              </>
            ) : (
              <>
                {/* Header Gregorian */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>
                      {lang === 'am' ? 'ጎርጎሮሲያን' : 'Gregorian'}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>
                      {lang === 'am' ? 'ዓለምአቀፍ ደረጃ' : 'Standard International'}
                    </div>
                  </div>
                </div>

                {/* Big Gregorian date */}
                {result ? (
                  <>
                    <div style={{ marginBottom: 4 }}>
                      <div style={{ color: '#fff', fontSize: 34, fontWeight: 800, fontFamily: "'Inter', sans-serif", lineHeight: 1.15 }}>
                        {result.gMonth} {result.gDay}, {result.gYear}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, marginTop: 4 }}>
                        {result.dayNameEn}
                      </div>
                      {result.holiday && (
                        <div style={{ marginTop: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px', color: '#fff', fontSize: 12, fontWeight: 600, display: 'inline-block' }}>
                          🎉 {result.holiday}
                        </div>
                      )}
                    </div>

                    {/* Zemene + Day */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 0, marginTop: 20, background: 'rgba(0,0,0,0.18)', borderRadius: 12, overflow: 'hidden' }}>
                      <div style={{ padding: '14px 16px' }}>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', marginBottom: 4 }}>
                          {lang === 'am' ? 'ዘመን' : 'Zemene'}
                        </div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>
                          {lang === 'am' ? result.zemeneAm : result.zemeneEn}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.15)' }} />
                      <div style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', marginBottom: 4 }}>
                          {lang === 'am' ? 'ቀን' : 'Day'}
                        </div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>
                          {lang === 'am'
                            ? `${result.dayNameAm}`
                            : `${result.dayNameAm} (${result.dayNameEn})`}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Calculating…</div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
          {/* Copy */}
          <button
            onClick={handleCopy}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 50, border: 'none',
              background: copied ? '#16a34a' : '#f59e0b',
              color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.2s', boxShadow: '0 2px 12px rgba(245,158,11,0.35)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            {copied ? (lang === 'am' ? 'ተቀድቷል!' : 'Copied!') : (lang === 'am' ? 'ቀኑን ቅዳ' : 'Copy Ethiopian Date')}
          </button>

          {/* Add to Calendar */}
          <button
            onClick={handleAddToCalendar}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 50,
              background: cardBg, border: `1.5px solid ${border}`,
              color: textPrimary, fontSize: 14, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
            {lang === 'am' ? 'ወደ ቀን መቁጠሪያ ጨምር' : 'Add to Calendar'}
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 50,
              background: cardBg, border: `1.5px solid ${border}`,
              color: textPrimary, fontSize: 14, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            {lang === 'am' ? 'ውጤቱን አጋራ' : 'Share Conversion'}
          </button>
        </div>

        {/* ── Bottom info cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Why the difference */}
          <div style={{ background: infoBg, border: `1px solid ${border}`, borderRadius: 16, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fef9c3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a16207" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div>
                <div style={{ color: textPrimary, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
                  {lang === 'am' ? 'ለምን ልዩነት አለ?' : 'Why the difference?'}
                </div>
                <p style={{ color: textSecondary, fontSize: 13, lineHeight: 1.65, margin: 0 }}>
                  {lang === 'am'
                    ? 'የኢትዮጵያ ቀን አቆጣጠር ኮፕቲካዊ ቀን አቆጣጠር ጋር ቅርርብ ያለው የፀሐይ ቀን አቆጣጠር ነው። 30 ቀናት ያሉት 12 ወሮች እና 5 ወይም 6 ቀናት ያለው 13ኛ ወር አለው። ከጎርጎሮሲያን 7-8 ዓመት ወደ ኋላ ይቀራል።'
                    : 'The Ethiopian calendar is a solar calendar that has more in common with the Coptic calendar. It has 12 months of 30 days each, plus a 13th month (Pagume) of 5 or 6 days. It is currently about 7 to 8 years behind the Gregorian calendar.'}
                </p>
              </div>
            </div>
          </div>

          {/* Recent conversions */}
          <div style={{ background: infoBg, border: `1px solid ${border}`, borderRadius: 16, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: darkMode ? '#334155' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={textSecondary} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/><polyline points="2 12 12 12 17 7"/></svg>
              </div>
              <div style={{ color: textPrimary, fontWeight: 700, fontSize: 14 }}>
                {lang === 'am' ? 'የቅርብ ጊዜ ቀናት' : 'Recent Conversions'}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recent.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: textSecondary }}>
                  <span>{r.greg}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                    <span style={{ color: '#16a34a', fontWeight: 600 }}>{r.eth}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
