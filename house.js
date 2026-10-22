import { housePose, damp } from './house-motion.mjs';
// A purpose-built architectural model. No external model or image requests at runtime.
const section = document.querySelector('.house-story');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const compact = matchMedia('(max-width: 760px)');
const shortScreen = matchMedia('(max-height: 540px)');
let teardown = () => {};
let loading = false;
async function start() {
 if (loading || motion.matches || shortScreen.matches || !('IntersectionObserver' in window) || !('ResizeObserver' in window) || !section || section.classList.contains('house-ready')) return;
 loading = true;
 try {
  const T = await import('./assets/vendor/three.module.min.js');
  if (!motion.matches && !shortScreen.matches) teardown = mount(T);
 } catch (error) { console.warn('3D illustration unavailable; service photographs remain visible.', error); }
 finally { loading = false; }
}
function mount(T) {
 const host = section.querySelector('.house-canvas');
 const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
 renderer.setPixelRatio(Math.min(devicePixelRatio, compact.matches ? 1.25 : 1.5));
 renderer.outputColorSpace = T.SRGBColorSpace;
 renderer.toneMapping = T.ACESFilmicToneMapping;
 renderer.toneMappingExposure = 1.25;
 renderer.shadowMap.enabled = true;
 renderer.shadowMap.type = T.PCFSoftShadowMap;
 renderer.domElement.setAttribute('aria-hidden', 'true');
 const scene = new T.Scene();
 const camera = new T.PerspectiveCamera(35, 1, .1, 100);
 camera.position.set(8, 6, 9); camera.lookAt(0, 1.8, 0);
 scene.add(new T.HemisphereLight(0xd5e5ee, 0x626460, 1.8));
 const key = new T.DirectionalLight(0xfff2da, 3); key.position.set(-3, 9, 6); key.castShadow = true;
 const shadowSize=compact.matches?512:1024; key.shadow.mapSize.set(shadowSize, shadowSize); Object.assign(key.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8 }); key.shadow.bias = -.001;
 scene.add(key); const rim = new T.DirectionalLight(0xd4e2eb, .85); rim.position.set(5, 4, -5); scene.add(rim);
 const house = new T.Group(); scene.add(house);
 const material = (color, metalness = 0, roughness = .65) => new T.MeshStandardMaterial({ color, metalness, roughness });
 const plaster = material(0xc4c8c5), wood = material(0xb0a28a), slate = material(0x344c59, .55, .35), trim = material(0x253d49, .45, .3), glass = material(0x55889c, .65, .18), concrete = material(0x7b8d92);
 // Deterministic surface maps: real scale, subtle grain, no external texture requests.
 const textures=[];
 function surface(kind){
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=512;
  const ctx=canvas.getContext('2d'), image=ctx.createImageData(256,512);
  let seed=47;const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  for(let y=0;y<512;y++)for(let x=0;x<256;x++){
   const grain=Math.sin(x*.7+Math.sin(y*.025)*1.5)*7+Math.sin(x*2.3+y*.008)*3;
   const value=kind==='wood'?184+grain+(random()-.5)*12:185+(random()-.5)*18;
   const i=(y*256+x)*4;image.data[i]=value;image.data[i+1]=value;image.data[i+2]=value;image.data[i+3]=255;
  }
  ctx.putImageData(image,0,0);const texture=new T.CanvasTexture(canvas);texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());textures.push(texture);return texture;
 }
 const woodTexture=surface('wood'), metalTexture=surface('metal');
 wood.map=woodTexture;wood.bumpMap=woodTexture;wood.bumpScale=.012;wood.color.set(0xc5b49a);wood.roughness=.8;
 slate.roughnessMap=metalTexture;slate.roughness=.48;slate.metalness=.65;
 plaster.roughness=1;concrete.roughness=1;concrete.bumpMap=metalTexture;concrete.bumpScale=.018;
 glass.color.set(0x43616c);glass.metalness=.35;glass.roughness=.12;
 const skyCanvas=document.createElement('canvas');skyCanvas.width=512;skyCanvas.height=256;
 const skyContext=skyCanvas.getContext('2d'),skyGradient=skyContext.createLinearGradient(0,0,0,256);
 skyGradient.addColorStop(0,'#9bbbcf');skyGradient.addColorStop(.48,'#e7e8dd');skyGradient.addColorStop(.53,'#71818a');skyGradient.addColorStop(1,'#29363a');skyContext.fillStyle=skyGradient;skyContext.fillRect(0,0,512,256);
 skyContext.fillStyle='#fff5df';skyContext.fillRect(70,35,65,90);
 const sky=new T.CanvasTexture(skyCanvas);sky.mapping=T.EquirectangularReflectionMapping;sky.colorSpace=T.SRGBColorSpace;
 const pmrem=new T.PMREMGenerator(renderer),environment=pmrem.fromEquirectangular(sky);scene.environment=environment.texture;scene.environmentIntensity=.65;pmrem.dispose();sky.dispose();
 const orange = new T.Color(0xff8500), roofMat = slate.clone(), windowMat = trim.clone(), cladMat = wood.clone();
 const originals = [roofMat.color.clone(), windowMat.color.clone(), cladMat.color.clone()];
 const box = (parent, w, h, d, x, y, z, mat) => { const mesh = new T.Mesh(new T.BoxGeometry(w, h, d), mat); mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh; };
 box(house, 5.7, .22, 3.7, 0, -.12, 0, concrete);
 box(house, 5.2, .1, 3.2, 0, .03, 0, plaster);
 const roof = new T.Group(); house.add(roof);
 const pitch = Math.atan2(1.15, 1.95), slope = Math.hypot(1.15, 1.95);
 for (const sign of [-1, 1]) {
  const panel = new T.Group(); panel.position.set(0, 3.025, sign * .975); panel.rotation.x = sign * pitch; roof.add(panel);
  box(panel, 5.95, .12, slope, 0, 0, 0, roofMat);
  for (let x = -2.85; x < 2.9; x += .25) box(panel, .018, .035, slope, x, .075, 0, roofMat);
  box(panel, 5.98, .16, .08, 0, -.02, sign * slope / 2, trim);
 }
 box(roof, 5.97, .12, .13, 0, 3.61, 0, roofMat);
 // Exposed fascia and timber under the eaves make the lifted roof read as construction.
 for(const sign of [-1,1]){
  const underside=new T.Group();underside.position.set(0,3.025,sign*.975);underside.rotation.x=sign*pitch;roof.add(underside);
  box(underside,5.9,.045,slope,0,-.085,0,wood);
  for(let x=-2.65;x<2.8;x+=.65)box(underside,.065,.13,slope,x,-.15,0,wood);
 }
 box(house,1.25,.15,.7,1.9,-.08,2.05,concrete);
 for(const x of [-2.53,2.53])for(const z of [-1.78,1.78]){
  const pipe=new T.Mesh(new T.CylinderGeometry(.035,.035,2.35,10),trim);pipe.position.set(x,1.13,z);pipe.castShadow=true;house.add(pipe);
  for(const y of [.45,1.9])box(house,.1,.035,.1,x,y,z,trim);
 }
 const cladding = [], windows = [];
 function wall(width, x, z, rotation, openings, gable = false) {
  const shell = new T.Group(); shell.position.set(x, 0, z); shell.rotation.y = rotation; house.add(shell);
  const skin = new T.Group(); shell.add(skin); cladding.push(skin);
  const win = new T.Group(); shell.add(win); windows.push(win);
  // Segment walls around real apertures so detached windows reveal openings.
  const xs = [...new Set([-width/2, width/2, ...openings.flatMap(o => [o.x-o.w/2, o.x+o.w/2])])].sort((a,b)=>a-b);
  const ys = [...new Set([0, 2.45, ...openings.flatMap(o => [o.y-o.h/2, o.y+o.h/2])])].sort((a,b)=>a-b);
  const inside = (x,y) => openings.some(o => Math.abs(x-o.x)<o.w/2 && Math.abs(y-o.y)<o.h/2);
  for(let i=1;i<xs.length;i++) for(let j=1;j<ys.length;j++) {const cx=(xs[i]+xs[i-1])/2,cy=(ys[j]+ys[j-1])/2;if(!inside(cx,cy)) box(shell,xs[i]-xs[i-1],ys[j]-ys[j-1],.15,cx,cy,-.08,plaster);}
  // Individual boards give the skin thickness and grazing-light detail.
  const count = Math.ceil(width/.14), bw = width/count;
  for(let i=0;i<count;i++) {
   const left=-width/2+i*bw, right=left+bw;
   const cuts=[0,2.45,...openings.filter(o=>o.x+o.w/2>left && o.x-o.w/2<right).flatMap(o=>[o.y-o.h/2,o.y+o.h/2])].sort((a,b)=>a-b);
   for(let j=1;j<cuts.length;j++) {
    const cy=(cuts[j]+cuts[j-1])/2;
    let segments=[[left,right]];
    for(const o of openings.filter(o=>Math.abs(cy-o.y)<o.h/2)) segments=segments.flatMap(([a,b])=> [[a,Math.min(b,o.x-o.w/2)],[Math.max(a,o.x+o.w/2),b]].filter(([a,b])=>b-a>.002));
    for(const [a,b] of segments) box(skin,b-a-.008,cuts[j]-cuts[j-1],.075,(a+b)/2,cy,.055,cladMat);
   }
  }
  if(gable) {
   const shape=new T.Shape();shape.moveTo(-width/2,2.45);shape.lineTo(0,3.55);shape.lineTo(width/2,2.45);shape.closePath();
   const mesh=new T.Mesh(new T.ShapeGeometry(shape),plaster);mesh.material=plaster.clone();mesh.material.side=T.DoubleSide;shell.add(mesh);
   for(let i=0;i<count;i++){const cx=-width/2+(i+.5)*bw, h=1.1*(1-Math.abs(cx)/(width/2));box(skin,bw-.008,h,.075,cx,2.45+h/2,.055,cladMat);}
  }
  for(const o of openings){
   const frame=new T.Group();frame.position.set(o.x,o.y,.13);(o.door ? shell : win).add(frame);
   box(frame,o.w-.08,o.h-.08,.035,0,0,0,glass);
   for(const sign of [-1,1]){box(frame,.065,o.h,.11,sign*(o.w-.065)/2,0,.03,windowMat);box(frame,o.w,.065,.11,0,sign*(o.h-.065)/2,.03,windowMat);}
   box(frame,.035,o.h,.08,0,0,.045,windowMat);
   box(frame,o.w+.1,.04,.18,0,-o.h/2,.035,trim);
   if(o.door){box(frame,o.w-.13,o.h*.65,.055,0,-o.h*.14,.035,trim);box(frame,.03,.2,.04,o.w*.3,0,.1,material(0xb7bfc1,.8,.2));}
  }
 }
 wall(5.4,0,1.7,0,[{x:-1.6,y:1.4,w:1.1,h:1.25},{x:0,y:1.4,w:1.1,h:1.25},{x:1.9,y:1.05,w:.8,h:2.1,door:true}]);
 wall(5.4,0,-1.7,Math.PI,[{x:-1.6,y:1.4,w:1.1,h:1.25},{x:0,y:1.4,w:1.1,h:1.25},{x:1.6,y:1.4,w:1.1,h:1.25}]);
 wall(3.4,2.7,0,Math.PI/2,[{x:0,y:1.4,w:1.5,h:1.25}],true);
 wall(3.4,-2.7,0,-Math.PI/2,[{x:0,y:1.4,w:1.5,h:1.25}],true);
 // Batch static pieces by material within each moving part: board detail without hundreds of draw calls.
 function batch(group) {
  for(const child of [...group.children]) if(child.isGroup) batch(child);
  const batches=new Map();
  for(const child of group.children) if(child.isMesh){const items=batches.get(child.material)||[];items.push(child);batches.set(child.material,items);}
  for(const [mat,items] of batches){
   if(items.length<2)continue;
   const positions=[],normals=[],uvs=[];
   for(const item of items){item.updateMatrix();const geometry=item.geometry.toNonIndexed();geometry.applyMatrix4(item.matrix);positions.push(...geometry.attributes.position.array);normals.push(...geometry.attributes.normal.array);uvs.push(...geometry.attributes.uv.array);geometry.dispose();item.geometry.dispose();group.remove(item);}
   const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new T.Float32BufferAttribute(normals,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));
   const mesh=new T.Mesh(geometry,mat);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);
  }
 }
 batch(house);
 const accents = [0,1,2].map(() => new T.LineBasicMaterial({color:0xffa14a,transparent:true,opacity:0}));
 function outline(group, material){
  const meshes=[];group.traverse(o=>{if(o.isMesh)meshes.push(o)});
  for(const mesh of meshes) mesh.add(new T.LineSegments(new T.EdgesGeometry(mesh.geometry,25),material));
 }
 outline(roof,accents[0]);windows.forEach(w=>outline(w,accents[1]));cladding.forEach(w=>outline(w,accents[2]));
 const ground=new T.Mesh(new T.PlaneGeometry(200,200),new T.ShadowMaterial({opacity:.24}));ground.rotation.x=-Math.PI/2;ground.position.y=-.24;ground.receiveShadow=true;scene.add(ground);
 const panels=[...section.querySelectorAll('.house-step')];
 let frame=0, measureFrame=0, current=0, target=0, visible=true, disposed=false, lastTime=0;
 function onScroll(){if(!measureFrame && visible)measureFrame=requestAnimationFrame(()=>{measureFrame=0;measure();});}
 const clamp=(n)=>Math.max(0,Math.min(1,n));
 function measure(){const first=panels[0].getBoundingClientRect(),last=panels[2].getBoundingClientRect();const focus=innerHeight*(compact.matches?.64:.5);target=clamp((focus-first.top)/Math.max(1,last.bottom-first.top));schedule();}
 function render(time){frame=0;if(disposed||!visible)return;current=damp(current,target,lastTime?(time-lastTime)/1000:1/60);lastTime=time;if(Math.abs(current-target)<.0001)current=target;
  const pose=housePose(current), amounts=pose.parts;
  house.rotation.y=pose.rotation;
  roof.position.y=amounts[0]*1.35;
  windows.forEach(w=>w.position.z=amounts[1]*.95);
  cladding.forEach(w=>w.position.z=amounts[2]*.7);
  [roofMat,windowMat,cladMat].forEach((mat,i)=>mat.color.copy(originals[i]).lerp(orange,amounts[i]*.22));
  accents.forEach((mat,i)=>mat.opacity=amounts[i]*.7);
  renderer.render(scene,camera);
  section.style.setProperty('--house-progress',`${current*100}%`);
  if(current!==target)schedule();
 }
 function schedule(){if(!frame&&visible&&!disposed)frame=requestAnimationFrame(render);}
 function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.position.set(8,6,9).multiplyScalar(camera.aspect<.95?.95/Math.max(.4,camera.aspect):1);camera.lookAt(0,1.8,0);camera.updateProjectionMatrix();measure();}
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){measure();schedule();}else if(frame){cancelAnimationFrame(frame);frame=0;}},{rootMargin:'200px'});
 const ro=new ResizeObserver(resize);
 function destroy(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);observer.disconnect();ro.disconnect();cancelAnimationFrame(measureFrame);window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',resize);scene.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of [o.material].flat())m.dispose();});environment.dispose();textures.forEach(texture=>texture.dispose());renderer.dispose();renderer.domElement.remove();section.classList.remove('house-ready');}
 renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();destroy();});
 host.append(renderer.domElement);
 // Reveal only after a successfully rendered frame; otherwise keep the original service UI.
 resize();renderer.render(scene,camera);section.classList.add('house-ready');resize();
 observer.observe(section);ro.observe(host);window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',resize);
 return destroy;
}
if(section){
 if('IntersectionObserver' in window){const loader=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){start();loader.disconnect();}},{rootMargin:'700px'});loader.observe(section);}else start();
 const adapt=()=>{teardown();if(!motion.matches && !shortScreen.matches)start();};
 motion.addEventListener('change',adapt);shortScreen.addEventListener('change',adapt);
 window.addEventListener('pagehide',()=>teardown());
 window.addEventListener('pageshow',event=>{if(event.persisted)start();});
}
