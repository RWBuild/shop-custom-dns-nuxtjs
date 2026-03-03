import DOMPurify from 'dompurify';

export default defineNuxtPlugin(() => {
  // Make DOMPurify available globally on client
  if (typeof window !== 'undefined') {
    (window as Window & { DOMPurify?: typeof DOMPurify }).DOMPurify = DOMPurify;
  }
});
