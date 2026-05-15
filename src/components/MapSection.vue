<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  COUNTRY_VIEWBOX,
  regions as projectedRegions,
  regionViewBoxes,
  districtsByRegion
} from '../data/projectedMap'
import { projectPoint } from '../utils/geoProjection'
import { DISTRICT_GEO_CENTROIDS } from '../data/districtGeoCentroids'
import { usePortfolioData } from '../composables/usePortfolioData'

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

function makeMarkers(list) {
  const out = []
  for (const p of list) {
    const c = DISTRICT_GEO_CENTROIDS[p.districtId]
    if (!c) continue
    const pos = projectPoint(c.lat, c.lng)
    out.push({ person: p, x: pos.x, y: pos.y })
  }
  return out
}

const countryMarkers = computed(() => makeMarkers(peopleForMarkers.value))

const regionDistricts = computed(() => {
  if (!selectedRegionKey.value) return []
  return districtsByRegion[selectedRegionKey.value] || []
})

const regionViewBox = computed(() => {
  if (!selectedRegionKey.value) return COUNTRY_VIEWBOX
  return regionViewBoxes[selectedRegionKey.value] || COUNTRY_VIEWBOX
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
  Object.keys(districtsByRegion)
    .map((key) => ({ key, label: t(`regions.names.${key}`) }))
    .sort((a, b) => a.label.localeCompare(b.label))
)

const districtOptions = computed(() => {
  if (!selectedRegionKey.value) return []
  return districtsByRegion[selectedRegionKey.value] || []
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
            {{ d.name }}
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
      class="flex-grow flex items-center justify-center relative bg-[#f9fafc] rounded-lg overflow-hidden p-4 min-h-0"
      @mouseleave="hoveredName = ''"
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
          @mouseenter="hoveredName = t(`regions.names.${region.id}`)"
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
            r="3"
            class="person-marker"
            @click.stop="openPerson(m.person)"
            @mouseenter="hoveredName = m.person.fullName"
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
          @mouseenter="hoveredName = dist.name"
        />
        <g class="markers">
          <circle
            v-for="m in regionMarkers"
            :key="`m-${m.person.id}`"
            :cx="m.x"
            :cy="m.y"
            r="2.6"
            class="person-marker"
            @click.stop="openPerson(m.person)"
            @mouseenter="hoveredName = m.person.fullName"
          />
        </g>
      </svg>

      <!-- Hover label -->
      <div
        v-if="hoveredName"
        class="absolute bottom-3 left-3 bg-brand-dark text-white text-xs font-medium px-2.5 py-1.5 rounded-md shadow pointer-events-none"
      >
        {{ hoveredName }}
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
