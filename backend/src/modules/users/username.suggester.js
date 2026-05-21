/**
 * Rules: lowercase, 3–20 chars, ^[a-z0-9_]+$, cannot start or end with _, no consecutive __.
 */
export function sanitizeUsername(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .replace(/^_+|_+$/g, '')
    .replace(/_{2,}/g, '_')
    .slice(0, 20);
}

export function generateSuggestions(desired, takenNames) {
  const sanitized = sanitizeUsername(desired);
  if (!sanitized) return ['poet', 'scribe', 'verse', 'quill', 'muse'];

  const suffixes = ["scribe", "verse", "ink", "quill", "page", "stanza", "muse", "echo", "ember", "prose"];
  const suggestions = new Set();

  // 1. Try sanitized as is if not taken
  if (sanitized.length >= 3 && !takenNames.has(sanitized)) {
    // Should already be handled by the availability check, but good to have
  }

  // 2. desired + 2-digit number
  for (let i = 0; i < 5; i++) {
    const num = Math.floor(Math.random() * 90) + 10;
    const cand = `${sanitized}${num}`.slice(0, 20);
    if (!takenNames.has(cand)) suggestions.add(cand);
    if (suggestions.size >= 5) break;
  }

  // 3. desired_ + suffix
  if (suggestions.size < 5) {
    for (const suffix of suffixes) {
      const cand = `${sanitized}_${suffix}`.slice(0, 20);
      if (!takenNames.has(cand)) suggestions.add(cand);
      if (suggestions.size >= 5) break;
    }
  }

  // 4. desired + 3-digit
  if (suggestions.size < 5) {
    for (let i = 0; i < 5; i++) {
      const num = Math.floor(Math.random() * 900) + 100;
      const cand = `${sanitized}${num}`.slice(0, 20);
      if (!takenNames.has(cand)) suggestions.add(cand);
      if (suggestions.size >= 5) break;
    }
  }

  // 5. fallbacks
  if (suggestions.size < 5) {
    const fallbacks = [`the_${sanitized}`, `${sanitized}_writes`, `${sanitized}_poet`];
    for (const f of fallbacks) {
      const cand = f.slice(0, 20);
      if (!takenNames.has(cand)) suggestions.add(cand);
      if (suggestions.size >= 5) break;
    }
  }

  return Array.from(suggestions).slice(0, 5);
}
