import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export function useSanitize() {
  const sanitizeHtml = (html: string | undefined | null): string => {
    if (!html) return '';
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
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
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    });
  };

  return { sanitizeHtml };
}
