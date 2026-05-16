// Sync portfolio state ↔ URL.
//   path  = /:directionKey       (e.g. /theater_circus, /all)
//   query = ?region=&district=&gender=&sort=&q=&aff=&type=&name=
// Defaults are omitted from the URL to keep it clean.
import { watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePortfolioData, ALL_KEY } from './usePortfolioData'

const DEFAULT_SORT = 'name-asc'
const DEFAULT_GENDER = 'all'

export function useUrlSync() {
  const route = useRoute()
  const router = useRouter()
  const p = usePortfolioData()

  let suppressUrl = false

  async function applyUrlToState() {
    suppressUrl = true
    try {
      const dirKey = route.params.directionKey || ALL_KEY
      if (dirKey !== p.selectedDirectionKey.value) {
        await p.selectDirection(dirKey)
      }
      const q = route.query
      p.selectedRegionKey.value = q.region || null
      p.selectedDistrictId.value = q.district || null
      p.genderFilter.value = q.gender || DEFAULT_GENDER
      p.sortBy.value = q.sort || DEFAULT_SORT
      p.searchQuery.value = q.q || ''
      // Cascading sync watchers (in composable) fire sync; setting order matters.
      p.awardCategory.value = q.aff || ''
      p.awardType.value = q.type || ''
      p.awardName.value = q.name || ''
      await nextTick()
    } finally {
      suppressUrl = false
    }
  }

  function pushStateToUrl() {
    if (suppressUrl) return
    const dir = p.selectedDirectionKey.value || ALL_KEY
    const query = {}
    if (p.selectedRegionKey.value) query.region = p.selectedRegionKey.value
    if (p.selectedDistrictId.value) query.district = p.selectedDistrictId.value
    if (p.genderFilter.value && p.genderFilter.value !== DEFAULT_GENDER) {
      query.gender = p.genderFilter.value
    }
    if (p.sortBy.value && p.sortBy.value !== DEFAULT_SORT) {
      query.sort = p.sortBy.value
    }
    const search = (p.searchQuery.value || '').trim()
    if (search) query.q = search
    if (p.awardCategory.value) query.aff = p.awardCategory.value
    if (p.awardType.value) query.type = p.awardType.value
    if (p.awardName.value) query.name = p.awardName.value

    router
      .replace({
        name: 'home',
        params: { directionKey: dir },
        query
      })
      .catch(() => {})
  }

  // URL → state: triggers on route change (browser nav, paste, initial mount)
  watch(
    () => [route.params.directionKey, route.query],
    () => {
      applyUrlToState()
    },
    { immediate: true }
  )

  // state → URL: triggers on any state change driven from UI
  watch(
    [
      p.selectedDirectionKey,
      p.selectedRegionKey,
      p.selectedDistrictId,
      p.genderFilter,
      p.sortBy,
      p.searchQuery,
      p.awardCategory,
      p.awardType,
      p.awardName
    ],
    () => {
      pushStateToUrl()
    }
  )
}
