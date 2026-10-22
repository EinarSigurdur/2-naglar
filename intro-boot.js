
// Set before first paint; a fail-open timer protects against missing scripts.
try {
 if (!matchMedia('(prefers-reduced-motion: reduce)').matches && !sessionStorage.getItem('naglar-intro-seen') && (!location.hash || location.hash === '#heim') && performance.getEntriesByType('navigation')[0]?.type !== 'back_forward') {
  document.documentElement.classList.add('intro-pending');
  window.naglarIntroFallback = setTimeout(() => document.documentElement.classList.remove('intro-pending','intro-playing'), 3900);
 }
} catch {}
