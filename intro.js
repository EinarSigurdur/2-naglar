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
  const diagonal = 'M493 1199 Q476 1178 528 1137 L1147 869 Q1164 860 1153 844 L1142 821 Q1159 800 1187 805 L1253 958 Q1247 979 1219 978 L1194 934 Q1187 922 1170 931 L573 1188 Q526 1208 493 1199Z';
  const horizontal = 'M433 1083 Q451 1061 494 1060 L1147 1060 Q1167 1060 1167 1034 L1168 1013 Q1191 998 1219 1007 L1225 1164 Q1215 1186 1180 1180 L1168 1167 L1168 1138 Q1167 1122 1147 1123 L491 1123 Q449 1118 433 1102Z';
  const source = '<image href="assets/logo-transparent.png" width="1254" height="1254"/>';
  artwork = document.createElementNS('http://www.w3.org/2000/svg','svg');
  artwork.setAttribute('viewBox','0 0 1254 1254');
  artwork.setAttribute('aria-hidden','true');
  artwork.classList.add('intro-artwork');
  // Original pixels remain authoritative. Small underlays complete only the letter areas
  // occluded by the nails in the flattened PNG; the original mark takes over before flight.
  artwork.innerHTML = `<defs>
   <filter id="intro-orange-key" color-interpolation-filters="sRGB"><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  4 0 -4 0 -1.8"/></filter>
   <mask id="intro-orange" maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254"><g filter="url(#intro-orange-key)">${source}</g></mask>
   <mask id="intro-no-orange" maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254"><rect width="1254" height="1254" fill="white"/><rect width="1254" height="1254" fill="black" mask="url(#intro-orange)"/></mask>
   <mask id="intro-body" maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254"><rect width="1254" height="1254" fill="white"/><path d="${horizontal}" fill="black" stroke="black" stroke-width="14"/><path d="${diagonal}" fill="black" stroke="black" stroke-width="14"/></mask>
   <mask id="intro-nail-a" maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254"><path d="${horizontal}" fill="white" stroke="white" stroke-width="14"/></mask>
   <mask id="intro-nail-b" maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254"><path d="${diagonal}" fill="white" stroke="white" stroke-width="14"/></mask>
   <mask id="intro-back-nail"><rect width="1254" height="1254" fill="white"/><path d="${diagonal}" fill="black" stroke="black" stroke-width="14"/></mask>
  <mask id="intro-occluded" maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254"><path d="${horizontal}" fill="white" stroke="white" stroke-width="14"/><path d="${diagonal}" fill="white" stroke="white" stroke-width="14"/></mask>
   <clipPath id="intro-word-bounds"><path d="M45 622H1160V800Q1160 838 1112 858Q1136 873 1146 925L1150 1076H45Z"/></clipPath>
  </defs>
  <g mask="url(#intro-body)"><g mask="url(#intro-no-orange)">
   <svg class="intro-piece intro-number" x="0" y="0" width="1254" height="622" viewBox="0 0 1254 622" overflow="hidden">${source}</svg>
  </g></g>
  <g class="intro-piece intro-word"><g clip-path="url(#intro-word-bounds)">
   <g mask="url(#intro-occluded)">
    <g fill="#0088b0" stroke="#fff" stroke-width="5" stroke-linejoin="round">
     <path d="M520 638H594Q651 638 651 698V805H577V689H560V1022H577V833H651V1012Q651 1070 593 1070H523Q465 1070 465 1012V698Q465 638 520 638Z"/>
     <path d="M661.5 638H748.5V1021H779V1070H661.5Z"/>
     <path d="M786 638H936L955 1070H867.5V875H856.5V1070H768Z"/>
     <path d="M961 638H1081Q1150 638 1150 698V791Q1150 835 1100 858Q1125 870 1133 901L1143 1070H1056L1048 880H1046.5V1070H957.5Z"/>
    </g>
    <g fill="none" stroke="#fff" stroke-width="22"><path d="M479 985V1013Q479 1056 523 1056"/><path d="M670.5 985V1066"/><path d="M777.5 1066L785.5 875"/><path d="M876.5 875V1066"/><path d="M970.5 900L969 1066"/><path d="M1056.5 884L1066 1066"/></g>
    <g fill="none" stroke="#ff8500" stroke-width="12"><path d="M479 985V1013Q479 1056 523 1056"/><path d="M670.5 985V1066"/><path d="M777.5 1066L785.5 875"/><path d="M876.5 875V1066"/><path d="M970.5 900L969 1066"/><path d="M1056.5 884L1066 1066"/></g>
   </g>
   <g mask="url(#intro-body)">${source}</g>
  </g></g>
  <svg x="0" y="0" width="1254" height="622" viewBox="0 0 1254 622" overflow="hidden"><g class="intro-piece intro-orange" mask="url(#intro-orange)">${source}</g></svg>
  <g class="intro-piece intro-nail-back" mask="url(#intro-nail-a)"><g mask="url(#intro-back-nail)">${source}</g></g>
  <g class="intro-piece intro-nail-front" mask="url(#intro-nail-b)">${source}</g>`;
  backdrop = document.createElement('div'); backdrop.className='intro-backdrop'; backdrop.setAttribute('aria-hidden','true');
  hero.append(backdrop); brand.append(artwork);
  root.classList.add('intro-playing');
  const ease='cubic-bezier(.22,.72,.18,1)';
  const tempo = 1950 / 1890;
  const animate = (el, frames, options) => { const a=el.animate(frames,{fill:'both',easing:ease,...options,duration:options.duration*tempo,delay:(options.delay||0)*tempo}); animations.push(a); return a; };
  animate(artwork.querySelector('.intro-number'),[{clipPath:'inset(100% 0 0 0)',opacity:0},{clipPath:'inset(0% 0 0 0)',opacity:1}],{duration:440});
  animate(artwork.querySelector('.intro-word'),[{opacity:0,transform:'translateY(18px)',clipPath:'inset(100% 0 0 0)'},{opacity:1,transform:'translateY(0)',clipPath:'inset(0% 0 0 0)'}],{delay:220,duration:390});
  animate(artwork.querySelector('.intro-orange'),[{opacity:0},{opacity:1}],{delay:530,duration:260});
  animate(artwork.querySelector('.intro-nail-back'),[{opacity:0,transform:'translateX(-125px)'},{opacity:1,transform:'translateX(0)'}],{delay:710,duration:300});
  animate(artwork.querySelector('.intro-nail-front'),[{opacity:0,transform:'translate(100px,-48px)'},{opacity:1,transform:'translate(0,0)'}],{delay:790,duration:300});
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
