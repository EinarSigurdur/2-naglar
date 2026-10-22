import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { services } from './services.mjs';
const root = new URL('../', import.meta.url);
const origin = 'https://2naglar.is';
const esc = s => s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const hash = async file => createHash('sha256').update(await readFile(new URL(file,root))).digest('hex').slice(0,10);
export const company = {'@type':'GeneralContractor','@id':`${origin}/#company`,name:'2 Naglar ehf.',url:origin+'/',logo:origin+'/assets/logo-transparent-640.webp',image:origin+'/assets/social.jpg',foundingDate:'2006',telephone:'+3546983340',email:'2naglarehf@gmail.com',address:{'@type':'PostalAddress',streetAddress:'Skólagerði 37',postalCode:'200',addressLocality:'Kópavogur',addressCountry:'IS'},sameAs:['https://www.facebook.com/profile.php?id=100046488012962'],contactPoint:[{'@type':'ContactPoint',name:'Ivica Gregoric',telephone:'+3546983340',contactType:'Fyrirspurnir'},{'@type':'ContactPoint',name:'Þorvaldur Geir Sigurðsson',telephone:'+3548204494',contactType:'Fyrirspurnir'}]};
for (const s of services) {
 const url = `${origin}/${s.slug}/`;
 const json = {'@context':'https://schema.org','@graph':[company,{'@type':'Service','@id':url+'#service',name:s.name,serviceType:s.name,url,description:s.description,provider:{'@id':company['@id']}},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Forsíða',item:origin+'/'},{'@type':'ListItem',position:2,name:s.name,item:url}]}]};
 const html = `<!doctype html>
<html lang="is"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(s.title)}</title><meta name="description" content="${esc(s.description)}"><link rel="canonical" href="${url}">
<meta name="theme-color" content="#073f55"><meta property="og:type" content="website"><meta property="og:locale" content="is_IS"><meta property="og:site_name" content="2 Naglar ehf."><meta property="og:title" content="${esc(s.title)}"><meta property="og:description" content="${esc(s.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${origin}/assets/${s.photo}-1200.webp"><meta property="og:image:alt" content="${esc(s.alt)}"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.png"><link rel="preload" href="/assets/manrope-regular.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/service-pages.css?v=${await hash('service-pages.css')}"><script type="application/ld+json">${JSON.stringify(json).replaceAll('<','\\u003c')}</script></head>
<body class="service-page"><a class="skip" href="#efni">Fara beint í efni</a>
<header class="service-header"><a class="service-brand" href="/" aria-label="2 Naglar — forsíða"><img src="/assets/logo-nav.webp" width="160" height="160" alt="2 Naglar"></a><nav aria-label="Aðalvalmynd"><a href="/#verkefni">Verkin okkar</a><a href="/#um-okkur">Um okkur</a><a class="service-contact-link" href="#samband">Hafa samband</a></nav></header>
<main id="efni" tabindex="-1">
<nav class="breadcrumbs" aria-label="Brauðmolar"><a href="/">Forsíða</a><span aria-hidden="true">/</span><span aria-current="page">${s.name}</span></nav>
<section class="service-opening" aria-labelledby="service-title"><div class="service-opening-copy"><p class="service-kicker">2 NAGLAR · FRÁ 2006</p><h1 id="service-title">${s.name==='Húsaklæðningar'?'Húsa&shy;klæðningar':s.name}<span>.</span></h1><p class="service-lead">${s.lead}</p><p class="service-intro">${s.intro}</p><a class="button service-cta" href="#samband">Ræðum verkefnið</a></div>
<figure class="service-opening-photo service-photo-${s.slug}"><img src="/assets/${s.photo}-1200.webp" srcset="/assets/${s.photo}-640.webp ${Math.min(640,s.max)}w, /assets/${s.photo}-1200.webp ${s.max}w" sizes="(max-width:760px) 100vw, 46vw" width="${s.width}" height="${s.height}" alt="${esc(s.alt)}" fetchpriority="high"><figcaption>${s.caption}</figcaption></figure></section>
<section class="service-editorial" aria-labelledby="approach"><p class="service-kicker">VERKEFNIÐ</p><div><h2 id="approach">${s.heading}</h2>${s.paragraphs.map(p=>`<p>${p}</p>`).join('')}<h3>Hvað ræður umfangi og kostnaði?</h3><p>${s.scope}</p></div></section>
<section class="service-preparation" aria-labelledby="preparation"><div><p class="service-kicker">FYRSTA SKREFIÐ</p><h2 id="preparation">Gott að hafa<br>við höndina.</h2><p>Þú þarft ekki að hafa öll svörin tilbúin. Sendu það sem liggur fyrir og segðu okkur hvenær þú vilt hefjast handa.</p></div><ol>${s.checklist.map(p=>`<li>${p}</li>`).join('')}</ol></section>
<section class="service-evidence" aria-labelledby="experience"><header><p class="service-kicker">REYNSLA Í VERKI</p><h2 id="experience">Úr verkefnasögunni.</h2><p>Fyrirtækið 2 Naglar var stofnað árið 2006 af Þorvaldi Geir Sigurðssyni og Ivica Gregoric. Átta manna teymi stendur á bak við verkefnin.</p></header><dl>${s.projects.map(([n,p])=>`<div><dt>${esc(n)}</dt><dd>${esc(p)}</dd></div>`).join('')}</dl><a class="text-link" href="/#verkefni">Skoða verkefnasögu 2 Nagla</a></section>
<section class="service-questions" aria-labelledby="questions"><h2 id="questions">Algengar spurningar.</h2><div>${s.faq.map(([q,a])=>`<details><summary>${q}<span class="toggle-mark" aria-hidden="true"></span></summary><p>${a}</p></details>`).join('')}</div></section>
<nav class="related-services" aria-label="Önnur þjónusta"><p class="service-kicker">FLEIRA SEM VIÐ GERUM</p>${services.filter(x=>x.slug!==s.slug).map(x=>`<a href="/${x.slug}/">${x.name}</a>`).join('')}</nav></main>
<footer class="service-footer" id="samband"><div><p class="service-kicker">TÖLUM SAMAN</p><h2>Hvað má<br>gera fyrir þig?</h2><p>Lýstu verkefninu og staðsetningu þess. Myndir mega gjarnan fylgja.</p><a class="button service-cta" href="mailto:2naglarehf@gmail.com?subject=${encodeURIComponent('Fyrirspurn um '+s.name.toLowerCase())}">Senda tölvupóst</a><p class="service-mail-note">Opnast í tölvupóstforritinu þínu.</p></div><address><a class="service-email" href="mailto:2naglarehf@gmail.com">2naglarehf@gmail.com</a><p>Ivica Gregoric <a href="tel:+3546983340">698 3340</a></p><p>Þorvaldur Geir Sigurðsson <a href="tel:+3548204494">820 4494</a></p><p>Skólagerði 37 · 200 Kópavogur</p></address><div class="service-footer-bottom"><a href="/">2 Naglar ehf.</a><span>Kt. 560206-1780</span><a href="https://www.facebook.com/profile.php?id=100046488012962">Facebook</a></div></footer></body></html>`;
 await mkdir(new URL(s.slug+'/',root),{recursive:true}); await writeFile(new URL(s.slug+'/index.html',root),html);
}
let home = await readFile(new URL('index.html',root),'utf8');
home=home.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,`<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org',...company})}</script>`);
home=home.replace(/style\.css\?v=[a-f0-9]+/g,`style.css?v=${await hash('style.css')}`);
await writeFile(new URL('index.html',root),home);
for(const page of ['404.html','takk.html']) {
 const file=new URL(page,root);
 const html=(await readFile(file,'utf8')).replace(/style\.css\?v=[a-f0-9]+/g,`style.css?v=${await hash('style.css')}`);
 await writeFile(file,html);
}
await writeFile(new URL('sitemap.xml',root),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['',...services.map(s=>s.slug+'/')].map(s=>`  <url><loc>${origin}/${s}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log('Generated three static service pages and canonical sitemap.');
