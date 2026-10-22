// One shared element: the existing hero brand keeps its layout box throughout.
(async () => {
 const root = document.documentElement;
 if (!root.classList.contains('intro-pending')) return;
 const brand = document.querySelector('.hero-brand');
 const logo = brand.querySelector('img');
 const hero = document.querySelector('.hero');
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 const animations = [];
 let backdrop, artwork, stopped = false;
 const initialViewport = [innerWidth, innerHeight];
 const onResize = () => { if (innerWidth !== initialViewport[0] || innerHeight !== initialViewport[1]) finish(); };
 const onScroll = () => { if (scrollY > 8) finish(); };
 const finish = () => {
  if (stopped) return;
  stopped = true;
  root.classList.remove('intro-pending', 'intro-playing');
  animations.forEach(a => a.cancel());
  backdrop?.remove(); artwork?.remove();
  clearTimeout(window.naglarIntroFallback);
  window.removeEventListener('resize', onResize);
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('pagehide', finish);
  document.removeEventListener('keydown', finish);
  document.removeEventListener('pointerdown', finish);
  motion.removeEventListener('change', finish);
 };
 try {
  // Do not hold up a slow connection or a failed image for an ornamental intro.
  await Promise.race([Promise.all([logo.decode(), document.fonts.ready]), new Promise((_, reject) => setTimeout(() => reject(new Error('asset timeout')), 450))]);
  if (!root.classList.contains('intro-pending') || motion.matches || scrollY > 8) return finish();
  sessionStorage.setItem('naglar-intro-seen', '1');
  const box = brand.getBoundingClientRect();
  const size = Math.min(innerWidth * .83, innerHeight * .64, 510);
  const scale = size / box.width;
  const x = (innerWidth - size) / 2 - box.left;
  const y = (innerHeight - size) / 2 - box.top;
  const source = '<image href="assets/logo-transparent.webp" width="1254" height="1254"/>';
  artwork = document.createElementNS('http://www.w3.org/2000/svg','svg');
  artwork.setAttribute('viewBox','0 0 1254 1254');
  artwork.setAttribute('aria-hidden','true');
  artwork.classList.add('intro-artwork');
  // Reveal the exact original pixels. The word and its overlapping nails stay intact;
  // a flattened source cannot supply the hidden letter outlines without inventing them.
  artwork.innerHTML = `
   <svg class="intro-piece intro-number" x="0" y="0" width="1254" height="622" viewBox="0 0 1254 622" overflow="hidden">${source}</svg>
   <svg class="intro-piece intro-word" x="0" y="622" width="1254" height="632" viewBox="0 622 1254 632" overflow="hidden">${source}</svg>`;
  backdrop = document.createElement('div'); backdrop.className='intro-backdrop'; backdrop.setAttribute('aria-hidden','true');
  hero.append(backdrop); brand.append(artwork);
  root.classList.add('intro-playing');
  const ease='cubic-bezier(.22,.72,.18,1)';
  const tempo = 1950 / 1890;
  const animate = (el, frames, options) => { const a=el.animate(frames,{fill:'both',easing:ease,...options,duration:options.duration*tempo,delay:(options.delay||0)*tempo}); animations.push(a); return a; };
  animate(artwork.querySelector('.intro-number'),[{clipPath:'inset(100% 0 0 0)',opacity:0},{clipPath:'inset(0% 0 0 0)',opacity:1}],{duration:440});
  animate(artwork.querySelector('.intro-word'),[{opacity:0,transform:'translateY(18px)',clipPath:'inset(100% 0 0 0)'},{opacity:1,transform:'translateY(0)',clipPath:'inset(0% 0 0 0)'}],{delay:230,duration:610});
  // The original raster replaces the completed mask at the same bounds before flight.
  animate(artwork,[{opacity:1},{opacity:0}],{delay:1090,duration:1});
  animate(logo,[{opacity:0},{opacity:1}],{delay:1090,duration:1});
  animate(brand,[{transform:`translate(${x}px,${y}px) scale(${scale})`},{transform:'translate(0,0) scale(1)'}],{delay:1100,duration:720});
  animate(backdrop,[{opacity:1},{opacity:0}],{delay:1100,duration:660});
  animate(document.querySelector('.header'),[{opacity:0},{opacity:1}],{delay:1250,duration:450});
  const words=[...document.querySelector('.hero-words').children];
  words.forEach((el,i)=>animate(el,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{delay:1270+i*95,duration:430}));
  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('pagehide', finish, {once:true});
  document.addEventListener('keydown', finish, {once:true});
  document.addEventListener('pointerdown', finish, {once:true});
  motion.addEventListener('change', finish, {once:true});
  await Promise.all(animations.map(a=>a.finished.catch(()=>{})));
  finish();
 } catch { finish(); }
})();
