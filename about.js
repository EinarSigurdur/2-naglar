// One calm entrance; artwork pixels and natural scroll remain untouched.
(() => {
 const section = document.querySelector('.about-people');
 if (!section || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
 const preference = matchMedia('(prefers-reduced-motion: reduce)');
 if (preference.matches) return;
 const title = section.querySelector('h2');
 const stage = section.querySelector('.founders-art');
 const portraits = [...stage.querySelectorAll('img')];
 const story = section.querySelector('.people-story');
 const animations = [];
 let finished = false, started = false;
 const reveal = (el,frames,delay,duration) => {
  const animation=el.animate(frames,{delay,duration,fill:'both',easing:'cubic-bezier(.22,.72,.18,1)'});
  animations.push(animation); return animation;
 };
 const finish = () => {
  if (finished) return;
  finished=true;
  section.classList.remove('people-motion-ready');
  animations.forEach(a=>a.cancel());
  titleObserver.disconnect(); stageObserver.disconnect();
  preference.removeEventListener('change',finish);
  section.removeEventListener('focusin',finish);
  window.removeEventListener('pagehide',finish);
 };
 const titleObserver = new IntersectionObserver(entries=>{
  if (!entries.some(e=>e.isIntersecting) || finished) return;
  reveal(title,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],0,650);
  titleObserver.disconnect();
 },{rootMargin:'0px 0px -6% 0px'});
 const stageObserver = new IntersectionObserver(async entries=>{
  if (started || finished || !entries.some(e=>e.isIntersecting)) return;
  started=true; stageObserver.disconnect();
  // Native lazy loading remains in charge; don't animate empty image boxes.
  try { await Promise.race([Promise.all(portraits.map(img=>img.decode())),new Promise((_,reject)=>setTimeout(()=>reject(),1800))]); }
  catch { finish(); return; }
  if (finished) return;
  portraits.forEach((img,i)=>reveal(img,[{opacity:0,transform:`translateY(${i?105:100}%)`},{opacity:1,transform:'translateY(0)'}],i*180,i?940:880));
  const last=reveal(story,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],850,550);
  await last.finished.catch(()=>{}); finish();
 },{threshold:.12});
 section.classList.add('people-motion-ready');
 titleObserver.observe(title);stageObserver.observe(stage);
 preference.addEventListener('change',finish);
 section.addEventListener('focusin',finish);
 window.addEventListener('pagehide',finish,{once:true});
})();
