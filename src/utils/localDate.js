const DAY_PARTS = { year: 'numeric', month: '2-digit', day: '2-digit' };

const asDate = (value) => {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** Returns an immutable YYYY-MM-DD local calendar day for a timestamp. */
export const toLocalDay = (value, { timeZone, fallback = null } = {}) => {
  const date = asDate(value);
  if (!date) return fallback;
  try {
    const formatter = new Intl.DateTimeFormat('en-US', { ...DAY_PARTS, ...(timeZone ? { timeZone } : {}) });
    const parts = Object.fromEntries(formatter.formatToParts(date)
      .filter((part) => ['year', 'month', 'day'].includes(part.type))
      .map((part) => [part.type, part.value]));
    return `${parts.year}-${parts.month}-${parts.day}`;
  } catch (_) {
    return fallback;
  }
};

export const hoursBetween = (a, b) => {
  const first = asDate(a);
  const second = asDate(b);
  if (!first || !second) return null;
  return Math.abs(second.getTime() - first.getTime()) / (60 * 60 * 1000);
};

/** Offset at the event instant, not today's offset, so travel/DST cannot rewrite history. */
export const getTimezoneOffsetMinutes = (value, { timeZone } = {}) => {
  const date = asDate(value);
  if (!date) return null;
  if (!timeZone) return -date.getTimezoneOffset();
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
    });
    const parts = Object.fromEntries(formatter.formatToParts(date)
      .filter((part) => ['year', 'month', 'day', 'hour', 'minute', 'second'].includes(part.type))
      .map((part) => [part.type, Number(part.value)]));
    const representedUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    return Math.round((representedUtc - date.getTime()) / 60000);
  } catch (_) {
    return null;
  }
};

export const isAtLeastHoursAfter = (first, second, hours) => {
  const difference = hoursBetween(first, second);
  return difference != null && difference >= hours;
};
