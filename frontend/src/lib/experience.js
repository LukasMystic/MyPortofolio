// Most recent role first; "Now" sorts to the top, undated roles to the bottom.
const parseEndDate = (range = '') => {
  if (/now|present/i.test(range)) return Number.MAX_SAFE_INTEGER;
  const parts = range.split(/\s[-–]\s|-/).map((s) => s.trim());
  const d = Date.parse(parts[parts.length - 1] || '');
  return Number.isNaN(d) ? 0 : d;
};

export const sortExperiences = (list = []) =>
  list.slice().sort((a, b) => parseEndDate(b.dateRange) - parseEndDate(a.dateRange));

