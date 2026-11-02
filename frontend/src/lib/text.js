// Strip CMS HTML down to a plain sentence (for previews and meta descriptions).
export const plainText = (html = '') =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

// Turn the CMS "About" text (plain text with "- " lines) into blocks, so it can
// be shown without bullet points: a heading with its items run together on one
// line, or a plain paragraph.
export const aboutBlocks = (raw = '') => {
  const text = plainTextKeepLines(raw);
  const blocks = [];
  let current = null;
  text.split('\n').forEach((line) => {
    const t = line.trim();
    if (!t) {
      current = null;
      return;
    }
    if (/^[-•–]\s+/.test(t)) {
      const item = t.replace(/^[-•–]\s+/, '').replace(/\.$/, '');
      if (current && current.items) current.items.push(item);
      else blocks.push((current = { heading: null, items: [item] }));
      return;
    }
    // A short line followed by items is a heading; anything else is prose.
    current = { heading: t, items: [] };
    blocks.push(current);
  });
  return blocks.map((b) => (b.items.length ? b : { text: b.heading }));
};

const plainTextKeepLines = (html) =>
  html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h\d)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&rsquo;/g, '’');
