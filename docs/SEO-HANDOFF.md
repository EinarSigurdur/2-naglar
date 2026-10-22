# 2 Naglar — SEO, yfirferð og næstu skref

Dagsetning: 22. október 2026. Verkefni: [#1](https://github.com/EinarSigurdur/2-naglar/issues/1).
Breytingarnar eru á `codex/seo-service-pages`, til yfirferðar. Ekki sameina sjálfkrafa við main.

## Fyrir og eftir

| Atriði | Fyrir | Í þessari grein |
| --- | --- | --- |
| Aðallén | 2naglar.is, nýlegt HTTPS | Staðfest HTTPS 200; HTTP, www og GitHub-slóð senda 301 á aðallénið |
| Þjónustusíður | Ein forsíða | Þrjár sjálfstæðar HTML-síður, engin JS-háðni |
| Innri tenglar | Þjónustu-CTA leiddu í samband | 3D og ljósmyndavaramynd leiða á viðeigandi þjónustusíðu; skýrt samband á hverri síðu |
| Titill forsíðu | Handverk sem stendur | Lýsandi þjónustutitill; sýnilegt H1 og útlit óbreytt |
| Skipulögð gögn | Grunnupplýsingar fyrirtækis | Stöðugt company-@id, tengiliðir, Service og BreadcrumbList |
| Sitemap | Forsíða | Fjórar canonical síður; engin tilbúin lastmod-gildi |
| Verkefni | Staðfestar lýsingar á forsíðu | Þjónustutengdar tilvísanir með nákvæmu umfangi; engar uppspunnar verkefnasögur |
| Mælingar | Engin staðfest GSC-gögn | Gátlisti fyrir eiganda; engar fullyrðingar um sæti eða umferð |

## Tæknileg staða og afmörkun

Opinberar HTTP-prófanir 22.10.2026 staðfestu `https://2naglar.is/` með 200 og gildu TLS-vottorði. `http://2naglar.is/`, `https://www.2naglar.is/` og `https://einarsigurdur.github.io/2-naglar/` sendu 301 á `https://2naglar.is/`. Canonical, robots og sitemap á main vísa á sama aðallén. Enginn noindex á forsíðu. Engin innskráning eða JavaScript þarf til að lesa þjónustutexta.

Þetta staðfestir tæknilegan aðgang, ekki að Google hafi skráð síðurnar. Nýju slóðirnar verða opinberar eftir samþykkt og sameiningu PR. Þá þarf að endurtaka HTTP-próf á þeim og senda sitemap í Search Console. GitHub Pages sér um HTTPS/host-áframsendingar. `/index.html` og aðrar tæknilegar útgáfur geta svarað 200; canonical vísar á hreina möppuslóð. GitHub Pages býður ekki almennar sérsniðnar 301-reglur. Engar JavaScript- eða meta-refresh-áframsendingar eru notaðar.

Heimildir fyrirtækjaupplýsinga: núverandi HTML og staðfest gögn í verkefni #1. Verkmyndir af gluggaísetningu og gula húsinu eru úr áður samþykktu Facebook-myndasafni fyrirtækisins; þær eru ekki eignaðar nafngreindum viðskiptavinum. Timburmynd á húsaklæðningasíðu er merkt innblástursmynd. Engin ný verð, umsagnir, vottun, ábyrgð eða þjónustusvæði eru fullyrt. Almennar upplýsingar um umfang og undirbúning eru leiðbeiningar fyrir fyrirspurn, ekki loforð um ákveðið vinnuferli.

## Google Search Console — eigandi

- [ ] Opna Google Search Console með Google-aðgangi fyrirtækisins. Bæta við **Domain property** `2naglar.is` (án https eða slóðar).
- [ ] Afrita nákvæmlega TXT-staðfestingargildið sem Google gefur. Í DNS Hýsingu ISNIC: stök færsla, TXT, tómt heiti fyrir rót lénsins, gildið frá Google. Varðveita allar núverandi færslur. Ekki nota tilbúið dæmigildi.
- [ ] Staðfesta eignarhald í Search Console og halda TXT-færslunni eftir staðfestingu.
- [ ] Eftir sameiningu PR: senda `https://2naglar.is/sitemap.xml` undir Sitemaps.
- [ ] Nota URL Inspection og Test live URL fyrir forsíðu og þjónustusíðurnar þrjár. Athuga 200, crawl allowed og Google-selected canonical. Óska eftir skráningu þar sem við á.
- [ ] Athuga Page indexing, Security issues og Manual actions. Rétt robots.txt tryggir ekki skráningu; bregðast við raunverulegum ástæðum sem Google sýnir.
- [ ] Mánaðarlega: skoða síðustu 28 daga miðað við fyrra tímabil, fyrir Ísland og eftir tæki. Skrá smelli, birtingar, CTR og leitarfyrirspurnir eftir lendingarsíðu. Lítil úrtök eru óstöðug.
- [ ] Halda einfalt yfirlit yfir raunverulegar fyrirspurnir: þjónustutegund, hvernig viðskiptavinur fann fyrirtækið og hvort fyrirspurn varð að verki. Ekki jafna smelli á símanúmer við staðfest símtöl.
- [ ] Athuga Core Web Vitals þegar næg vettvangsgögn liggja fyrir. Markmið við 75. hundraðshlutamark: LCP ≤ 2,5 s, INP ≤ 200 ms og CLS ≤ 0,1. Lighthouse er rannsóknarstofupróf, ekki sönnun um þessi vettvangsgildi.

## Google Business Profile — eigandi

- [ ] Finna og gera tilkall til núverandi prófíls áður en nýr er stofnaður; forðast tvískráningu. Staðfesting fer fram með þeim aðferðum sem Google býður eiganda.
- [ ] Nota raunverulegt fyrirtækisnafn, síma og `https://2naglar.is/`. Ekki bæta leitarorðum eða bæjarheitum við nafnið.
- [ ] Velja þann aðalflokk sem lýsir aðalstarfsemi best úr núverandi flokkalista Google; bæta aðeins við viðeigandi aukaflokkum.
- [ ] Staðfesta þjónustusvæði og opnunartíma áður en þeir eru birtir. Ekki álykta að heimilisfang í Kópavogi jafngildi þjónustu á öllu höfuðborgarsvæðinu.
- [ ] Staðfesta hvort tekið sé á móti viðskiptavinum á Skólagerði 37. Ef þetta er þjónustufyrirtæki sem heimsækir viðskiptavini en tekur ekki á móti þeim þar skal fela heimilisfangið í prófílnum og nota rétt þjónustusvæði.
- [ ] Bæta við þjónustulýsingum og raunverulegum verkmyndum með heimild. Ekki nota innblástursmyndir sem sönnun fyrir eigin verkum.
- [ ] Biðja viðskiptavini hlutlaust um heiðarlega umsögn með beinum Google-umsagnartengli. Engin umbun, engar tilbúnar umsagnir og ekki velja eingöngu ánægða viðskiptavini.

## Efni sem þarf staðfestingu eiganda

- [ ] Þjónustusvæði, forgangsþjónustur og raunverulegt ferli frá fyrirspurn til verks.
- [ ] Hvort upplýsingar í núverandi Um okkur-kafla um vottanir, gæðakerfi og opinber útboð séu enn gildar. Þær hafa ekki verið útvíkkaðar eða fluttar í nýjar SEO-fullyrðingar.
- [ ] Verkefnaár, nákvæmt hlutverk og heimildir fyrir birtingu nafna, verkskýringa og ljósmynda hjá Kársnesskóla, Þjóðkirkjunni, Bríet, BYKO og Bestlu.
- [ ] Velja 2–3 verkefni með nægu efni fyrir sjálfstæða verkefnasögu: verkefnisáskorun, hvað 2 Naglar gerðu, staðfest efni/lausn og eigin myndir. Engar síður með uppspunnum fyllitexta.
- [ ] Staðfesta að teymisstærð og tengiliðaupplýsingar séu enn réttar og yfirfara nýja þjónustutexta.

## Eðlileg kynning og tenglar

Bjóða raunverulegum samstarfsaðilum eða verkefnaeigendum stutta, staðreyndamiðaða umfjöllun um sameiginlegt verk þegar myndheimildir og hlutverk liggja fyrir. Óska eftir réttri tilvísun ef fyrirtækið er þegar nefnt. Engin keypt tenglanet, fjöldaskráningar eða falskar umsagnir. Engin skilaboð hafa verið send til þriðja aðila.

## Viðhald

Þetta repo inniheldur tilbúna static vefinn sem GitHub Pages birtir. `scripts/services.mjs` er textagjafi þjónustusíðna, `scripts/build-services.mjs` myndar þrjár HTML-síður, fyrirtækjagögn forsíðu og sitemap. Keyra `npm run build` og `npm test`; commit-a mynduðum HTML-skrám með frumskrám. GitHub Pages þarf engan Node-runtime eða bakenda.

Ekki keyra eldri staðbundna útgáfu `2-naglar/build.mjs` yfir allt repo-ið: hún þekkir ekki þjónustusíðurnar og getur yfirskrifað sitemap og forsíðutengla. Fyrir áframhaldandi vinnu skal nota þessa grein/repo sem birtingargrunn eftir yfirferð.

## Opinberar leiðbeiningar

- [Google: SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google: reglur um skipulögð gögn](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Search Console: staðfesta eignarhald](https://support.google.com/webmasters/answer/9008080)
- [Google Business Profile: rétt framsetning fyrirtækis](https://support.google.com/business/answer/3038177)
- [Core Web Vitals](https://web.dev/articles/vitals)

Hagræðing breytir ekki leturgerð eða teikningum: Manrope er þjappað í WOFF2 með sömu stöfum og OFL-leyfið fylgir áfram. Nýjar stærðir af hausunum eru hefðbundnar minnkanir af sömu upprunamyndum; upprunarnir eru varðveittir. Engin AI-endurgerð. Þjónustusíður sækja aðeins eigið CSS og ekkert JavaScript.
