import { ref, computed } from 'vue'
import { fetchDirections, fetchPeople, fetchDistrictMap } from '../services/api'

export const ALL_KEY = 'all'

const directionsRaw = ref([])
const loading = ref(false)
const error = ref(null)

const selectedDirectionKey = ref(ALL_KEY)
const selectedRegionKey = ref(null)
const selectedDistrictId = ref(null)
const searchQuery = ref('')

const peopleByDirection = ref({})
const districtMaps = ref({})
const peopleLoading = ref(false)

const selectedPerson = ref(null)

let loaded = false

// "Barchasi" pseudo-direction prepended to the real five.
const directions = computed(() => {
  if (!directionsRaw.value.length) return []
  const totals = directionsRaw.value.reduce(
    (acc, d) => {
      acc.count += d.count
      acc.men += d.men
      acc.women += d.women
      return acc
    },
    { count: 0, men: 0, women: 0 }
  )
  return [
    { key: ALL_KEY, icon: ALL_KEY, ...totals },
    ...directionsRaw.value
  ]
})

const selectedDirection = computed(() => {
  if (!directions.value.length) return null
  return (
    directions.value.find((d) => d.key === selectedDirectionKey.value) ||
    directions.value[0]
  )
})

const currentPeople = computed(() => {
  const key = selectedDirection.value?.key
  if (!key) return []
  if (key === ALL_KEY) {
    const out = []
    for (const d of directionsRaw.value) {
      const arr = peopleByDirection.value[d.key]
      if (arr) out.push(...arr)
    }
    return out
  }
  return peopleByDirection.value[key] ?? []
})

const isDistrictView = computed(() => !!selectedRegionKey.value)

const currentDistrictMap = computed(() => {
  if (!selectedRegionKey.value) return null
  return districtMaps.value[selectedRegionKey.value] || null
})

// people filtered by selected region, district and search text
const filteredPeople = computed(() => {
  let list = currentPeople.value
  if (selectedRegionKey.value) {
    list = list.filter((p) => p.regionKey === selectedRegionKey.value)
  }
  if (selectedDistrictId.value) {
    list = list.filter((p) => p.districtId === selectedDistrictId.value)
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

const peopleSummary = computed(() => {
  const list = filteredPeople.value
  let men = 0
  let women = 0
  for (const p of list) {
    if (p.gender === 'male') men += 1
    else women += 1
  }
  return { total: list.length, men, women }
})

const selectedPersonIndex = computed(() => {
  if (!selectedPerson.value) return -1
  return filteredPeople.value.findIndex(
    (p) => p.id === selectedPerson.value.id
  )
})

const hasPrevPerson = computed(() => selectedPersonIndex.value > 0)

const hasNextPerson = computed(
  () =>
    selectedPersonIndex.value >= 0 &&
    selectedPersonIndex.value < filteredPeople.value.length - 1
)

export function usePortfolioData() {
  async function loadOne(key) {
    if (peopleByDirection.value[key]) return
    peopleByDirection.value[key] = await fetchPeople(key)
  }

  async function loadPeople(key) {
    if (!key) return
    peopleLoading.value = true
    try {
      if (key === ALL_KEY) {
        await Promise.all(directionsRaw.value.map((d) => loadOne(d.key)))
      } else {
        await loadOne(key)
      }
    } catch (e) {
      error.value = e
    } finally {
      peopleLoading.value = false
    }
  }

  async function load() {
    if (loaded || loading.value) return
    loading.value = true
    error.value = null
    try {
      const data = await fetchDirections()
      directionsRaw.value = data.directions ?? []
      if (directionsRaw.value.length) {
        selectedDirectionKey.value = ALL_KEY
        await loadPeople(ALL_KEY)
      }
      loaded = true
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  async function selectDirection(key) {
    selectedDirectionKey.value = key
    await loadPeople(key)
  }

  async function selectRegion(key) {
    selectedRegionKey.value = key
    selectedDistrictId.value = null
    if (key && !districtMaps.value[key]) {
      try {
        districtMaps.value[key] = await fetchDistrictMap(key)
      } catch (e) {
        error.value = e
      }
    }
  }

  function selectDistrict(id) {
    selectedDistrictId.value = selectedDistrictId.value === id ? null : id
  }

  function backToCountry() {
    selectedRegionKey.value = null
    selectedDistrictId.value = null
  }

  function openPerson(person) {
    selectedPerson.value = person
  }

  function closePerson() {
    selectedPerson.value = null
  }

  function goToPrevPerson() {
    if (hasPrevPerson.value) {
      selectedPerson.value = filteredPeople.value[selectedPersonIndex.value - 1]
    }
  }

  function goToNextPerson() {
    if (hasNextPerson.value) {
      selectedPerson.value = filteredPeople.value[selectedPersonIndex.value + 1]
    }
  }

  return {
    directions,
    selectedDirection,
    selectedDirectionKey,
    selectedRegionKey,
    selectedDistrictId,
    isDistrictView,
    currentDistrictMap,
    currentPeople,
    filteredPeople,
    peopleSummary,
    searchQuery,
    peopleLoading,
    selectedPerson,
    selectedPersonIndex,
    hasPrevPerson,
    hasNextPerson,
    loading,
    error,
    load,
    selectDirection,
    selectRegion,
    selectDistrict,
    backToCountry,
    openPerson,
    closePerson,
    goToPrevPerson,
    goToNextPerson
  }
}
