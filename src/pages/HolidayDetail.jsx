import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import {
  getHolidaysForYear,
  gregorianToEthiopian,
  ethiopianToGregorian,
  ET_MONTHS_EN,
  ET_MONTHS_AM,
} from '../utils/ethiopianCalendar';
import { TagBadge } from './HolidaysPage';
import { HOLIDAY_META, GRADIENT_FALLBACKS, DETAILED_DESCRIPTIONS } from '../data/holidaysData';
export default function HolidayDetail() {
  const { key } = useParams();
  const navigate = useNavigate();
  const { lang, setLang, darkMode, setDarkMode } = useApp();

  const [holiday, setHoliday] = useState(null);

  useEffect(() => {
    const today = new Date();
    const et = gregorianToEthiopian(today);
    const all = getHolidaysForYear(et.year).map(h => {
      const gd = (() => { try { return ethiopianToGregorian(et.year, h.month, h.day); } catch { return null; } })();
      return { ...h, gDate: gd, eYear: et.year };
    });
    const found = all.find(h => h.key === key);
    setHoliday(found || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [key]);

  const handleSidebarNav = (tabId) => {
    navigate('/', { state: { tab: tabId } });
  };

  const getDaysAway = (gDate) => {
    if (!gDate) return null;
    const now = new Date(); now.setHours(0,0,0,0);
    const d = new Date(gDate); d.setHours(0,0,0,0);
    return Math.round((d - now) / 86400000);
  };

  // ── Layout styles ────────────────────────────────────────────────────────
  const pageBg        = darkMode ? '#0f172a' : '#f9fafb';
  const cardBg        = darkMode ? '#1e293b' : '#ffffff';
  const border        = darkMode ? '#334155' : '#e5e7eb';
  const textPrimary   = darkMode ? '#f1f5f9' : '#111827';
  const textSecondary = darkMode ? '#94a3b8' : '#6b7280';

  if (!holiday) {
    return (
      <div className="app-shell" style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic','Inter',sans-serif" : "'Inter',sans-serif", background: pageBg }}>
        <Sidebar lang={lang} darkMode={darkMode} activeTab="holidays" setActiveTab={handleSidebarNav} />
        <div className="app-main">
          <TopBar lang={lang} setLang={setLang} darkMode={darkMode} setDarkMode={setDarkMode} />
          <div className="page-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: textSecondary }}>
              Loading or Not Found...
              <div style={{ marginTop: 16 }}>
                <button onClick={() => navigate(-1)} style={{ padding: '8px 16px', background: '#16a34a', color: '#fff', borderRadius: 8, border: 'none', fontWeight: 600 }}>
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const meta     = HOLIDAY_META[holiday.key] || {};
  const months   = lang === 'am' ? ET_MONTHS_AM : ET_MONTHS_EN;
  const daysAway = getDaysAway(holiday.gDate);
  const etMonth  = months[holiday.month - 1];

  const gregLabel = holiday.gDate
    ? holiday.gDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  const detailedDesc = DETAILED_DESCRIPTIONS[holiday.key];
  const descAm = detailedDesc?.am || meta.descAm || holiday.descAm;
  const descEn = detailedDesc?.en || meta.descEn || holiday.descEn;

  return (
    <div className="app-shell" style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic','Inter',sans-serif" : "'Inter',sans-serif", background: pageBg }}>
      <Sidebar lang={lang} darkMode={darkMode} activeTab="holidays" setActiveTab={handleSidebarNav} />
      
      <div className="app-main">
        <TopBar lang={lang} setLang={setLang} darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <div className="page-area" style={{ padding: '32px 32px 60px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>

            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'none', border: 'none', padding: 0,
                color: textSecondary, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', marginBottom: 24, transition: 'color 0.15s'
              }}
              onMouseOver={e => e.currentTarget.style.color = textPrimary}
              onMouseOut={e => e.currentTarget.style.color = textSecondary}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              {lang === 'am' ? 'ወደ ኋላ ተመለስ' : 'Back to Holidays'}
            </button>

            {/* Main content card */}
            <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 24, overflow: 'hidden', boxShadow: darkMode ? '0 12px 40px rgba(0,0,0,0.3)' : '0 12px 40px rgba(0,0,0,0.06)' }}>
              
              {/* Hero Image */}
              <div style={{ position: 'relative', height: 320, width: '100%' }}>
                {meta.image ? (
                  <img src={meta.image} alt={holiday.key} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: GRADIENT_FALLBACKS[holiday.key] || '#1a6e35' }} />
                )}
                {/* Gradient overlay to make text pop if we had text overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 40%)' }} />
                
                {/* Days away badge overlay */}
                {daysAway !== null && daysAway >= 0 && daysAway <= 90 && (
                  <div style={{ position: 'absolute', bottom: 20, left: 24 }}>
                    <span style={{
                      background: daysAway === 0 ? '#16a34a' : daysAway <= 7 ? '#f59e0b' : '#374151',
                      color: '#fff', fontSize: 13, fontWeight: 700, padding: '6px 14px', borderRadius: 20,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}>
                      {daysAway === 0 ? '🎉 Today' : daysAway === 1 ? 'Tomorrow' : `In ${daysAway} days`}
                    </span>
                  </div>
                )}
              </div>

              {/* Detail Content */}
              <div style={{ padding: '36px 40px 48px' }}>
                
                {/* Title Row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
                  <div>
                    <h1 style={{ color: textPrimary, fontSize: 32, fontWeight: 800, margin: '0 0 6px', lineHeight: 1.15 }}>
                      {lang === 'am' ? holiday.nameAm.split(' (')[0] : holiday.nameEn.split(' (')[0]}
                    </h1>
                    <div style={{ color: '#16a34a', fontSize: 16, fontWeight: 600 }}>
                      {lang === 'am' ? holiday.nameAm : holiday.nameEn}
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ background: darkMode ? '#334155' : '#f3f4f6', color: textPrimary, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {holiday.movable ? (lang === 'am' ? 'ተንቀሳቃሽ በዓል' : 'Movable Holiday') : (lang === 'am' ? 'ቋሚ በዓል' : 'Fixed Holiday')}
                    </span>
                    {(meta.tags || []).map(t => <TagBadge key={t} tag={t} />)}
                  </div>
                </div>

                {/* Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 36 }}>
                  {/* Ethiopian Date */}
                  <div style={{ background: darkMode ? '#0f172a' : '#f8fafc', padding: '20px 24px', borderRadius: 16, border: `1px solid ${border}` }}>
                    <div style={{ color: textSecondary, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                      🇪🇹 {lang === 'am' ? 'የኢትዮጵያ ቀን' : 'Ethiopian Date'}
                    </div>
                    <div style={{ color: textPrimary, fontSize: 24, fontWeight: 800 }}>
                      {etMonth} {holiday.day}
                    </div>
                    <div style={{ color: textSecondary, fontSize: 14, marginTop: 2 }}>
                      {holiday.eYear} EC
                    </div>
                  </div>

                  {/* Gregorian Date */}
                  <div style={{ background: darkMode ? '#0f172a' : '#f8fafc', padding: '20px 24px', borderRadius: 16, border: `1px solid ${border}` }}>
                    <div style={{ color: textSecondary, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                      🌍 {lang === 'am' ? 'ጎርጎሮሲያን ቀን' : 'Gregorian Date'}
                    </div>
                    <div style={{ color: textPrimary, fontSize: 24, fontWeight: 800 }}>
                      {gregLabel ? gregLabel.split(',')[0] : 'TBD'}
                    </div>
                    <div style={{ color: textSecondary, fontSize: 14, marginTop: 2 }}>
                      {gregLabel ? gregLabel.split(',').slice(1).join(',').trim() : ''}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 style={{ color: textPrimary, fontSize: 18, fontWeight: 700, margin: '0 0 12px' }}>
                    {lang === 'am' ? 'ስለ በዓሉ' : 'About this Holiday'}
                  </h3>
                  <p style={{ color: textSecondary, fontSize: 16, lineHeight: 1.7, margin: 0 }}>
                    {lang === 'am' ? descAm : descEn}
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
