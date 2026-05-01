import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  gregorianToEthiopian,
  ethiopianToGregorian,
  getEthDayName,
  getHolidayOnDate,
  getUpcomingHolidays,
  ET_MONTHS_EN,
  ET_MONTHS_AM,
  ET_DAYS_AM,
} from '../utils/ethiopianCalendar';

// ── Holiday icons ────────────────────────────────────────────────────────────
const HOLIDAY_ICONS = {
  enkutatash: '🌸', meskel: '✝️', gena: '⭐', timkat: '💧',
  adwa: '🦁', laborday: '⚒️', patriots: '🏆', dergfall: '🕊️',
  fasika: '🐣', seklet: '🙏', hosanna: '🌿',
};
const HOLIDAY_COLORS = [
  { bg: '#fff0f0', icon: '#ef4444', badge: '#fee2e2', text: '#b91c1c', daysColor: '#ef4444' },
  { bg: '#eff6ff', icon: '#3b82f6', badge: '#dbeafe', text: '#1d4ed8', daysColor: '#3b82f6' },
  { bg: '#f0fdf4', icon: '#22c55e', badge: '#dcfce7', text: '#15803d', daysColor: '#22c55e' },
  { bg: '#fefce8', icon: '#eab308', badge: '#fef9c3', text: '#a16207', daysColor: '#ca8a04' },
];



// ── Quick Converter (minimal inline) ────────────────────────────────────────
function QuickConverter({ lang, darkMode }) {
  const [gregInput, setGregInput] = useState(() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`;
  });
  const [result, setResult] = useState(null);

  useEffect(() => {
    const parts = gregInput.split('-');
    if (parts.length === 3) {
      const d = new Date(+parts[0], +parts[1]-1, +parts[2]);
      if (!isNaN(d)) {
        const et = gregorianToEthiopian(d);
        const months = lang === 'am' ? ET_MONTHS_AM : ET_MONTHS_EN;
        setResult(`${months[et.month-1]} ${et.day}, ${et.year} E.C.`);
      }
    }
  }, [gregInput, lang]);

  return (
    <div
      className="dashboard-quick-converter"
      style={{ background: '#1a6e35' }}
    >
      {/* header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}>
            <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
            <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
          </svg>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>
            {lang === 'am' ? 'ፈጣን ቀያሪ' : 'Quick Converter'}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>
            {lang === 'am' ? 'ቀናትን ወዲያውኑ ቀይሩ' : 'Jump between calendars instantly.'}
          </div>
        </div>
        <div style={{ width: 20, height: 20, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
      </div>

      {/* Date picker */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <input
          type="date"
          value={gregInput}
          onChange={e => setGregInput(e.target.value)}
          style={{
            flex: 1, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 13, outline: 'none',
            cursor: 'pointer',
          }}
        />
        <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div style={{ background: '#fff', borderRadius: 10, padding: '10px 14px', color: '#1a6e35', fontWeight: 600, fontSize: 13 }}>
          {result}
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function HomePage({ lang, darkMode, setActiveTab }) {
  const [now] = useState(new Date());
  const [ethDate, setEthDate] = useState(null);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);

  useEffect(() => {
    const et = gregorianToEthiopian(now);
    setEthDate(et);
    setUpcomingHolidays(getUpcomingHolidays(now, 4));
  }, [now]);

  if (!ethDate) return null;

  const months    = lang === 'am' ? ET_MONTHS_AM : ET_MONTHS_EN;
  const dayNameAm = ET_DAYS_AM[now.getDay()];
  const dayNameEn = getEthDayName(now, 'en');
  const holiday   = getHolidayOnDate(ethDate.year, ethDate.month, ethDate.day);

  const bg   = darkMode ? '#0f172a' : '#f9fafb';
  const card = darkMode ? '#1e293b' : '#ffffff';
  const border = darkMode ? '#1e293b' : '#f0f0f0';
  const textPrimary = darkMode ? '#f1f5f9' : '#111827';
  const textSecondary = darkMode ? '#94a3b8' : '#6b7280';
  const divider = darkMode ? '#1e293b' : '#f3f4f6';

  const getDaysAway = (gDate) => {
    const n = new Date(); n.setHours(0,0,0,0);
    const d = new Date(gDate); d.setHours(0,0,0,0);
    const diff = Math.round((d - n) / 86400000);
    if (diff === 0) return lang === 'am' ? 'ዛሬ 🎉' : 'TODAY 🎉';
    if (diff === 1) return lang === 'am' ? 'ነገ' : 'TOMORROW';
    return lang === 'am' ? `በ ${diff} ቀን` : `IN ${diff} DAYS`;
  };

  return (
    <div className="dashboard-body" style={{ background: bg, minHeight: '100vh', overflow: 'auto' }}>
      <div className="dashboard-content">
        {/* ── Page header ── */}
        <div className="dashboard-header">
          <h1 style={{ color: textPrimary, fontSize: 26, fontWeight: 700, margin: 0 }}>
            {lang === 'am' ? 'ዳሽቦርድ አጠቃላይ' : 'Dashboard Overview'}
          </h1>
          <p style={{ color: textSecondary, fontSize: 14, marginTop: 4 }}>
            {lang === 'am'
              ? 'እንኳን ደህና መጡ፣ አበቤ። የኢትዮጵያ የጊዜ ሰሌዳዎ እዚህ አለ።'
              : 'Welcome back, Abebe. Here is your Ethiopian schedule at a glance.'}
          </p>
        </div>

        {/* ── Date card + Quick Converter row ── */}
        <div className="dashboard-row dashboard-row-top">
          {/* Date overview card */}
          <div className="dashboard-date-card" style={{ background: card, border: `1px solid ${border}` }}>
            {/* Current date badge */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20 }}>
                {lang === 'am' ? 'ዛሬ' : 'Current Date'}
              </span>
            </div>

            {/* Ethiopian date – large */}
            <div style={{ fontFamily: "'Noto Sans Ethiopic', sans-serif", color: '#16a34a', fontSize: 34, fontWeight: 800, lineHeight: 1.1 }}>
              {months[ethDate.month - 1]} {ethDate.day}, {ethDate.year}
            </div>
            <div style={{ color: textSecondary, fontSize: 17, fontWeight: 500, marginTop: 4 }}>
              {ET_MONTHS_EN[ethDate.month - 1]} {ethDate.day}, {ethDate.year} EC
            </div>

            {/* Day of week */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, color: textSecondary, fontSize: 14 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              </svg>
              <span style={{ fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>{dayNameAm}</span>
              <span style={{ color: textSecondary }}>({dayNameEn})</span>
            </div>

            {/* Holiday banner */}
            {holiday && (
              <div style={{ marginTop: 12, background: '#fef9c3', color: '#a16207', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 600 }}>
                🎉 {lang === 'am' ? holiday.nameAm : holiday.nameEn}
              </div>
            )}

            {/* Divider + Gregorian */}
            <div style={{ borderTop: `1px solid ${divider}`, marginTop: 20, paddingTop: 20 }}>
              <div style={{ color: textSecondary, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                GREGORIAN
              </div>
              <div style={{ color: textPrimary, fontSize: 30, fontWeight: 800, lineHeight: 1.1 }}>
                {now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div style={{ color: textSecondary, fontSize: 13, marginTop: 4 }}>
                {now.getDate()}{getDaySuffix(now.getDate())} day of the month
              </div>
            </div>
          </div>

          {/* Quick Converter */}
          <QuickConverter lang={lang} darkMode={darkMode} />
        </div>

        {/* ── Upcoming Holidays ── */}
        <div className="dashboard-section" style={{ background: card, border: `1px solid ${border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ color: textPrimary, fontWeight: 700, fontSize: 17, margin: 0 }}>
              {lang === 'am' ? 'ቀጣይ በዓላት' : 'Upcoming Holidays'}
            </h2>
            <button
              onClick={() => setActiveTab('holidays')}
              style={{ color: '#16a34a', fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              {lang === 'am' ? 'ሁሉ ይመልከቱ' : 'View All'} ›
            </button>
          </div>

          <div className="holidays-row">
            {upcomingHolidays.map((h, i) => {
              const theme = HOLIDAY_COLORS[i % HOLIDAY_COLORS.length];
              const icon  = HOLIDAY_ICONS[h.key] ?? '🎊';
              const days  = h.gDate ? getDaysAway(h.gDate) : '';
              const etMonth = lang === 'am' ? ET_MONTHS_AM[h.month - 1] : ET_MONTHS_EN[h.month - 1];
              return (
                <Link
                  key={h.key + i}
                  to={`/holidays/${h.key}`}
                  className="holiday-card"
                  style={{ background: darkMode ? 'rgba(255,255,255,0.04)' : theme.bg, border: `1px solid ${darkMode ? '#1e293b' : 'transparent'}` }}
                >
                  {/* Icon */}
                  <div
                    className="holiday-card-icon"
                    style={{ background: darkMode ? 'rgba(255,255,255,0.08)' : theme.badge }}
                  >
                    <span style={{ fontSize: 20 }}>{icon}</span>
                  </div>

                  {/* Name */}
                  <div style={{ marginTop: 10, marginBottom: 2 }}>
                    <div
                      style={{
                        color: textPrimary, fontWeight: 600, fontSize: 13, lineHeight: 1.3,
                        fontFamily: lang === 'am' ? "'Noto Sans Ethiopic',sans-serif" : 'inherit',
                      }}
                    >
                      {lang === 'am' ? h.nameAm : h.nameEn}
                    </div>
                    <div style={{ color: textSecondary, fontSize: 11, marginTop: 4 }}>
                      {etMonth} {h.day}
                      {h.gDate && (
                        <span>, {h.gDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      )}
                    </div>
                  </div>

                  {/* Days away */}
                  <div style={{ marginTop: 8, color: theme.daysColor, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>
                    {days}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Do You Know About This ── */}
        <div style={{ marginTop: 32, marginBottom: 32 }}>
          <h2 style={{ color: textPrimary, fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
            {lang === 'am' ? 'ስለዚህ ያውቃሉ?' : 'Do You Know About This?'}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
          }}>
            {[
              { icon: '🗓️', en: 'Ethiopia has 13 months', am: 'ኢትዮጵያ 13 ወራት አሏት', bg: '#eff6ff', darkBg: 'rgba(59,130,246,0.1)' },
              { icon: '📅', en: 'Ethiopia has its own calendar', am: 'ኢትዮጵያ የራሷ የቀን አቆጣጠር አላት', bg: '#dcfce7', darkBg: 'rgba(22,163,74,0.1)' },
              { icon: '☕', en: 'Ethiopia is the birthplace of coffee', am: 'ኢትዮጵያ የቡና መገኛ ናት', bg: '#fef9c3', darkBg: 'rgba(161,98,7,0.1)' },
              { icon: '🛡️', en: 'Ethiopia was never colonized', am: 'ኢትዮጵያ መቼም በቅኝ አልተገዛችም', bg: '#fee2e2', darkBg: 'rgba(220,38,38,0.1)' },
              { icon: '🔤', en: 'Ethiopia has its own alphabets', am: 'ኢትዮጵያ የራሷ ፊደል አላት', bg: '#f3e8ff', darkBg: 'rgba(147,51,234,0.1)' },
            ].map((fact, idx) => (
              <div key={idx} style={{
                background: card,
                border: `1px solid ${border}`,
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = darkMode ? '0 6px 12px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = darkMode ? '0 4px 6px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)'; }}
              >
                <div style={{
                  width: 44, height: 44,
                  borderRadius: 12,
                  background: darkMode ? fact.darkBg : fact.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22
                }}>
                  {fact.icon}
                </div>
                <div style={{ color: textPrimary, fontWeight: 600, fontSize: 15, lineHeight: 1.4 }}>
                  {lang === 'am' ? fact.am : fact.en}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function getDaySuffix(d) {
  if (d >= 11 && d <= 13) return 'th';
  switch (d % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}
