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

// A little presence, not a loop: the original portraits follow the pointer by at most 4px.
(() => {
 const stage=document.querySelector('.founders-art');
 if(!stage || !('IntersectionObserver' in window))return;
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const pointer=matchMedia('(hover: hover) and (pointer: fine)');
 const heads=[...stage.querySelectorAll('.founder-reveal')];
 let frame=0, visible=false, x=0,y=0,tx=0,ty=0,last=0;
 function tick(time){
  frame=0;
  if(motion.matches || !visible)return reset();
  const blend=1-Math.exp(-9*Math.min(.05,last?(time-last)/1000:1/60));last=time;
  x+=(tx-x)*blend;y+=(ty-y)*blend;
  heads.forEach((head,i)=>{const weight=i?-.8:1;head.style.transform=`translate(${(x*weight).toFixed(3)}px,${(y*(i?.8:1)).toFixed(3)}px) rotate(${(x*weight*.12).toFixed(3)}deg)`;});
  if(Math.abs(x-tx)+Math.abs(y-ty)>.015)frame=requestAnimationFrame(tick);
 }
 function schedule(){if(!frame&&visible&&!motion.matches)frame=requestAnimationFrame(tick);}
 function reset(){cancelAnimationFrame(frame);frame=0;x=y=tx=ty=last=0;heads.forEach(h=>h.style.transform='');}
 stage.addEventListener('pointermove',event=>{
  if(!pointer.matches||motion.matches||!visible)return;
  const box=stage.getBoundingClientRect();
  tx=Math.max(-1,Math.min(1,(event.clientX-box.left)/box.width*2-1))*4;
  ty=Math.max(-1,Math.min(1,(event.clientY-box.top)/box.height*2-1))*3;schedule();
 },{passive:true});
 stage.addEventListener('pointerleave',()=>{tx=ty=0;schedule();});
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)reset();},{threshold:0});
 observer.observe(stage);motion.addEventListener('change',reset);pointer.addEventListener('change',reset);
 window.addEventListener('pagehide',reset);
})();
