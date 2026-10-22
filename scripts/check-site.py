"""Dependency-free checks of the static Pages output, including all local references."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json, xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self, text):
  super().__init__(); self.tags=[]; self.json=[]; self.active=False; self.buf=''; self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs);self.tags.append((tag,a))
  if tag=='script' and a.get('type')=='application/ld+json':self.active=True;self.buf=''
 def handle_data(self,data):
  if self.active:self.buf+=data
 def handle_endtag(self,tag):
  if tag=='script' and self.active:self.json.append(json.loads(self.buf));self.active=False
paths=['index.html','gluggaskipti/index.html','thakskipti/index.html','husaklaedningar/index.html','404.html','takk.html']
pages={p:Page((ROOT/p).read_text()) for p in paths}
errors=[]
def check(condition,message):
 if not condition:errors.append(message)
for path,page in pages.items():
 tags=page.tags
 check(any(t=='html' and a.get('lang')=='is' for t,a in tags),path+': language')
 check(sum(t=='h1' for t,a in tags)==1,path+': one H1')
 for tag,a in tags:
  for attr in ('href','src'):
   value=a.get(attr,'');u=urlsplit(value)
   if not value or u.scheme or u.netloc:continue
   target=ROOT / unquote(u.path.lstrip('/')) if value.startswith('/') else ROOT / Path(path).parent / unquote(u.path)
   if not u.path:target=ROOT/path
   if target.is_dir():target=target/'index.html'
   check(target.exists(),f'{path}: missing {value}')
   if u.fragment and target.exists() and target.suffix=='.html':
    other=Page(target.read_text());check(any(x.get('id')==u.fragment for _,x in other.tags),f'{path}: missing anchor {value}')
  if tag=='img':
   check(all(x in a for x in ['alt','width','height']),path+': image dimensions/alt')
   for source in a.get('srcset','').split(','):
    if not source.strip():continue
    v=source.strip().split()[0];target=ROOT/v.lstrip('/') if v.startswith('/') else ROOT/Path(path).parent/v
    check(target.exists(),f'{path}: missing srcset {v}')
 if path not in ('404.html','takk.html'):
  canonical='https://2naglar.is/'+path.removesuffix('index.html')
  check([a.get('href') for t,a in tags if t=='link' and a.get('rel')=='canonical']==[canonical],path+': canonical')
  check(not any('noindex' in a.get('content','') for t,a in tags if t=='meta' and a.get('name')=='robots'),path+': noindex')
  check(any(a.get('name')=='description' and a.get('content') for t,a in tags),path+': description')
  check(len(page.json)==1,path+': JSON-LD')
  if '/' in path:
   graph=page.json[0]['@graph'];check({n['@type'] for n in graph}=={'Service','GeneralContractor','BreadcrumbList'},path+': schema types')
   check(not any(t=='script' and a.get('src') for t,a in tags),path+': no service JS dependency')
urls=[e.text for e in ET.parse(ROOT/'sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
check(set(urls)=={'https://2naglar.is/'+p.removesuffix('index.html') for p in paths[:4]},'sitemap canonical pages')
check('Sitemap: https://2naglar.is/sitemap.xml' in (ROOT/'robots.txt').read_text(),'robots sitemap')
check((ROOT/'CNAME').read_text().strip()=='2naglar.is','CNAME')
for css in ['service-pages.css']:
 for value in __import__('re').findall(r"url\(['\"]?([^)'\"]+)", (ROOT/css).read_text()):
  check((ROOT/value.lstrip('/')).exists(), 'Missing CSS asset '+value)
assert not errors,'\n'.join(errors)
print(f'PASS: {len(pages)} pages, local links/assets/fragments, metadata, sitemap, JSON-LD and service progressive enhancement.')
