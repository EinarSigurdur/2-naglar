const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const services = [...document.querySelectorAll('.service')];
const serviceImage = document.querySelector('#service-image');
let imageVersion = 0;
async function selectImage(key) {
 const media = window.naglarMedia?.[key];
 if (!media || !serviceImage) return;
 const version = ++imageVersion;
 const src = `assets/${media.file}-1200.webp`;
 const next = new Image(); next.src = src;
 try { await next.decode(); } catch { return; }
 if (version !== imageVersion) return;
 serviceImage.classList.add('switching');
 setTimeout(() => {
  if (version !== imageVersion) return;
  serviceImage.srcset = `assets/${media.file}-640.webp 640w, ${src} ${media.file === "window-installation" ? 720 : 1200}w`;
  serviceImage.src = src; serviceImage.alt = media.alt;
  serviceImage.style.objectPosition = media.position;
  serviceImage.classList.toggle('real-work', !!media.real);
  document.querySelector('#service-credit').textContent = media.credit;
  document.querySelector('#service-credit').hidden = !media.credit; 
  
  serviceImage.classList.remove('switching');
 }, reducedMotion.matches ? 0 : 150);
}
services.forEach(service => {
 service.addEventListener('toggle', () => {
  if (!service.open) return;
  services.forEach(other => { if (other !== service) other.open = false; });
  selectImage(service.dataset.image);
 });
});
const more = document.querySelector('.more-projects');
more?.addEventListener('toggle', () => {
 more.querySelector('.more-label').textContent = more.open ? 'Færri verkefni' : 'Fleiri verkefni';
});
// Only update visible photographs; native scrolling and anchor navigation stay intact.
const scenes = [...document.querySelectorAll('.hero-photo, .material-banner')];
const visible = new Set(); let frame = 0;
function updatePhotos() {
 frame = 0;
 scenes.forEach(scene => {
  const img = scene.querySelector('img');
  if (reducedMotion.matches || innerWidth < 701) { img.style.transform = ''; return; }
  if (!visible.has(scene)) return;
  const box = scene.getBoundingClientRect();
  const progress = (innerHeight / 2 - (box.top + box.height / 2)) / innerHeight;
  img.style.transform = `translateY(${Math.max(-24, Math.min(24, progress * 26))}px)`;
 });
}
function schedulePhotos() { if (!frame) frame = requestAnimationFrame(updatePhotos); }
if ('IntersectionObserver' in window) {
 const observer = new IntersectionObserver(entries => { entries.forEach(e => e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)); schedulePhotos(); });
 scenes.forEach(scene => observer.observe(scene));
 window.addEventListener('scroll', schedulePhotos, {passive:true});
 window.addEventListener('resize', schedulePhotos);
 reducedMotion.addEventListener('change', schedulePhotos);
}
// Public static hosting: compose locally; no submission or delivery is claimed.
const form = document.querySelector('form[name="fyrirspurn"]');
form?.addEventListener('submit', event => {
 event.preventDefault();
 const data = new FormData(form);
 const href = 'mailto:2naglarehf@gmail.com?subject=' + encodeURIComponent('Fyrirspurn frá ' + data.get('name')) + '&body=' + encodeURIComponent(`${data.get('message')}\n\n${data.get('name')}\n${data.get('email')}\n${data.get('phone')}`);
 const status = form.querySelector('.form-status');
 status.textContent = 'Sendu fyrirspurnina úr tölvupóstforritinu þínu. Ef það opnast ekki: ';
 const link = document.createElement('a'); link.href = href; link.textContent = 'Opna tölvupóst'; status.append(link);
 location.href = href;
});
// Keep browser validation messages in the same language as the page.
form?.querySelectorAll('input:not([type=hidden]), textarea').forEach(field => {
 field.addEventListener('input', () => field.setCustomValidity(''));
 field.addEventListener('invalid', () => {
  if (field.validity.valueMissing) field.setCustomValidity('Vinsamlegast fylltu út þennan reit.');
  else if (field.validity.typeMismatch) field.setCustomValidity('Vinsamlegast sláðu inn gilt netfang.');
  else if (field.validity.tooShort) field.setCustomValidity('Lýstu verkefninu í að minnsta kosti 10 stöfum.');
 });
});

// Footer entrance: progressive enhancement, once, without affecting layout.
(() => {
 const footer = document.querySelector('#samband');
 if (!footer || reducedMotion.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
 const animations = [];
 const observer = new IntersectionObserver(entries => {
  if (!entries.some(entry => entry.isIntersecting)) return;
  observer.disconnect();
  if (reducedMotion.matches || footer.contains(document.activeElement)) return;
  [footer.querySelector('#contact-title'), footer.querySelector('form')].forEach((element, index) => {
   animations.push(element.animate([
    { opacity: 0, transform: 'translateY(12px)' },
    { opacity: 1, transform: 'translateY(0)' }
   ], { duration: 560, delay: index * 90, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }));
  });
 }, { threshold: 0, rootMargin: '0px 0px -30px 0px' });
 observer.observe(footer.querySelector('.contact-layout'));
 const finish = () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); };
 footer.addEventListener('focusin', finish, { once: true });
 reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) finish(); });
 window.addEventListener('pagehide', finish, { once: true });
})();

// A usable alternative when no email application is configured.
const copyInquiry = form?.querySelector('.copy-inquiry');
if (copyInquiry && navigator.clipboard?.writeText) {
 copyInquiry.hidden = false;
 copyInquiry.addEventListener('click', async () => {
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const text = `Til: 2naglarehf@gmail.com\nEfni: Fyrirspurn frá ${data.get('name')}\n\n${data.get('message')}\n\n${data.get('name')}\n${data.get('email')}\n${data.get('phone')}`;
  try {
   await navigator.clipboard.writeText(text);
   form.querySelector('.form-status').textContent = 'Fyrirspurnin hefur verið afrituð. Límdu hana í tölvupóst og sendu á 2naglarehf@gmail.com.';
  } catch {
   form.querySelector('.form-status').textContent = 'Ekki tókst að afrita. Þú getur valið textann í reitunum og afritað hann handvirkt.';
  }
 });
}
