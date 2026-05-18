/**
 * Geo → SVG Mercator proyeksiya
 *
 * GeoJSON koordinatalarini (lat/lng) to'g'ridan-to'g'ri SVG koordinatalariga o'giradi.
 * Bitta proyeksiya funksiyasi — ham chegaralar, ham markerlar uchun.
 *
 * PADDING va CANVAS_WIDTH parametrlari asosida barcha koordinatalar
 * SVG viewBox ichiga joylashadi.
 */

const DEG2RAD = Math.PI / 180

// Butun O'zbekiston GeoJSON ning Mercator chegaralari (oldindan hisoblangan)
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

/** Mercator proyeksiya: lat/lng → SVG (x, y) */
export function projectPoint(lat, lng) {
  const mx = lng * DEG2RAD
  const my = Math.log(Math.tan(Math.PI / 4 + (lat * DEG2RAD) / 2))
  return {
    x: PADDING + (mx - MERC_MIN_X) * SCALE,
    y: PADDING + (MERC_MAX_Y - my) * SCALE,  // Y teskari (SVG da yuqori = 0)
  }
}

/** Butun O'zbekiston uchun viewBox */
export const COUNTRY_VIEWBOX = `0 0 ${CANVAS_WIDTH + PADDING * 2} ${Math.round(CANVAS_HEIGHT) + PADDING * 2}`

/**
 * GeoJSON geometry ni SVG path string ga o'girish
 */
export function geometryToPath(geometry) {
  const polygons = geometry.type === 'MultiPolygon'
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

/** Teskari proyeksiya: SVG (x, y) → lat/lng */
export function inverseProject(svgX, svgY) {
  const mx = (svgX - PADDING) / SCALE + MERC_MIN_X
  const my = MERC_MAX_Y - (svgY - PADDING) / SCALE
  const lng = mx / DEG2RAD
  const lat = (2 * Math.atan(Math.exp(my)) - Math.PI / 2) / DEG2RAD
  return { lat, lng }
}

/**
 * OpenStreetMap tile plitkalari hisoblash
 * viewBox asosida kerakli tilelarni aniqlaydi
 */
export function computeTiles(viewBox) {
  const [vx, vy, vw, vh] = viewBox.split(' ').map(Number)

  const topLeft = inverseProject(vx, vy)
  const bottomRight = inverseProject(vx + vw, vy + vh)

  // Zoom darajasini viewBox kengligiga qarab tanlash (HD uchun +1 baland)
  const lngSpan = bottomRight.lng - topLeft.lng
  let zoom
  if (lngSpan > 12) zoom = 6
  else if (lngSpan > 6) zoom = 7
  else if (lngSpan > 3) zoom = 8
  else if (lngSpan > 1.5) zoom = 9
  else if (lngSpan > 0.7) zoom = 10
  else if (lngSpan > 0.3) zoom = 11
  else zoom = 12

  const n = Math.pow(2, zoom)

  function lngToTileX(lng) { return Math.floor((lng + 180) / 360 * n) }
  function latToTileY(lat) {
    const r = lat * DEG2RAD
    return Math.floor((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * n)
  }
  function tileToLng(x) { return x / n * 360 - 180 }
  function tileToLat(y) {
    const nPI = Math.PI * (1 - 2 * y / n)
    return (Math.atan(Math.sinh(nPI))) / DEG2RAD
  }

  const xMin = lngToTileX(topLeft.lng)
  const xMax = lngToTileX(bottomRight.lng)
  const yMin = latToTileY(topLeft.lat)
  const yMax = latToTileY(bottomRight.lat)

  const tiles = []
  for (let tx = xMin; tx <= xMax; tx++) {
    for (let ty = yMin; ty <= yMax; ty++) {
      const tileTL = projectPoint(tileToLat(ty), tileToLng(tx))
      const tileBR = projectPoint(tileToLat(ty + 1), tileToLng(tx + 1))
      tiles.push({
        url: `https://tile.openstreetmap.org/${zoom}/${tx}/${ty}.png`,
        x: tileTL.x,
        y: tileTL.y,
        width: tileBR.x - tileTL.x,
        height: tileBR.y - tileTL.y,
      })
    }
  }
  return tiles
}

/**
 * Feature massivi uchun viewBox hisoblash (proporsional padding bilan)
 * Kichik viloyatlar uchun padding avtomatik kamayadi — shaklning 30% dan oshmasligi kafolatlanadi.
 */
export function computeViewBox(features, pad = PADDING) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity

  for (const f of features) {
    const geom = f.geometry
    const polygons = geom.type === 'MultiPolygon'
      ? geom.coordinates : [geom.coordinates]

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

  // Kichik viloyatlar uchun padding proporsional: shaklning 30% dan oshmasin
  const shapeSize = Math.min(maxX - minX, maxY - minY)
  const effectivePad = Math.min(pad, Math.max(3, shapeSize * 0.3))

  return `${minX - effectivePad} ${minY - effectivePad} ${maxX - minX + effectivePad * 2} ${maxY - minY + effectivePad * 2}`
}
