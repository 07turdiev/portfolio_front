// Build-time script: reads the 21MB Uzbekistan GeoJSON, applies the same
// Mercator projection used by src/utils/geoProjection.js, and emits a small
// src/data/projectedMap.js with pre-computed projected paths. The browser
// bundle never ships the raw GeoJSON.
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const here = dirname(fileURLToPath(import.meta.url))
const GEOJSON_PATH = join(here, '../../data/geojson/uzbekistan.geojson')
const OUT_JSON = join(here, '../public/data/projectedMap.json')
// Tuman nomlari (3 til) — backenddagi rasmiy nomlar
const DISTRICT_NAMES_PATH = join(here, '../../portfolio_back/core/data/district_names.json')

// ───────── Mercator projection (must match src/utils/geoProjection.js) ─────────
const DEG2RAD = Math.PI / 180
const MERC_MIN_X = 0.977326
const MERC_MAX_X = 1.276399
const MERC_MIN_Y = 0.700021
const MERC_MAX_Y = 0.896391
const CANVAS_WIDTH = 900
const PADDING = 20
const RANGE_X = MERC_MAX_X - MERC_MIN_X
const RANGE_Y = MERC_MAX_Y - MERC_MIN_Y
const SCALE = CANVAS_WIDTH / RANGE_X
const CANVAS_HEIGHT = RANGE_Y * SCALE

function projectPoint(lat, lng) {
  const mx = lng * DEG2RAD
  const my = Math.log(Math.tan(Math.PI / 4 + (lat * DEG2RAD) / 2))
  return {
    x: PADDING + (mx - MERC_MIN_X) * SCALE,
    y: PADDING + (MERC_MAX_Y - my) * SCALE
  }
}

const COUNTRY_VIEWBOX = `0 0 ${CANVAS_WIDTH + PADDING * 2} ${Math.round(CANVAS_HEIGHT) + PADDING * 2}`

function geometryToPath(geometry) {
  const polygons =
    geometry.type === 'MultiPolygon'
      ? geometry.coordinates
      : [geometry.coordinates]
  const parts = []
  for (const polygon of polygons) {
    for (const ring of polygon) {
      const pts = ring.map(([lng, lat]) => {
        const { x, y } = projectPoint(lat, lng)
        return `${x.toFixed(1)},${y.toFixed(1)}`
      })
      parts.push('M' + pts.join('L') + 'Z')
    }
  }
  return parts.join(' ')
}

function computeViewBox(features, pad = PADDING) {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const f of features) {
    const polygons =
      f.geometry.type === 'MultiPolygon'
        ? f.geometry.coordinates
        : [f.geometry.coordinates]
    for (const polygon of polygons) {
      for (const ring of polygon) {
        for (const [lng, lat] of ring) {
          const { x, y } = projectPoint(lat, lng)
          if (x < minX) minX = x
          if (x > maxX) maxX = x
          if (y < minY) minY = y
          if (y > maxY) maxY = y
        }
      }
    }
  }
  const shapeSize = Math.min(maxX - minX, maxY - minY)
  const effectivePad = Math.min(pad, Math.max(3, shapeSize * 0.3))
  return `${(minX - effectivePad).toFixed(1)} ${(minY - effectivePad).toFixed(1)} ${(maxX - minX + effectivePad * 2).toFixed(1)} ${(maxY - minY + effectivePad * 2).toFixed(1)}`
}

// ───────── Shape → SVG ID mapping (from data/geoJsonData.js) ─────────
const SHAPE_TO_SVG = {
  // Andijon
  'Altinkul': 'an-olt', 'Andijan': 'an-and', 'Balikchi': 'an-baliq',
  "Bo'ston": 'an-boz', 'Bulakbashi': 'an-bul', 'Djalalkuduk': 'an-jal',
  'Izboskan': 'an-izb', 'Ulugnar': 'an-ulug', 'Kurgantepa': 'an-qur',
  'Asaka': 'an-asa', 'Markhamat': 'an-mar', 'Shakhrixan': 'an-shax',
  'Paxtaabad': 'an-pax', 'Khadjaabad': 'an-xoj',
  'Andijan city': 'an-and-sh', 'Khanabad city': 'an-xon-sh',
  // Buxoro
  'Alat': 'bu-olot', 'Bukhara': 'bu-bux', 'Vabkent': 'bu-vob',
  'Gijduvan': 'bu-gij', 'Kagan': 'bu-kog', 'Karakul': 'bu-qor-k',
  'Peshku': 'bu-pesh', 'Rаmitan': 'bu-rom', 'Jondor': 'bu-jon',
  'Shafirkan': 'bu-shof', 'Bukhara city': 'bu-bux-sh', 'Kagan city': 'bu-kog-sh',
  'Karaulbazar': 'bu-qor',
  // Jizzax
  'Arnasay': 'jiz-arn', 'Bakhmal': 'jiz-bax', 'Gallyaaral': 'jiz-g-al',
  'Sharof Rashidov': 'jiz-shar', 'Dustlik': 'jiz-dos', 'Zaаmin': 'jiz-zom',
  'Zarbdar': 'jiz-zarb', 'Mirzachul': 'jiz-mir', 'Zafarabad': 'jiz-zaf',
  'Paxtakor': 'jiz-pax', 'Farish': 'jiz-for', 'Yangiabad': 'jiz-yan',
  'Dzhizak city': 'jiz-jiz-sh',
  // Qashqadaryo
  'Guzar': 'qash-g`uz', 'Dehkanabad': 'qash-dex', 'Kamashi': 'qash-kam',
  'Karshi': 'qash-qash', 'Kasan': 'qash-kos', 'Kitab': 'qash-kit',
  'Mirishkar': 'qash-mir', 'Mubarek': 'qash-mub', 'Nishan': 'qash-nish',
  'Kasbi': 'qash-kas', 'Chirakchi': 'qash-chir', 'Shakhrisabz': 'qash-sh-tu',
  'Yakkabag': 'qash-yak', 'Karshi city': 'qash-qarsh', 'Shakhrisabz city': 'qash-shax',
  "Ko'kdala": 'qash-kok',
  // Navoiy
  'Kanimekh': 'nav-kon', 'Kiziltepa': 'nav-qiz', 'Navbakhor': 'nav-nov',
  'Karmana': 'nav-kar', 'Nurata': 'nav-nur', 'Tamdi': 'nav-tom',
  'Uchkuduk': 'nav-uchq', 'Khatirchi': 'nav-xat',
  'Navoi city': 'nav-nav-sh', 'Zarafshan city': 'nav-zar-sh',
  'Gazgan city': 'nav-Gazgan',
  // Namangan
  'Mingbulak': 'nam-ming', 'Kasansay': 'nam-kos', 'Namangan': 'nam-nam',
  'Narin': 'nam-nor', 'Pap': 'nam-pop', 'Turakurgan': 'nam-tur',
  'Uychi': 'nam-uych', 'Uchkurgan': 'nam-uchq', 'Chartak': 'nam-chor',
  'Chust': 'nam-chus', 'Yangikurgan': 'nam-yan', 'Namangan city': 'nam-nam_sh',
  'Yangi Namangan': 'nam-y-nam', 'Davlatobod': 'nam-dav',
  // Samarqand
  'Akdarya': 'sam-oqd', 'Bulungur': 'sam-bul', 'Dzhambay': 'sam-jom',
  'Ishtikhan': 'sam-isht', 'Kattakurgan': 'sam-kat', 'Koshrabad': 'sam-qosh',
  'Narpay': 'sam-nar', 'Payarik': 'sam-pay', 'Pastdargom': 'sam-past',
  'Pakhtachi': 'sam-pax', 'Samarkand': 'sam-sam', 'Nurabad': 'sam-nur',
  'Urgut': 'sam-urg', 'Taylak': 'sam-toy',
  'Samarkand city': 'sam-sam-sh', 'Kattakurgan city': 'sam-katgsh',
  // Surxondaryo
  'Altinsay': 'sur-olt', 'Angor': 'sur-ang', 'Bandikhan': 'sur-ban',
  'Baysun': 'sur-boy', 'Muzrabad': 'sur-muz', 'Denau': 'sur-den',
  'Dzharkurgan': 'sur-jar', 'Kumkurgan': 'sur-qum', 'Kizirik': 'sur-qiz',
  'Sariasiya': 'sur-sar', 'Termez': 'sur-ter', 'Uzun': 'sur-uzu',
  'Sherabad': 'sur-sher', 'Shurchi': 'sur-sho`r', 'Termez city': 'sur-ter-sh',
  // Sirdaryo
  'Akaltin': 'sir-oqolt', 'Bayaut': 'sir-boy', 'Saykhunabad': 'sir-say',
  'Gulistan': 'sir-gul', 'Sardoba': 'sir-sar', 'Mirzaabad': 'sir-mir',
  'Sirdarya': 'sir-sir', 'Khavas': 'sir-xov',
  'Gulistan city': 'sr-gul-sh', 'Shirin city': 'sr-shir-sh', 'Yangiyer city': 'sr-yangi-s',
  // Toshkent shahri
  'Uchtepa': 'tsh-ucht', 'Bektemir': 'tsh-bek', 'Yunusabad': 'tsh-yun',
  'Mirzo Ulugbek': 'tsh-mirz', 'Mirabad': 'tsh-mir', 'Shaykhantokhur': 'tsh-shay',
  'Almazar': 'tsh-olm', 'Sergeli': 'tsh-ser', 'Yakkasaray': 'tsh-yak',
  'Yashnobod': 'tsh-yash', 'Chilanzar': 'tsh-chil',
  'Yangi Toshkent': 'tsh-y-tosh', 'Yangi hayot': 'tsh-y-hay',
  // Toshkent viloyati
  'Akkurgan': 'tosh-oqqr', 'Akhangaran': 'tosh-axan', 'Bekabad': 'tosh-bek',
  'Bostanlik': 'tosh-bos', 'Buka': 'tosh-buk', 'Kuyichirchik': 'tosh-quych',
  'Zangiata': 'tosh-zan', 'Yukarichirchik': 'tosh-yuqch',
  'Parkent': 'tosh-par', 'Pskent': 'tosh-pis', 'Chinaz': 'tosh-chin',
  'Urtachirchik': 'tosh-orch', 'Yangiyul': 'tosh-yan',
  'Kibray': 'tosh-kib',
  'Almalik city': 'tosh-olm-sh', 'Akhangaran city': 'tosh-axan-s',
  'Angren city': 'tosh-ang-sh', 'Bekabad city': 'tosh-bek-sh',
  'Chirchik city': 'tosh-chir-s', 'Yangiyul city': 'tosh-yan-sh',
  'Nurafshon city': 'tosh-nur-sh',
  // Fargona
  'Altyarik': 'far-olt', 'Altiarik': 'far-olt',
  'Bagdad': 'far-bag', 'Beshariq': 'far-besh', 'Besharik': 'far-besh',
  'Buvayda': 'far-buv', 'Dangara': 'far-dan', 'Yazyavan': 'far-yoz',
  'Kuva': 'far-quv', 'Kushtepa': 'far-qush', 'Rishtan': 'far-rish',
  'Sokh': 'far-sox', 'Toshlak': 'far-tosh', 'Tashlak': 'far-tosh',
  'Uchkuprik': 'far-uchk',
  'Uzbekistan': 'far-ozb', 'Fergana': 'far-far', 'Furkat': 'far-fur',
  'Fergana city': 'far-far-sh', 'Kuvasay city': 'far-quv-sh',
  'Margilan city': 'far-mar-sh', 'Kokand city': 'far-qoq-sh',
  // Xorazm
  'Bagat': 'xor-bog', 'Gurlan': 'xor-gur', 'Gurlen': 'xor-gur',
  'Khazarasp': 'xor-xaz', 'Khanka': 'xor-xon', 'Khiva': 'xor-xiv',
  'Kushkupir': 'xor-qush', 'Koshkupir': 'xor-qush',
  'Urgench': 'xor-urg', 'Shavat': 'xor-shav',
  'Yangiarik': 'xor-yan', 'Yangibazar': 'xor-yangib',
  'Tuprokkala': 'xor-tup',
  'Urgench city': 'xor-urg-sh', 'Khiva city': 'xor-xiv-sh',
  // Qoraqalpog'iston
  'Amudarya': 'qr-amu', 'Beruniy': 'qr-ber', 'Buzatau': 'qr-buz',
  'Karauzyak': 'qr-qor', 'Kegeyli': 'qr-keg', 'Kungrad': 'qr-qun',
  'Kanlikul': 'qr-qon', 'Muynak': 'qr-moy', 'Nukus': 'qr-nuk',
  'Takhiatash': 'qr-taxi-sh', 'Takhtakupir': 'qr-tax', 'Turtkul': 'qr-tur',
  'Khojeyli': 'qr-xoj', 'Chimbay': 'qr-chim', 'Shumanay': 'qr-shum',
  'Ellikkala': 'qr-ellik', 'Nukus city': 'qr-nuk-sh'
}

function getRegionFromSvgId(svgId) {
  const p = svgId.split('-')[0]
  const map = {
    an: 'andijon', bu: 'buxoro', jiz: 'jizzax', qash: 'qashqadaryo',
    nav: 'navoiy', nam: 'namangan', sam: 'samarqand', sur: 'surxondaryo',
    sir: 'sirdaryo', sr: 'sirdaryo', tsh: 'toshkent-shahri',
    tosh: 'toshkent-viloyati', far: 'fargona', xor: 'xorazm', qr: 'qoraqalpogiston'
  }
  return map[p] || null
}

// ───────── 3 tilli tuman nomlari (backend district_names.json) ─────────
// Format: { "1703209": { slug: "an-boz", uz_latn: "Bo'ston tumani", uz_cyrl: "Бўстон тумани", ru: "Бозский район" }, ... }
// Slug — svgId bilan bir xil ("an-boz" = svgId)
let districtNamesBySlug = {}
try {
  const districtNames = JSON.parse(readFileSync(DISTRICT_NAMES_PATH, 'utf-8'))
  for (const v of Object.values(districtNames)) {
    if (v?.slug) districtNamesBySlug[v.slug] = v
  }
  console.log(`Loaded ${Object.keys(districtNamesBySlug).length} district names (3-lang)`)
} catch (e) {
  console.warn(`District names JSON yo'q (${DISTRICT_NAMES_PATH}); ingliz nomlardan foydalanamiz`)
}

// ───────── Build ─────────
console.log('Reading GeoJSON...')
const geoJsonRaw = JSON.parse(readFileSync(GEOJSON_PATH, 'utf-8'))

const featuresByRegion = {}
const districtNameMap = {}

for (const feature of geoJsonRaw.features) {
  const shapeName = feature.properties.shapeName
  const svgId = SHAPE_TO_SVG[shapeName]
  if (!svgId) continue
  const regionId = getRegionFromSvgId(svgId)
  if (!regionId) continue
  const processed = {
    svgId,
    regionId,
    shapeName,
    svgPath: geometryToPath(feature.geometry),
    geometry: feature.geometry
  }
  districtNameMap[svgId] = shapeName
  if (!featuresByRegion[regionId]) featuresByRegion[regionId] = []
  featuresByRegion[regionId].push(processed)
}

const districtsByRegion = {}
const regionViewBoxes = {}
for (const [regionId, feats] of Object.entries(featuresByRegion)) {
  regionViewBoxes[regionId] = computeViewBox(feats)
  districtsByRegion[regionId] = feats.map((f) => {
    const localized = districtNamesBySlug[f.svgId]
    // name = 3 tilli obyekt. Agar topilmasa, fallback sifatida ingliz shapeName
    const name = localized
      ? { uz_latn: localized.uz_latn, uz_cyrl: localized.uz_cyrl, ru: localized.ru }
      : { uz_latn: f.shapeName, uz_cyrl: f.shapeName, ru: f.shapeName }
    return {
      id: f.svgId,
      name,
      svgPath: f.svgPath
    }
  })
}

const regions = Object.entries(featuresByRegion).map(([regionId, feats]) => ({
  id: regionId,
  paths: feats.map((f) => f.svgPath)
}))

const output = {
  COUNTRY_VIEWBOX,
  regions,
  regionViewBoxes,
  districtsByRegion,
  districtNameMap
}

mkdirSync(dirname(OUT_JSON), { recursive: true })

// public/data/projectedMap.json — runtime fetch (bundle'ga kirmaydi, build tez)
writeFileSync(OUT_JSON, JSON.stringify({
  COUNTRY_VIEWBOX: output.COUNTRY_VIEWBOX,
  regions: output.regions,
  regionViewBoxes: output.regionViewBoxes,
  districtsByRegion: output.districtsByRegion
}))

const totalDistricts = Object.values(featuresByRegion).reduce(
  (s, arr) => s + arr.length,
  0
)
console.log(
  `Wrote ${OUT_JSON} — regions=${regions.length}, districts=${totalDistricts}`
)
