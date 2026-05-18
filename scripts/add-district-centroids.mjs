// Adds a `centroid: { x, y }` field to each district in
// public/api/districts/<region>.json, computed as the SVG-path bounding-box
// midpoint. District paths in this project use absolute (M/L/...) commands,
// so this is accurate enough for marker placement.
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const here = dirname(fileURLToPath(import.meta.url))
const DISTRICTS_DIR = join(here, '../public/api/districts')

function pathBboxCentroid(d) {
  const nums = d.match(/-?\d*\.?\d+/g) || []
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = parseFloat(nums[i])
    const y = parseFloat(nums[i + 1])
    if (!isFinite(x) || !isFinite(y)) continue
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  if (!isFinite(minX)) return { x: 0, y: 0 }
  return {
    x: Math.round((minX + maxX) * 100) / 200,
    y: Math.round((minY + maxY) * 100) / 200
  }
}

const files = readdirSync(DISTRICTS_DIR).filter((f) => f.endsWith('.json'))
for (const file of files) {
  const fullPath = join(DISTRICTS_DIR, file)
  const data = JSON.parse(readFileSync(fullPath, 'utf-8'))
  data.districts = data.districts.map((d) => ({
    id: d.id,
    name: d.name,
    path: d.path,
    centroid: pathBboxCentroid(d.path)
  }))
  writeFileSync(fullPath, JSON.stringify(data))
  console.log(`${file}: ${data.districts.length} districts updated`)
}
