<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePortfolioData } from '../composables/usePortfolioData'
import { pickLang } from '../i18n'

// Tuman nomi 3 tilli obyekt ({uz_latn, uz_cyrl, ru}) yoki string bo'lishi mumkin
function localizedName(name) {
  return typeof name === 'string' ? name : pickLang(name)
}

// Katta xarita ma'lumotlari — bundle'ga kirmaydi, runtime'da yuklanadi
const mapData = ref(null)
onMounted(async () => {
  const res = await fetch('/data/projectedMap.json')
  mapData.value = await res.json()
})

const COUNTRY_VIEWBOX = computed(() => mapData.value?.COUNTRY_VIEWBOX || '0 0 940 631')
const projectedRegions = computed(() => mapData.value?.regions || [])
const regionViewBoxes = computed(() => mapData.value?.regionViewBoxes || {})
const districtsByRegion = computed(() => mapData.value?.districtsByRegion || {})
const regionCentroids = computed(() => mapData.value?.regionCentroids || {})
const districtCentroids = computed(() => mapData.value?.districtCentroids || {})

// Joriy viewBox kengligi — markerlar va grid qadami uchun proporsional o'lcham.
// Country view (~940) va kichik viloyat (Surxondaryo ~139) o'rtasida 7x farq bor;
// markerlar bir xil ekran o'lchamida qolishi uchun radius viewBox ga proporsional.
function parseVbW(vb) {
  const p = (vb || '').split(/\s+/).map(Number)
  return p[2] || 940
}
const currentVbWidth = computed(() => {
  if (!selectedRegionKey.value) return parseVbW(COUNTRY_VIEWBOX.value)
  return parseVbW(regionViewBoxes.value[selectedRegionKey.value] || COUNTRY_VIEWBOX.value)
})
const markerRadius = computed(() => currentVbWidth.value * 0.005)
const markerGridStep = computed(() => currentVbWidth.value * 0.015)

const { t } = useI18n()
const {
  selectedRegionKey,
  selectedDistrictId,
  isDistrictView,
  currentPeople,
  genderFilter,
  searchQuery,
  selectRegion,
  selectDistrict,
  setDistrict,
  backToCountry,
  openPerson
} = usePortfolioData()

const hoveredName = ref('')
const hover = ref(null) // { x, y, type, name, count, men, women, sub }
const mapContainer = ref(null)

function setHover(e, payload) {
  if (!payload) {
    hover.value = null
    hoveredName.value = ''
    return
  }
  const rect = mapContainer.value?.getBoundingClientRect()
  const x = rect ? e.clientX - rect.left : 0
  const y = rect ? e.clientY - rect.top : 0
  hover.value = { ...payload, x, y }
  hoveredName.value = payload.name
}

function moveHover(e) {
  if (!hover.value) return
  const rect = mapContainer.value?.getBoundingClientRect()
  if (!rect) return
  hover.value.x = e.clientX - rect.left
  hover.value.y = e.clientY - rect.top
}

function countByRegion(regionId) {
  const list = peopleForMarkers.value.filter((p) => p.regionKey === regionId)
  return {
    total: list.length,
    men: list.filter((p) => p.gender === 'male').length,
    women: list.filter((p) => p.gender === 'female').length
  }
}

function countByDistrict(districtId) {
  const list = peopleForMarkers.value.filter((p) => p.districtId === districtId)
  return {
    total: list.length,
    men: list.filter((p) => p.gender === 'male').length,
    women: list.filter((p) => p.gender === 'female').length
  }
}

const peopleForMarkers = computed(() => {
  let list = currentPeople.value
  if (genderFilter.value !== 'all') {
    list = list.filter((p) => p.gender === genderFilter.value)
  }
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        (p.work?.position || '').toLowerCase().includes(q)
    )
  }
  return list
})

// Marker joylashishi har doim tuman markazida (bitta global Mercator koordinata
// tizimi — regions, districts va markerlar bir xil fazoda yashaydi). Shu sababli
// viloyatdan tumanga (yoki orqaga) o'tganda markerlar SVG da JOYIDA qoladi —
// faqat viewBox kattalashadi/kichrayadi. Markazlar_map loyihasidagi yondashuv.
function makeMarkers(list) {
  const STEP = markerGridStep.value

  const byKey = new Map()
  for (const p of list) {
    const key = p.districtId
    const center = districtCentroids.value[key]
    if (!center) continue
    if (!byKey.has(key)) byKey.set(key, { center, people: [] })
    byKey.get(key).people.push(p)
  }

  const out = []
  for (const { center, people } of byKey.values()) {
    const n = people.length
    if (n === 1) {
      out.push({ person: people[0], x: center.x, y: center.y })
      continue
    }
    const cols = Math.ceil(Math.sqrt(n))
    const rows = Math.ceil(n / cols)
    const offsetX = ((cols - 1) * STEP) / 2
    const offsetY = ((rows - 1) * STEP) / 2
    for (let i = 0; i < n; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      out.push({
        person: people[i],
        x: center.x - offsetX + col * STEP,
        y: center.y - offsetY + row * STEP
      })
    }
  }
  return out
}

const countryMarkers = computed(() => makeMarkers(peopleForMarkers.value))

const regionDistricts = computed(() => {
  if (!selectedRegionKey.value) return []
  return districtsByRegion.value[selectedRegionKey.value] || []
})

const regionViewBox = computed(() => {
  if (!selectedRegionKey.value) return COUNTRY_VIEWBOX.value
  return regionViewBoxes.value[selectedRegionKey.value] || COUNTRY_VIEWBOX.value
})

const regionMarkers = computed(() => {
  if (!selectedRegionKey.value) return []
  return makeMarkers(
    peopleForMarkers.value.filter(
      (p) => p.regionKey === selectedRegionKey.value
    )
  )
})

const regionOptions = computed(() =>
  Object.keys(districtsByRegion.value)
    .map((key) => ({ key, label: t(`regions.names.${key}`) }))
    .sort((a, b) => a.label.localeCompare(b.label))
)

const districtOptions = computed(() => {
  if (!selectedRegionKey.value) return []
  return districtsByRegion.value[selectedRegionKey.value] || []
})

function onRegionChange(value) {
  selectRegion(value || null)
}

function onDistrictChange(value) {
  setDistrict(value || null)
}
</script>

<template>
  <div
    class="lg:col-span-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col p-6 min-h-0"
  >
    <!-- Filter header: region + district -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 shrink-0">
      <div class="relative">
        <select
          :value="selectedRegionKey || ''"
          @change="onRegionChange($event.target.value)"
          class="w-full appearance-none bg-[#f0f4ff] border border-blue-100 text-brand-dark font-semibold text-sm pl-3 pr-9 py-2.5 rounded-lg cursor-pointer hover:bg-[#e6edff] focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-colors truncate"
        >
          <option value="">{{ t('filter.allRegions') }}</option>
          <option v-for="r in regionOptions" :key="r.key" :value="r.key">
            {{ r.label }}
          </option>
        </select>
        <svg
          class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M19 9l-7 7-7-7"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      </div>
      <div class="relative">
        <select
          :value="selectedDistrictId || ''"
          @change="onDistrictChange($event.target.value)"
          :disabled="!selectedRegionKey"
          class="w-full appearance-none bg-[#f0f4ff] border border-blue-100 text-brand-dark font-semibold text-sm pl-3 pr-9 py-2.5 rounded-lg cursor-pointer hover:bg-[#e6edff] focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-colors truncate disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#f0f4ff]"
        >
          <option value="">{{ t('filter.allDistricts') }}</option>
          <option v-for="d in districtOptions" :key="d.id" :value="d.id">
            {{ localizedName(d.name) }}
          </option>
        </select>
        <svg
          class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M19 9l-7 7-7-7"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      </div>
    </div>

    <!-- Map -->
    <div
      ref="mapContainer"
      class="flex-grow flex items-center justify-center relative bg-[#f9fafc] rounded-lg overflow-hidden p-4 min-h-0"
      @mouseleave="setHover(null, null)"
      @mousemove="moveHover"
    >
      <!-- Country view -->
      <svg
        v-if="!isDistrictView"
        :viewBox="COUNTRY_VIEWBOX"
        class="uz-map w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          v-for="region in projectedRegions"
          :key="region.id"
          class="region-group"
          @click="selectRegion(region.id)"
          @mouseenter="(e) => setHover(e, { type: 'region', name: t(`regions.names.${region.id}`), ...countByRegion(region.id) })"
          @mouseleave="setHover(null, null)"
        >
          <path
            v-for="(p, i) in region.paths"
            :key="i"
            :d="p"
            class="region-path"
          />
        </g>
        <g class="markers">
          <circle
            v-for="m in countryMarkers"
            :key="`m-${m.person.id}`"
            :cx="m.x"
            :cy="m.y"
            :r="markerRadius"
            class="person-marker"
            @click.stop="openPerson(m.person)"
            @mouseenter.stop="(e) => setHover(e, { type: 'person', name: m.person.fullName, sub: m.person.work?.position })"
            @mouseleave.stop="setHover(null, null)"
          />
        </g>
      </svg>

      <!-- Region view -->
      <svg
        v-else
        :viewBox="regionViewBox"
        class="uz-map w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          v-for="dist in regionDistricts"
          :key="dist.id"
          :d="dist.svgPath"
          class="region-path"
          :class="{ 'is-selected': dist.id === selectedDistrictId }"
          @click="selectDistrict(dist.id)"
          @mouseenter="(e) => setHover(e, { type: 'district', name: localizedName(dist.name), ...countByDistrict(dist.id) })"
          @mouseleave="setHover(null, null)"
        />
        <g class="markers">
          <circle
            v-for="m in regionMarkers"
            :key="`m-${m.person.id}`"
            :cx="m.x"
            :cy="m.y"
            :r="markerRadius"
            class="person-marker"
            @click.stop="openPerson(m.person)"
            @mouseenter.stop="(e) => setHover(e, { type: 'person', name: m.person.fullName, sub: m.person.work?.position })"
            @mouseleave.stop="setHover(null, null)"
          />
        </g>
      </svg>

      <!-- Hover tooltip — kursor yonida -->
      <div
        v-if="hover"
        :style="{ left: hover.x + 14 + 'px', top: hover.y + 14 + 'px' }"
        class="absolute z-20 bg-white shadow-xl border border-gray-200 rounded-lg px-3 py-2 pointer-events-none min-w-[140px] max-w-[280px]"
      >
        <div class="flex items-start gap-2">
          <span
            class="mt-1 inline-block w-2 h-2 rounded-full shrink-0"
            :class="{
              'bg-brand-primary': hover.type === 'region',
              'bg-emerald-500': hover.type === 'district',
              'bg-amber-500': hover.type === 'person'
            }"
          ></span>
          <div class="min-w-0">
            <div class="text-[13px] font-bold text-brand-dark leading-tight">
              {{ hover.name }}<template v-if="hover.type !== 'person'">:</template>
            </div>
            <!-- Region/District: erkak/ayol vakillar soni -->
            <div
              v-if="hover.type !== 'person' && hover.total > 0"
              class="mt-1 text-[11px] leading-snug"
            >
              <div class="text-brand-dark">
                {{ t('map.male') }}: <span class="font-semibold">{{ hover.men || 0 }}</span>
              </div>
              <div class="text-brand-dark">
                {{ t('map.female') }}: <span class="font-semibold">{{ hover.women || 0 }}</span>
              </div>
            </div>
            <div
              v-else-if="hover.type !== 'person'"
              class="mt-0.5 text-[11px] text-brand-muted italic"
            >
              {{ t('map.noPeople') }}
            </div>
            <!-- Person: lavozim -->
            <div
              v-if="hover.type === 'person' && hover.sub"
              class="mt-0.5 text-[11px] text-brand-muted truncate"
            >
              {{ hover.sub }}
            </div>
          </div>
        </div>
      </div>

      <!-- Back to country map -->
      <button
        v-if="isDistrictView"
        type="button"
        @click="backToCountry"
        class="absolute bottom-3 right-3 flex items-center gap-2 bg-white text-brand-dark text-sm font-medium pl-4 pr-3 py-2 rounded-lg border border-gray-200 shadow-sm hover:bg-[#f0f4ff] hover:text-brand-primary transition-colors"
      >
        {{ t('map.back') }}
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M15 19l-7-7 7-7"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.uz-map {
  max-width: 100%;
  max-height: 100%;
}

.region-path {
  fill: #a8b8d2;
  stroke: #ffffff;
  stroke-width: 0.8;
  vector-effect: non-scaling-stroke;
  stroke-linejoin: round;
  cursor: pointer;
  transition: fill 0.18s ease;
}

.region-group:hover .region-path,
.region-path:hover {
  fill: #6f93ff;
}

.region-path.is-selected {
  fill: #4775ff;
}

.person-marker {
  fill: #4775ff;
  stroke: #ffffff;
  stroke-width: 0.6;
  vector-effect: non-scaling-stroke;
  cursor: pointer;
  transition: fill 0.15s ease;
}

.person-marker:hover {
  fill: #f59e0b;
}
</style>
