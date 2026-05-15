<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchAwards } from '../services/api'
import AwardIcon from './AwardIcon.vue'

const STEP_INTERVAL_MS = 3000

const { t } = useI18n()
const awards = ref([])
const scrollerRef = ref(null)
const paused = ref(false)
let timerId = null

function step() {
  const el = scrollerRef.value
  if (!el || paused.value) return
  if (el.scrollWidth - el.clientWidth <= 1) return // nothing to scroll
  const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
  if (atEnd) {
    el.scrollTo({ left: 0, behavior: 'smooth' })
  } else {
    const first = el.firstElementChild
    const cardWidth = first?.offsetWidth || 220
    el.scrollBy({ left: cardWidth + 16, behavior: 'smooth' })
  }
}

onMounted(async () => {
  try {
    const data = await fetchAwards()
    awards.value = data.awards ?? []
  } catch (e) {
    awards.value = []
  }
  await nextTick()
  timerId = setInterval(step, STEP_INTERVAL_MS)
})

onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId)
})
</script>

<template>
  <section
    ref="scrollerRef"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    class="grid grid-flow-col auto-cols-[85%] sm:auto-cols-[calc((100%-1rem)/2)] md:auto-cols-[calc((100%-2rem)/3)] lg:auto-cols-[calc((100%-3rem)/4)] xl:auto-cols-[calc((100%-4rem)/5)] gap-4 overflow-x-auto custom-scrollbar snap-x snap-mandatory pb-2"
  >
    <a
      v-for="award in awards"
      :key="award.key"
      :href="award.url"
      target="_blank"
      rel="noopener noreferrer"
      class="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-start text-center hover:shadow-md hover:border-brand-primary/30 transition-all min-h-[150px] gap-3 snap-start"
    >
      <AwardIcon
        :icon="award.icon"
        class="w-10 h-10 text-brand-primary group-hover:scale-105 transition-transform"
      />
      <span class="font-semibold text-brand-dark text-sm leading-snug">
        {{ t(`awards.${award.key}`) }}
      </span>
    </a>
  </section>
</template>
