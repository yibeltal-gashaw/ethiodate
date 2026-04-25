import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  gregorianToEthiopian,
  getHolidaysForYear,
  getUpcomingHolidays,
  ethiopianToGregorian,
  ET_MONTHS_EN,
  ET_MONTHS_AM,
} from '../utils/ethiopianCalendar';

// ── Holiday metadata ──────────────────────────────────────────────────────────
const HOLIDAY_META = {
  enkutatash: {
    image: '/holidays/enkutatash.png',
    tags: ['NATIONAL', 'CULTURAL'],
    featured: false,
    category: 'national',
    descEn: 'The Ethiopian New Year. It marks the end of the rainy season and the blooming of the yellow Adey Abeba flowers across the highlands.',
    descAm: 'የኢትዮጵያ አዲስ ዓመት። የዝናብ ወቅት መጨረሻ እና ቢጫ አደይ አበባዎች ከፍታ ቦታዎች ላይ ሲያብቡ የሚከበር ክብረ ዓመት ነው።',
  },
  meskel: {
    image: '/holidays/meskel.png',
    tags: ['RELIGIOUS', 'UNESCO'],
    featured: false,
    category: 'religious',
    descEn: 'Finding of the True Cross. Celebrated with the burning of a large bonfire called "Demera" and traditional dances.',
    descAm: 'ሕይወት ሰጪ ቅዱስ መስቀልን ማግኘት። "ደመራ" ተብሎ የሚጠራ ትልቅ ዕሳት በማቃጠልና በባህላዊ ዘፈን ይከበራል።',
  },
  gena: {
    image: '/holidays/genna.png',
    tags: ['RELIGIOUS', 'LALIBELA'],
    featured: false,
    category: 'religious',
    descEn: 'Ethiopian Christmas. Celebrated after a 43-day fast. Many travel to Lalibela for spectacular ceremonies at the rock-hewn churches.',
    descAm: 'የኢትዮጵያ ልደት። ከ43 ቀናት ጾም በኋላ ይከበራል። ብዙዎች ወደ ላሊበላ ጎጆ ቤተ ክርስቲያናት ያመራሉ።',
  },
  timkat: {
    image: '/holidays/timkat.png',
    tags: ['RELIGIOUS', 'UNESCO'],
    featured: false,
    category: 'religious',
    descEn: 'Epiphany celebration. Commemorates the baptism of Jesus in the Jordan River. Famous for processions carrying "Tabots" to water bodies.',
    descAm: 'የጌታ ጥምቀት ክብረ ዓመት። "ጣቦቶችን" ወደ ወንዝ እና ሀይቅ ቦታዎች ሰልፍ ለማካሄድ ይታወቃል።',
  },
  adwa: {
    image: '/holidays/adwa.png',
    tags: ['NATIONAL', 'HISTORIC'],
    featured: false,
    category: 'national',
    descEn: "Ethiopia's historic victory over Italian colonial forces at the Battle of Adwa on March 1, 1896 — a symbol of African sovereignty.",
    descAm: 'ኢትዮጵያ ከጣሊያን ቅኝ ገዥ ሃይሎች ላይ ያደረገችው ታሪካዊ ድል — የአፍሪካ ሉዓላዊነት ምልክት።',
  },
  laborday: {
    image: null,
    tags: ['NATIONAL', 'PUBLIC HOLIDAY'],
    featured: false,
    category: 'national',
    descEn: "International Workers' Day, celebrated globally on May 1st.",
    descAm: 'ዓለምአቀፍ የሠራተኞች ቀን (ሚያዚያ ፳፫)',
  },
  patriots: {
    image: null,
    tags: ['NATIONAL', 'HISTORIC'],
    featured: false,
    category: 'national',
    descEn: "Celebrates Ethiopia's liberation from Italian occupation on May 5, 1941.",
    descAm: 'ሜይ 5, 1941 ኢትዮጵያ ከጣሊያን ቅኝ ግዛት ነፃ የወጣችበትን ቀን ያከብራል።',
  },
  dergfall: {
    image: null,
    tags: ['NATIONAL', 'PUBLIC HOLIDAY'],
    featured: false,
    category: 'national',
    descEn: 'Commemorates the overthrow of the Derg regime on May 28, 1991 and restoration of democratic governance.',
    descAm: 'ግንቦት 20 ቀን 1983 ዓ.ም የደርግ ሥርዓት ፍጻሜን ያስታውሳል።',
  },
  fasika: {
    image: '/holidays/fasika.png',
    tags: ['RELIGIOUS', 'MAJOR EVENT'],
    featured: true,
    category: 'religious',
    descEn: 'Ethiopian Easter. Preceded by an intense 55-day fast, this is the most important religious holiday in the Ethiopian Orthodox Tewahedo Church, characterized by midnight masses and grand family feasts.',
    descAm: 'ኢትዮጵያ ፋሲካ። ጥልቅ የ55 ቀናት ጾም ተቀድሞ፣ ይህ በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ውስጥ ዋናው ሃይማኖታዊ ክብረ-ዓመት ሲሆን፣ በምሽት ቅዳሴ እና ትልቅ የቤተሰብ ድግስ ይታወቃል።',
  },
  seklet: {
    image: null,
    tags: ['RELIGIOUS'],
    featured: false,
    category: 'religious',
    descEn: 'Good Friday — commemorating the crucifixion of Jesus Christ.',
    descAm: 'ስቅለት — የጌታ ስቅለት ዕለት',
  },
  hosanna: {
    image: null,
    tags: ['RELIGIOUS'],
    featured: false,
    category: 'religious',
    descEn: "Palm Sunday — commemorating Jesus's triumphal entry into Jerusalem.",
    descAm: 'ሆሳዕና — ጌታ ወደ ኢየሩሳሌም ሲገቡ ያከበሩት ዕለት',
  },
};

const GRADIENT_FALLBACKS = {
  enkutatash: 'linear-gradient(135deg, #84cc16, #22c55e)',
  meskel:     'linear-gradient(135deg, #f97316, #ef4444)',
  gena:       'linear-gradient(135deg, #6366f1, #8b5cf6)',
  timkat:     'linear-gradient(135deg, #3b82f6, #06b6d4)',
  adwa:       'linear-gradient(135deg, #f59e0b, #ef4444)',
  laborday:   'linear-gradient(135deg, #14b8a6, #3b82f6)',
  patriots:   'linear-gradient(135deg, #f59e0b, #84cc16)',
  dergfall:   'linear-gradient(135deg, #8b5cf6, #3b82f6)',
  fasika:     'linear-gradient(135deg, #f97316, #f59e0b)',
  seklet:     'linear-gradient(135deg, #6b7280, #374151)',
  hosanna:    'linear-gradient(135deg, #84cc16, #22c55e)',
};

const TAG_STYLES = {
  'RELIGIOUS':     { bg: '#dcfce7', color: '#16a34a' },
  'NATIONAL':      { bg: '#dbeafe', color: '#1d4ed8' },
  'CULTURAL':      { bg: '#fef9c3', color: '#a16207' },
  'UNESCO':        { bg: '#f3e8ff', color: '#7c3aed' },
  'LALIBELA':      { bg: '#fee2e2', color: '#b91c1c' },
  'HISTORIC':      { bg: '#ffedd5', color: '#c2410c' },
  'MAJOR EVENT':   { bg: '#f0fdf4', color: '#15803d', border: '1px solid #22c55e' },
  'PUBLIC HOLIDAY':{ bg: '#eff6ff', color: '#1d4ed8' },
};

function TagBadge({ tag }) {
  const s = TAG_STYLES[tag] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.05em',
      background: s.bg,
      color: s.color,
      border: s.border || 'none',
    }}>
      {tag}
    </span>
  );
}

// ── Two-column compact card ────────────────────────────────────────────────────
function HolidayGridCard({ holiday, lang, darkMode, daysAway }) {
  const meta    = HOLIDAY_META[holiday.key] || {};
  const months  = lang === 'am' ? ET_MONTHS_AM : ET_MONTHS_EN;
  const gDate   = holiday.gDate;
  const bg      = darkMode ? '#1e293b' : '#ffffff';
  const border  = darkMode ? '#334155' : '#f0f0f0';
  const textPrimary   = darkMode ? '#f1f5f9' : '#111827';
  const textSecondary = darkMode ? '#94a3b8' : '#6b7280';
  const divider = darkMode ? '#334155' : '#f3f4f6';

  const gregLabel = gDate
    ? gDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;
  const gregYear = gDate ? gDate.getFullYear() : null;
  const etMonthLabel = months[holiday.month - 1];

  return (
    <Link
      to={`/holidays/${holiday.key}`}
      className="holiday-explorer-card"
      style={{ background: bg, border: `1px solid ${border}`, textDecoration: 'none', display: 'block', borderRadius: 16, overflow: 'hidden', transition: 'transform 0.15s, box-shadow 0.15s' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
        {meta.image ? (
          <img
            src={meta.image}
            alt={holiday.key}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: GRADIENT_FALLBACKS[holiday.key] || '#1a6e35' }} />
        )}
        {/* Fixed/Movable badge */}
        <span style={{
          position: 'absolute', top: 12, right: 12,
          background: darkMode ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.92)',
          color: darkMode ? '#f1f5f9' : '#111827',
          fontSize: 12, fontWeight: 600,
          padding: '4px 12px', borderRadius: 20,
          backdropFilter: 'blur(4px)',
        }}>
          {holiday.movable ? (lang === 'am' ? 'ተንቀሳቃሽ' : 'Movable') : (lang === 'am' ? 'ቋሚ' : 'Fixed')}
        </span>
        {/* Days away badge */}
        {daysAway !== null && daysAway >= 0 && daysAway <= 90 && (
          <span style={{
            position: 'absolute', top: 12, left: 12,
            background: daysAway === 0 ? '#16a34a' : daysAway <= 7 ? '#f59e0b' : '#374151',
            color: '#fff',
            fontSize: 11, fontWeight: 700,
            padding: '4px 10px', borderRadius: 20,
          }}>
            {daysAway === 0 ? '🎉 Today' : daysAway === 1 ? 'Tomorrow' : `In ${daysAway}d`}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '18px 20px' }}>
        {/* Name row + date */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
          <div>
            <h3 style={{ color: textPrimary, fontWeight: 700, fontSize: 17, margin: 0, lineHeight: 1.2 }}>
              {lang === 'am' ? holiday.nameAm.split(' (')[0] : holiday.nameEn.split(' (')[0]}
            </h3>
            <div style={{ color: '#16a34a', fontSize: 12, fontFamily: "'Noto Sans Ethiopic', sans-serif", marginTop: 2 }}>
              {lang === 'am' ? holiday.nameAm.split('(')[1]?.replace(')', '') ?? '' : ''}
            </div>
          </div>
          {gregLabel && (
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ color: textPrimary, fontWeight: 700, fontSize: 15 }}>{gregLabel}</div>
              <div style={{ color: textSecondary, fontSize: 11, marginTop: 1 }}>{etMonthLabel} {holiday.day}</div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${divider}`, margin: '10px 0' }} />

        {/* Description */}
        <p style={{ color: textSecondary, fontSize: 13, lineHeight: 1.6, margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {lang === 'am' ? meta.descAm : meta.descEn}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(meta.tags || []).map(t => <TagBadge key={t} tag={t} />)}
        </div>
      </div>
    </Link>
  );
}

// ── Wide featured card (for movable/major holidays) ───────────────────────────
function HolidayFeaturedCard({ holiday, lang, darkMode, daysAway }) {
  const meta    = HOLIDAY_META[holiday.key] || {};
  const months  = lang === 'am' ? ET_MONTHS_AM : ET_MONTHS_EN;
  const gDate   = holiday.gDate;
  const bg      = darkMode ? '#1e293b' : '#ffffff';
  const border  = darkMode ? '#334155' : '#f0f0f0';
  const textPrimary   = darkMode ? '#f1f5f9' : '#111827';
  const textSecondary = darkMode ? '#94a3b8' : '#6b7280';

  const gregLabel = gDate
    ? gDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;
  const etMonthLabel = months[holiday.month - 1];

  return (
    <Link
      to={`/holidays/${holiday.key}`}
      className="holiday-explorer-featured"
      style={{ background: bg, border: `1px solid ${border}`, textDecoration: 'none', display: 'flex', borderRadius: 16, overflow: 'hidden', transition: 'transform 0.15s, box-shadow 0.15s', minHeight: 220 }}
    >
      {/* Image (left, fixed width) */}
      <div style={{ position: 'relative', width: 240, minWidth: 220, flexShrink: 0, overflow: 'hidden' }}>
        {meta.image ? (
          <img src={meta.image} alt={holiday.key} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: GRADIENT_FALLBACKS[holiday.key] || '#1a6e35' }} />
        )}
        {/* Movable badge */}
        <span style={{
          position: 'absolute', top: 12, left: 12,
          background: '#f59e0b', color: '#fff',
          fontSize: 12, fontWeight: 700,
          padding: '4px 12px', borderRadius: 20,
        }}>
          {lang === 'am' ? 'ተንቀሳቃሽ' : 'Movable'}
        </span>
      </div>

      {/* Content (right) */}
      <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
        {/* Name + date */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
          <div>
            <h3 style={{ color: textPrimary, fontWeight: 800, fontSize: 22, margin: 0 }}>
              {lang === 'am' ? holiday.nameAm.split(' (')[0] : holiday.nameEn.split(' (')[0]}
            </h3>
            <div style={{ color: '#16a34a', fontSize: 13, fontFamily: "'Noto Sans Ethiopic', sans-serif", marginTop: 2 }}>
              {lang === 'am' ? holiday.nameAm : holiday.nameEn}
            </div>
          </div>
          {gregLabel && (
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ color: textPrimary, fontWeight: 700, fontSize: 16 }}>{gregLabel}</div>
              <div style={{ color: textSecondary, fontSize: 12, marginTop: 2 }}>{etMonthLabel} {holiday.day}</div>
            </div>
          )}
        </div>

        {/* Description */}
        <p style={{ color: textSecondary, fontSize: 14, lineHeight: 1.7, margin: '0 0 14px', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {lang === 'am' ? meta.descAm : meta.descEn}
        </p>

        {/* Tags + days */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {daysAway !== null && daysAway >= 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#dcfce7', color: '#16a34a', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>
              <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#16a34a' }} />
              {daysAway === 0 ? (lang === 'am' ? 'ዛሬ 🎉' : 'Today 🎉')
               : daysAway === 1 ? (lang === 'am' ? 'ነገ' : 'Tomorrow')
               : `${daysAway} days away`}
            </span>
          )}
          {(meta.tags || []).map(t => <TagBadge key={t} tag={t} />)}
        </div>
      </div>
    </Link>
  );
}

// ── Main HolidaysPage ─────────────────────────────────────────────────────────
export default function HolidaysPage({ lang, darkMode }) {
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('all');
  const [holidays, setHolidays] = useState([]);

  const bg          = darkMode ? '#0f172a' : '#f9fafb';
  const textPrimary = darkMode ? '#f1f5f9' : '#111827';
  const textSecondary = darkMode ? '#94a3b8' : '#6b7280';
  const cardBg      = darkMode ? '#1e293b' : '#ffffff';
  const inputBorder = darkMode ? '#334155' : '#e5e7eb';
  const inputBg     = darkMode ? '#1e293b' : '#ffffff';

  useEffect(() => {
    const today = new Date();
    const et = gregorianToEthiopian(today);
    const all = getHolidaysForYear(et.year).map(h => ({
      ...h,
      gDate: (() => { try { return ethiopianToGregorian(h.eYear || et.year, h.month, h.day); } catch { return null; } })(),
      eYear: et.year,
    }));
    all.sort((a, b) => a.month - b.month || a.day - b.day);
    setHolidays(all);
  }, []);

  const getDaysAway = (gDate) => {
    if (!gDate) return null;
    const now = new Date(); now.setHours(0,0,0,0);
    const d = new Date(gDate); d.setHours(0,0,0,0);
    return Math.round((d - now) / 86400000);
  };

  const filtered = useMemo(() => {
    return holidays.filter(h => {
      const meta = HOLIDAY_META[h.key] || {};
      const name = lang === 'am' ? h.nameAm : h.nameEn;
      const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || meta.category === filter;
      return matchSearch && matchFilter;
    });
  }, [holidays, search, filter, lang]);

  // Group into render rows: featured cards full-width, others in 2-col grid pairs
  const renderRows = useMemo(() => {
    const rows = [];
    let pending = [];
    filtered.forEach(h => {
      const meta = HOLIDAY_META[h.key] || {};
      if (meta.featured) {
        if (pending.length) { rows.push({ type: 'grid', items: [...pending] }); pending = []; }
        rows.push({ type: 'featured', item: h });
      } else {
        pending.push(h);
        if (pending.length === 2) { rows.push({ type: 'grid', items: [...pending] }); pending = []; }
      }
    });
    if (pending.length) rows.push({ type: 'grid', items: [...pending] });
    return rows;
  }, [filtered]);

  const FILTER_LABELS = {
    all:      lang === 'am' ? 'ሁሉም' : 'All',
    religious: lang === 'am' ? 'ሃይማኖታዊ' : 'Religious',
    national:  lang === 'am' ? 'ሀገራዊ' : 'National',
  };

  return (
    <div style={{ background: bg, minHeight: '100vh' }}>
      <div style={{ padding: '28px 28px 40px', maxWidth: 1000 }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ color: textPrimary, fontSize: 26, fontWeight: 800, margin: 0 }}>
            {lang === 'am' ? 'የበዓላት መዳሰሻ' : 'Holiday Explorer'}
          </h1>
          <p style={{ color: textSecondary, fontSize: 14, marginTop: 4 }}>
            {lang === 'am'
              ? 'የኢትዮጵያን ባህላዊ፣ ሃይማኖታዊ እና ሀገራዊ በዓላትን ያስሱ።'
              : 'Explore cultural, religious, and national holidays in Ethiopia.'}
          </p>
        </div>

        {/* ── Search + Filter ── */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: inputBg, border: `1px solid ${inputBorder}`,
            borderRadius: 12, padding: '0 16px', height: 44, flex: 1, maxWidth: 400,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={darkMode ? '#64748b' : '#9ca3af'} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder={lang === 'am' ? 'ስሙን ይፈልጉ...' : 'Search holidays by name...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: textPrimary }}
            />
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'religious', 'national'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 18px', borderRadius: 20,
                  border: filter === f ? '2px solid #16a34a' : `1px solid ${inputBorder}`,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  background: filter === f ? '#16a34a' : (darkMode ? '#1e293b' : '#ffffff'),
                  color: filter === f ? '#fff' : textSecondary,
                  transition: 'all 0.15s',
                  fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : 'inherit',
                }}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {/* ── Holiday grid ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: textSecondary, fontSize: 15 }}>
            {lang === 'am' ? 'ምንም በዓል አልተገኘም።' : 'No holidays found.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {renderRows.map((row, ri) => {
              if (row.type === 'featured') {
                const days = getDaysAway(row.item.gDate);
                return (
                  <HolidayFeaturedCard
                    key={row.item.key + ri}
                    holiday={row.item}
                    lang={lang}
                    darkMode={darkMode}
                    daysAway={days}
                  />
                );
              }
              return (
                <div key={ri} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                  {row.items.map(h => (
                    <HolidayGridCard
                      key={h.key}
                      holiday={h}
                      lang={lang}
                      darkMode={darkMode}
                      daysAway={getDaysAway(h.gDate)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
