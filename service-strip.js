// One gentle entrance; no hidden content before JS and no scroll interception.
(() => {
 const strip = document.querySelector('.craft-strip');
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 if (!strip || motion.matches || !('IntersectionObserver' in window) || !strip.animate) return;
 let animation;
 const finish = () => { observer.disconnect(); animation?.cancel(); };
 const observer = new IntersectionObserver(entries => {
  if (!entries.some(entry => entry.isIntersecting)) return;
  observer.disconnect();
  if (motion.matches) return;
  animation = strip.animate([{opacity:.6,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'cubic-bezier(.22,1,.36,1)'});
 }, {threshold:.15});
 observer.observe(strip);
 motion.addEventListener('change',finish,{once:true});
 window.addEventListener('pagehide',finish,{once:true});
})();
