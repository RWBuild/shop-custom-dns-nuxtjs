const ALLOWED_TAGS = [
  'p',
  'br',
  'b',
  'i',
  'em',
  'strong',
  'a',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'span',
  'div',
];

const ALLOWED_ATTR = ['href', 'target', 'rel', 'class'];

function sanitizeServerSide(html: string): string {
  const allowedPattern = ALLOWED_TAGS.join('|');

  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  sanitized = sanitized.replace(/href\s*=\s*["']?\s*javascript:[^"'\s>]*/gi, 'href="#"');


  const disallowedTagPattern = new RegExp(
    `<(?!\/?(?:${allowedPattern})\\b)[^>]*>`,
    'gi'
  );
  sanitized = sanitized.replace(disallowedTagPattern, '');


  const attrPattern = new RegExp(
    `(<(?:${allowedPattern})\\b)([^>]*)(>)`,
    'gi'
  );
  sanitized = sanitized.replace(attrPattern, (match, tagStart, attrs, tagEnd) => {
    if (!attrs.trim()) return tagStart + tagEnd;

    const cleanedAttrs = ALLOWED_ATTR.map((attr) => {
      const attrMatch = attrs.match(new RegExp(`${attr}\\s*=\\s*["']([^"']*)["']`, 'i'));
      return attrMatch ? ` ${attr}="${attrMatch[1]}"` : '';
    }).join('');

    return tagStart + cleanedAttrs + tagEnd;
  });

  return sanitized;
}

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Uses DOMPurify on client, regex-based sanitization on server
 */
export function useSanitize() {
  const sanitizeHtml = (html: string | undefined | null): string => {
    if (!html) return '';

 
    if (import.meta.server) {
      return sanitizeServerSide(html);
    }

  
    if (import.meta.client && typeof window !== 'undefined') {
      const DOMPurify = (window as Window & { DOMPurify?: typeof import('dompurify').default })
        .DOMPurify;
      if (DOMPurify) {
        return DOMPurify.sanitize(html, {
          ALLOWED_TAGS,
          ALLOWED_ATTR,
        });
      }
    }

    return sanitizeServerSide(html);
  };

  return { sanitizeHtml };
}
