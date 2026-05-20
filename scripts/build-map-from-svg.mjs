/**
 * Build map data from hand-drawn SVG sources (Markazlar_map projektidan ko'chirilgan).
 *
 * Manbalar:
 *   scripts/source-maps/regions.svg          — 14 viloyat (mamlakat ko'rinishi)
 *   scripts/source-maps/districts/<reg>.svg  — har bir viloyatdagi tumanlar
 *   ../portfolio_back/core/data/district_names.json — 3 tilli tuman nomlari
 *
 * Output:
 *   public/data/projectedMap.json — frontend runtime'da fetch qiladi
 *
 * Foydalanish:
 *   node scripts/build-map-from-svg.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const here = dirname(fileURLToPath(import.meta.url))
const REGIONS_SVG = join(here, 'source-maps/regions.svg')
const DISTRICTS_DIR = join(here, 'source-maps/districts')
const DISTRICT_NAMES_PATH = join(here, '../../portfolio_back/core/data/district_names.json')
const OUT_JSON = join(here, '../public/data/projectedMap.json')

// ─── SVG region id (regions.svg) → region slug (frontend) ─────────────────
const REGION_SVG_ID_TO_SLUG = {
  'uz-an': 'andijon',
  'uz-bu': 'buxoro',
  'uz-ji': 'jizzax',
  'uz-qa': 'qashqadaryo',
  'uz-nw': 'navoiy',
  'uz-ng': 'namangan',
  'uz-sa': 'samarqand',
  'uz-su': 'surxondaryo',
  'uz-si': 'sirdaryo',
  'uz-to': 'toshkent-viloyati',
  'uz-fa': 'fargona',
  'uz-xo': 'xorazm',
  'uz-qr': 'qoraqalpogiston',
  'uz-tk': 'toshkent-shahri',
}

// ─── districts/{file}.svg → region slug ──────────────────────────────────
const SVG_FILE_TO_REGION = {
  'andijon.svg': 'andijon',
  'buxoro.svg': 'buxoro',
  'jizzax.svg': 'jizzax',
  'qashqadaryo.svg': 'qashqadaryo',
  'navoiy.svg': 'navoiy',
  'namangan.svg': 'namangan',
  'samarqand.svg': 'samarqand',
  'surxondaryo.svg': 'surxondaryo',
  'sirdaryo.svg': 'sirdaryo',
  'toshkent-v.svg': 'toshkent-viloyati',
  'fargona.svg': 'fargona',
  'xorazm.svg': 'xorazm',
  'QQR.svg': 'qoraqalpogiston',
  'toshkent-sh.svg': 'toshkent-shahri',
}

// ─── SVG parse yordamchi funksiyalari ─────────────────────────────────────
function parseAttr(s, name) {
  // Atribut nomi bo'sh joy yoki tag boshidan keyin kelishi shart
  // (aks holda "aria-checked" ichidagi "d=" ham mos kelib qoladi)
  const re = new RegExp(`(?:^|\\s)${name}="([^"]*)"`)
  const m = re.exec(s)
  return m ? m[1] : ''
}

function getViewBox(svgText) {
  const m = /<svg[^>]*viewBox="([^"]+)"/.exec(svgText)
  return m ? m[1] : '0 0 1000 1000'
}

function getPaths(svgText) {
  // Har bir <path .../> tagini ushlash
  const result = []
  const re = /<path\s+([^/>]+?)\s*\/?>/g
  let m
  while ((m = re.exec(svgText)) !== null) {
    const attrs = m[1]
    const id = parseAttr(attrs, 'id')
    const name = parseAttr(attrs, 'name') || parseAttr(attrs, 'aria-label')
    const d = parseAttr(attrs, 'd')
    if (d) result.push({ id, name, d })
  }
  return result
}

// SVG path'ning bounding box markazini hisoblaydi.
// To'liq path parser: relative (kichik harflar) va absolute (katta harflar) komandalarni
// hisobga oladi, joriy pozitsiyani kuzatib boradi. Centroid = (min+max)/2 (bbox center).
function pathCentroid(d) {
  const re = /[a-zA-Z]|-?\d*\.?\d+(?:e[+-]?\d+)?/g
  const tokens = []
  let m
  while ((m = re.exec(d)) !== null) tokens.push(m[0])

  let cx = 0, cy = 0           // joriy pozitsiya
  let sx = 0, sy = 0           // subpath boshlanish nuqtasi (Z uchun)
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity

  const bb = (x, y) => {
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }

  let i = 0
  let cmd = null
  while (i < tokens.length) {
    const t = tokens[i]
    if (/[a-zA-Z]/.test(t)) {
      cmd = t
      i++
      continue
    }
    if (!cmd) { i++; continue }
    const isAbs = cmd >= 'A' && cmd <= 'Z'
    const c = cmd.toLowerCase()
    const num = (k) => parseFloat(tokens[i + k])

    switch (c) {
      case 'm':
      case 'l': {
        const x = num(0), y = num(1)
        if (isAbs) { cx = x; cy = y } else { cx += x; cy += y }
        if (c === 'm') { sx = cx; sy = cy; cmd = isAbs ? 'L' : 'l' }
        bb(cx, cy); i += 2; break
      }
      case 'h': {
        const x = num(0)
        if (isAbs) cx = x; else cx += x
        bb(cx, cy); i += 1; break
      }
      case 'v': {
        const y = num(0)
        if (isAbs) cy = y; else cy += y
        bb(cx, cy); i += 1; break
      }
      case 'c': {
        const x = num(4), y = num(5)
        if (isAbs) { cx = x; cy = y } else { cx += x; cy += y }
        bb(cx, cy); i += 6; break
      }
      case 's':
      case 'q': {
        const x = num(2), y = num(3)
        if (isAbs) { cx = x; cy = y } else { cx += x; cy += y }
        bb(cx, cy); i += 4; break
      }
      case 't': {
        const x = num(0), y = num(1)
        if (isAbs) { cx = x; cy = y } else { cx += x; cy += y }
        bb(cx, cy); i += 2; break
      }
      case 'a': {
        const x = num(5), y = num(6)
        if (isAbs) { cx = x; cy = y } else { cx += x; cy += y }
        bb(cx, cy); i += 7; break
      }
      case 'z': {
        cx = sx; cy = sy; break
      }
      default:
        i++
    }
  }

  if (minX === Infinity) return null
  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 }
}

// ─── 3 tilli tuman nomlari ───────────────────────────────────────────────
let districtNamesBySlug = {}
try {
  const districtNames = JSON.parse(readFileSync(DISTRICT_NAMES_PATH, 'utf-8'))
  for (const v of Object.values(districtNames)) {
    if (v?.slug) districtNamesBySlug[v.slug] = v
  }
  console.log(`Loaded ${Object.keys(districtNamesBySlug).length} district names (3-lang)`)
} catch (e) {
  console.warn(`district_names.json yo'q: ${e.message}`)
}

// ─── Mamlakat (regions.svg) ──────────────────────────────────────────────
console.log('Reading regions.svg...')
const regionsSvg = readFileSync(REGIONS_SVG, 'utf-8')
const countryViewBox = getViewBox(regionsSvg)
const regionPaths = getPaths(regionsSvg)

const regions = []
const regionCentroids = {}
for (const p of regionPaths) {
  const slug = REGION_SVG_ID_TO_SLUG[p.id]
  if (!slug) {
    console.warn(`Unknown region id: ${p.id}`)
    continue
  }
  regions.push({ id: slug, paths: [p.d] })
  const c = pathCentroid(p.d)
  if (c) regionCentroids[slug] = c
}
console.log(`Regions: ${regions.length} parsed`)

// ─── Tumanlar (districts/*.svg) ──────────────────────────────────────────
const districtsByRegion = {}
const regionViewBoxes = {}
const districtCentroids = {} // slug → {x, y} (region-svg space)

for (const file of readdirSync(DISTRICTS_DIR)) {
  const regionSlug = SVG_FILE_TO_REGION[file]
  if (!regionSlug) {
    console.warn(`Unknown district SVG file: ${file}`)
    continue
  }
  const svgText = readFileSync(join(DISTRICTS_DIR, file), 'utf-8')
  regionViewBoxes[regionSlug] = getViewBox(svgText)
  const paths = getPaths(svgText)
  districtsByRegion[regionSlug] = paths.map((p) => {
    const slug = p.id
    const localized = districtNamesBySlug[slug]
    const name = localized
      ? { uz_latn: localized.uz_latn, uz_cyrl: localized.uz_cyrl, ru: localized.ru }
      : { uz_latn: p.name || slug, uz_cyrl: p.name || slug, ru: p.name || slug }
    const c = pathCentroid(p.d)
    if (c) districtCentroids[slug] = c
    return { id: slug, name, svgPath: p.d, centroid: c }
  })
  console.log(`${file} (${regionSlug}): ${paths.length} districts`)
}

// ─── Output ──────────────────────────────────────────────────────────────
const output = {
  COUNTRY_VIEWBOX: countryViewBox,
  regions,
  regionViewBoxes,
  regionCentroids,     // region slug → {x, y} (regions.svg space)
  districtsByRegion,
  districtCentroids,   // district slug → {x, y} (per-region SVG space)
}

mkdirSync(dirname(OUT_JSON), { recursive: true })
writeFileSync(OUT_JSON, JSON.stringify(output))

const totalDistricts = Object.values(districtsByRegion).reduce((s, arr) => s + arr.length, 0)
console.log(`\nWrote ${OUT_JSON}`)
console.log(`  Country viewBox: ${countryViewBox}`)
console.log(`  Regions: ${regions.length}, Districts: ${totalDistricts}`)
