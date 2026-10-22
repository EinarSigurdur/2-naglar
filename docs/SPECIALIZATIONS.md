# Sérhæfingar — bíða staðfestingar eigenda

Þjónusturöndin byggir á staðfestingu viðskiptavinar á almennri smíðavinnu, nýsmíði og viðhaldi. Eldri smátexti var fjarlægður úr bæði 3D-kafla og varaframsetningu til að forðast tvítekningu.

## BYKO / gluggaísetning og viðgerðir

Vantar skriflega staðfestingu á núgildandi heiti og umfangi BYKO-vottunar/samstarfs; hvort það taki sérstaklega til gluggaísetningar, viðgerða eða beggja; dagsetningu/gildistíma og opinbera tilvísun eða skjal frá BYKO. Fá heimild og upprunalegt merki ef nota á merki. Ekki fullyrða um einkarétt eða sérstöðu á Íslandi án skýrra gagna. Engin ný vottunarfullyrðing eða tilbúið merki hefur verið birt.

## Danska klæðningarkerfið

Vantar heiti kerfis og framleiðanda, opinbera vöruupplýsingaslóð, hvað þjálfunin fól í sér, hver veitti hana, hverjir luku henni og hvenær. Fá skrifleg gögn um mögulegan einkarétt eða aðra sérstöðu (umfang, landssvæði og gildistíma), ef það á að nefna hana. Fá eigin verkmyndir með birtingarheimild, heiti/staðsetningu verkefnis eftir því sem heimilt er, verkefnisár og nákvæmt hlutverk 2 Nagla.

## Innleiðing þegar gögn hafa verið samþykkt

`scripts/services.mjs` hefur `specialization: null` fyrir gluggaskipti og húsaklæðningar. Enginn staðgengilstexti, merki eða tómur kafli birtist á síðunum.

Eftir staðfestingu má setja hlut með `approved: true`, `label`, `title` og `paragraphs` (fylki samþykktra texta). Sameiginlegi byggirinn birtir þá hógværan editorial-kafla á viðkomandi þjónustusíðu, eftir staðfestum verkefnum og á undan spurningum. Nota stutta staðreyndamiðaða lýsingu og tilgreina skýrt hver veitti þjálfun/vottun. Samræma myndir sérstaklega þegar birtingarheimild liggur fyrir. Ekki bæta auglýsingakafla á forsíðu.

Keyra `npm run build` og `npm test`; yfirfara útlit í síma/tölvu og opna PR fyrir samþykki. `approved` er ritstjórnargátt, ekki sjálfvirk sannprófun á sannleiksgildi.
