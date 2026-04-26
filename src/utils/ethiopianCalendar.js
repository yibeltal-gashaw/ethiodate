/**
 * Ethiopian Calendar Utility
 * Handles Gregorian ↔ Ethiopian date conversions,
 * holiday data, and Amharic/English localization.
 */

// ─── Ethiopian Calendar Epoch ────────────────────────────────────────────────
import { FIXED_HOLIDAYS } from '../data/holidaysData';

// Ethiopian calendar is ~7–8 years behind Gregorian (Julian offset)
// Ethiopian year starts on Meskerem 1 = Sept 11 (or Sept 12 in Gregorian leap year eve)

export const ET_MONTHS_EN = [
  'Meskerem', 'Tikimt', 'Hidar', 'Tahsas',
  'Tir', 'Yekatit', 'Megabit', 'Miazia',
  'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
];

export const ET_MONTHS_AM = [
  'መስከረም', 'ጥቅምት', 'ህዳር', 'ታህሳስ',
  'ጥር', 'የካቲት', 'መጋቢት', 'ሚያዚያ',
  'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'
];

export const ET_DAYS_EN = [
  'Ehud', 'Segno', 'Maksegno', 'Rob', 'Hamus', 'Arb', 'Kidame'
];

export const ET_DAYS_AM = [
  'እሁድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'አርብ', 'ቅዳሜ'
];

// ─── Conversion Core ─────────────────────────────────────────────────────────

/**
 * Convert a Gregorian Date object to Ethiopian date.
 * Returns { year, month (1-13), day }
 */
export function gregorianToEthiopian(gDate) {
  const GY = gDate.getFullYear();
  const GM = gDate.getMonth() + 1; // JS month is 0-indexed
  const GD = gDate.getDate();

  // Julian Day Number from Gregorian
  const jdn = gregorianToJDN(GY, GM, GD);

  return jdnToEthiopian(jdn);
}

/**
 * Convert Ethiopian date { year, month, day } to a Gregorian Date object.
 */
export function ethiopianToGregorian(eYear, eMonth, eDay) {
  const jdn = ethiopianToJDN(eYear, eMonth, eDay);
  return jdnToGregorian(jdn);
}

// ─── JDN Helpers ─────────────────────────────────────────────────────────────

function gregorianToJDN(year, month, day) {
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function jdnToEthiopian(jdn) {
  let r = jdn - 1723856;
  let n = r % 1461;
  let year = Math.floor(r / 1461) * 4 + Math.floor(n / 365);
  let dayOfYear = n % 365;
  if (n === 1460) {
    year -= 1;
    dayOfYear = 365;
  }
  let month = Math.floor(dayOfYear / 30) + 1;
  let day = (dayOfYear % 30) + 1;
  return { year, month, day };
}

function ethiopianToJDN(year, month, day) {
  return 1723856 + 365 * year + Math.floor(year / 4) + 30 * (month - 1) + day - 1;
}

function jdnToGregorian(jdn) {
  let a = jdn + 32044;
  let b = Math.floor((4 * a + 3) / 146097);
  let c = a - Math.floor((146097 * b) / 4);
  let d = Math.floor((4 * c + 3) / 1461);
  let e = c - Math.floor((1461 * d) / 4);
  let m = Math.floor((5 * e + 2) / 153);
  let day = e - Math.floor((153 * m + 2) / 5) + 1;
  let month = m + 3 - 12 * Math.floor(m / 10);
  let year = b * 100 + d - 4800 + Math.floor(m / 10);
  return new Date(year, month - 1, day);
}

// ─── Ethiopian Day of Week ────────────────────────────────────────────────────

/**
 * Get the Ethiopian day name index (0=Sunday) for a Gregorian Date.
 */
export function getEthiopianDayOfWeek(gDate) {
  return gDate.getDay(); // Ethiopians use same 7-day week
}

// ─── Ethiopian Month Days ────────────────────────────────────────────────────

/**
 * Returns number of days in an Ethiopian month.
 * Months 1–12 = 30 days; Month 13 (Pagume) = 5 or 6 (leap).
 */
export function daysInEthiopianMonth(eYear, eMonth) {
  if (eMonth <= 12) return 30;
  // Pagume: 6 days if (eYear + 1) % 4 === 3
  return (eYear + 1) % 4 === 3 ? 6 : 5;
}

/**
 * Returns true if the Ethiopian year is a leap year.
 */
export function isEthiopianLeapYear(eYear) {
  return (eYear + 1) % 4 === 3;
}

// ─── Get first day of Ethiopian month ────────────────────────────────────────

/**
 * Returns the Gregorian Date object for Meskerem 1 of the given Ethiopian year.
 */
export function getEthiopianMonthStart(eYear, eMonth) {
  return ethiopianToGregorian(eYear, eMonth, 1);
}

// ─── Ethiopian Holidays ───────────────────────────────────────────────────────
// Fixed holidays are in Ethiopian calendar (month, day).
// Movable holidays are calculated based on Ethiopian Easter (Fasika).

/**
 * Calculate Ethiopian Easter (Fasika) for a given Ethiopian year.
 * Uses the Metonic cycle adapted for the Julian calendar.
 * Returns { month, day } in Ethiopian calendar.
 */
export function calculateFasika(eYear) {
  const r = eYear % 19; // Metonic cycle remainder
  // Fasika base is Megabit (month 7) with adjustment
  const fasikaDayOfYear = (r * 19 + 29) % 30;
  // Fasika falls in Miazia (month 8) typically
  // More accurate: use Julian Easter and convert
  // We'll use the known offset: Ethiopian Fasika = Julian Easter
  // Julian Easter computation (Meeus algorithm for Julian)
  const gYear = eYear + 7; // approximate Gregorian year
  const a = gYear % 4;
  const b = gYear % 7;
  const c = gYear % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31); // 3=March, 4=April
  const day = ((d + e + 114) % 31) + 1;

  // Julian date to Gregorian (add 13 days for 20th/21st century)
  const julianDate = new Date(gYear, month - 1, day + 13);

  // Convert to Ethiopian
  return gregorianToEthiopian(julianDate);
}

/**
 * Returns a list of all holidays for a given Ethiopian year,
 * including movable ones calculated from Fasika.
 */
export function getHolidaysForYear(eYear) {
  const fasika = calculateFasika(eYear);
  const fasikaJDN = ethiopianToJDN(fasika.year, fasika.month, fasika.day);

  const movable = [
    {
      key: 'fasika',
      jdnOffset: 0,
      nameEn: 'Fasika (Ethiopian Easter)',
      nameAm: 'ፋሲካ',
      descEn: 'Ethiopian Orthodox Easter — the most significant religious celebration.',
      descAm: 'የኢትዮጵያ ኦርቶዶክስ ትንሳኤ ፋሲካ'
    },
    {
      key: 'seklet',
      jdnOffset: -2,
      nameEn: 'Seklet (Good Friday)',
      nameAm: 'ስቅለት',
      descEn: 'Good Friday — commemorating the crucifixion of Jesus Christ.',
      descAm: 'የጌታ ስቅለት ዕለት'
    },
    {
      key: 'hosanna',
      jdnOffset: -7,
      nameEn: 'Hosanna (Palm Sunday)',
      nameAm: 'ሆሳዕና',
      descEn: 'Palm Sunday — commemorating Jesus\'s triumphal entry into Jerusalem.',
      descAm: 'ሆሳዕና — ጌታ ወደ ኢየሩሳሌም ሲገቡ ያከበሩት ዕለት'
    },
  ];

  const holidays = [...FIXED_HOLIDAYS.map(h => ({ ...h, eYear, movable: false }))];

  for (const mv of movable) {
    const mvJDN = fasikaJDN + mv.jdnOffset;
    const et = jdnToEthiopian(mvJDN);
    holidays.push({ ...mv, month: et.month, day: et.day, eYear, movable: true });
  }

  return holidays;
}

/**
 * Find a holiday on a specific Ethiopian date, if any.
 */
export function getHolidayOnDate(eYear, eMonth, eDay) {
  const holidays = getHolidaysForYear(eYear);
  return holidays.find(h => h.month === eMonth && h.day === eDay) || null;
}

/**
 * Get upcoming holidays from today (Gregorian) within the next N days.
 */
export function getUpcomingHolidays(gDate, count = 5) {
  const today = gregorianToEthiopian(gDate);
  const holidays = getHolidaysForYear(today.year);
  const nextYear = getHolidaysForYear(today.year + 1);

  const allHolidays = [...holidays, ...nextYear].map(h => {
    const gDate = ethiopianToGregorian(h.eYear || today.year, h.month, h.day);
    return { ...h, gDate };
  });

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return allHolidays
    .filter(h => h.gDate >= now)
    .sort((a, b) => a.gDate - b.gDate)
    .slice(0, count);
}

// ─── Formatting Helpers ──────────────────────────────────────────────────────

export function formatEthiopianDate(eYear, eMonth, eDay, lang = 'en') {
  const months = lang === 'am' ? ET_MONTHS_AM : ET_MONTHS_EN;
  return `${months[eMonth - 1]} ${eDay}, ${eYear}`;
}

export function formatGregorianDate(gDate, lang = 'en') {
  return gDate.toLocaleDateString(lang === 'am' ? 'am-ET' : 'en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

/**
 * Get day name for a Gregorian Date in Ethiopian day names.
 */
export function getEthDayName(gDate, lang = 'en') {
  const dow = gDate.getDay(); // 0=Sun
  return lang === 'am' ? ET_DAYS_AM[dow] : ET_DAYS_EN[dow];
}

/**
 * Get all days in a given Ethiopian month as an array of
 * { eYear, eMonth, eDay, gDate, dayOfWeek } objects.
 */
export function getEthiopianMonthDays(eYear, eMonth) {
  const totalDays = daysInEthiopianMonth(eYear, eMonth);
  const days = [];
  for (let d = 1; d <= totalDays; d++) {
    const gDate = ethiopianToGregorian(eYear, eMonth, d);
    days.push({ eYear, eMonth, eDay: d, gDate, dayOfWeek: gDate.getDay() });
  }
  return days;
}

/**
 * Given a Gregorian Date, returns its Ethiopian calendar page info:
 * which eYear, eMonth so we can show the correct calendar page.
 */
export function getCurrentEthiopianPage(gDate) {
  const et = gregorianToEthiopian(gDate);
  return { eYear: et.year, eMonth: et.month };
}
