<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { REGIONS, REGION_VIEWBOX } from '../data/uzbekistanRegions'
import { usePortfolioData } from '../composables/usePortfolioData'

const { t } = useI18n()
const {
  selectedRegionKey,
  selectedDistrictId,
  isDistrictView,
  currentDistrictMap,
  selectRegion,
  selectDistrict,
  backToCountry
} = usePortfolioData()

const hoveredName = ref('')

const headerTitle = computed(() =>
  isDistrictView.value
    ? t(`regions.names.${selectedRegionKey.value}`)
    : t('map.title')
)

const districtsLoading = computed(
  () => isDistrictView.value && !currentDistrictMap.value
)
</script>

<template>
  <div
    class="lg:col-span-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col p-6 min-h-0"
  >
    <!-- Header -->
    <div
      class="bg-[#f0f4ff] text-brand-dark font-bold text-lg p-3 rounded-lg text-center mb-6 border border-blue-100 truncate"
    >
      {{ headerTitle }}
    </div>

    <!-- Map -->
    <div
      class="flex-grow flex items-center justify-center relative bg-[#f9fafc] rounded-lg overflow-hidden p-4 min-h-0"
      @mouseleave="hoveredName = ''"
    >
      <!-- Loading -->
      <div
        v-if="districtsLoading"
        class="flex flex-col items-center gap-3 text-brand-muted"
      >
        <svg class="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>

      <!-- Country view -->
      <svg
        v-else-if="!isDistrictView"
        :viewBox="REGION_VIEWBOX"
        class="uz-map w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          v-for="region in REGIONS"
          :key="region.key"
          :d="region.path"
          class="region-path"
          @click="selectRegion(region.key)"
          @mouseenter="hoveredName = region.name"
        />
      </svg>

      <!-- District view -->
      <svg
        v-else-if="currentDistrictMap"
        :viewBox="currentDistrictMap.viewBox"
        class="uz-map w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          v-for="district in currentDistrictMap.districts"
          :key="district.id"
          :d="district.path"
          class="region-path"
          :class="{ 'is-selected': district.id === selectedDistrictId }"
          @click="selectDistrict(district.id)"
          @mouseenter="hoveredName = district.name"
        />
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

    <p
      v-if="!isDistrictView"
      class="text-xs text-brand-muted text-center mt-3"
    >
      {{ t('map.hint') }}
    </p>
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
  stroke-width: 1;
  stroke-linejoin: round;
  cursor: pointer;
  transition: fill 0.18s ease;
}

.region-path:hover {
  fill: #6f93ff;
}

.region-path.is-selected {
  fill: #4775ff;
}
</style>
