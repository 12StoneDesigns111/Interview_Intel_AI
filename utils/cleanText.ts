export function cleanText(input?: string | null): string {
  if (!input) return '';
  let s = String(input);

  // Remove code fences ```json ... ```
  s = s.replace(/```[\s\S]*?```/g, '');

  // Remove specific inline citation tags and their contents (e.g., <sup>1</sup>)
  s = s.replace(/<sup[^>]*>[\s\S]*?<\/sup>/gi, '');
  // Remove any remaining HTML tags
  s = s.replace(/<[^>]+>/g, '');

  // Remove bracketed citation numbers like [1], [12]
  s = s.replace(/\[\d+\]/g, '');

  // Remove caret-style footnotes like [^1] or [^note]
  s = s.replace(/\[\^[^\]]+\]/g, '');
  // Remove common template-style citation markers like {{cite|...}}
  s = s.replace(/\{\{cite\|[^}]+\}\}/gi, '');

  // Remove standalone superscript-like caret markers ^1^ or ^[1]
  s = s.replace(/\^\d+\^/g, '');

  // Remove standalone parenthetical citation numbers (1), (12)
  s = s.replace(/\(\d+\)/g, '');

  // Collapse excessive whitespace
  s = s.replace(/\s{2,}/g, ' ').trim();

  return s;
}

export default cleanText;
