<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchInfoCards } from '../services/api'
import { pickLang } from '../i18n'

const { t } = useI18n()
const cards = ref([])
const scrollerRef = ref(null)
const paused = ref(false)
const selected = ref(null) // hozir ochilgan kartochka (popup uchun)

const STEP_INTERVAL_MS = 3500
let timerId = null

function step() {
  const el = scrollerRef.value
  if (!el || paused.value) return
  // agar barchasi sig'sa, scroll qilish kerak emas
  if (el.scrollWidth - el.clientWidth <= 1) return
  const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
  if (atEnd) {
    el.scrollTo({ left: 0, behavior: 'smooth' })
  } else {
    const first = el.firstElementChild
    const cardWidth = (first?.offsetWidth || 220) + 16
    el.scrollBy({ left: cardWidth, behavior: 'smooth' })
  }
}

onMounted(async () => {
  try {
    cards.value = await fetchInfoCards()
  } catch (e) {
    console.error('InfoCards yuklash xatosi:', e)
  }
  await nextTick()
  timerId = setInterval(step, STEP_INTERVAL_MS)
})

onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId)
})

function openCard(card) {
  selected.value = card
  paused.value = true
}

function closeCard() {
  selected.value = null
  paused.value = false
}

function onKey(e) {
  if (e.key === 'Escape' && selected.value) closeCard()
}
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))

const selectedTitle = computed(() => (selected.value ? pickLang(selected.value.title) : ''))
const selectedBody = computed(() => (selected.value ? pickLang(selected.value.body) : ''))
</script>

<template>
  <section v-if="cards.length" class="w-full">
    <!-- Auto-scrolling kartochkalar -->
    <div
      ref="scrollerRef"
      class="flex gap-4 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
      @mouseenter="paused = true"
      @mouseleave="paused = false"
    >
      <button
        v-for="card in cards"
        :key="card.id"
        type="button"
        @click="openCard(card)"
        class="shrink-0 w-[220px] min-h-[140px] bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-brand-primary/40 transition-all p-5 flex flex-col items-start gap-3 text-left cursor-pointer"
      >
        <img
          v-if="card.icon"
          :src="card.icon"
          :alt="pickLang(card.title)"
          class="w-12 h-12 object-contain"
        />
        <div
          v-else
          class="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xl font-bold"
        >
          {{ pickLang(card.title).slice(0, 1) }}
        </div>
        <div class="text-[15px] font-semibold text-brand-dark leading-snug">
          {{ pickLang(card.title) }}
        </div>
      </button>
    </div>

    <!-- Pop-up modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="selected"
          class="fixed inset-0 z-[120] bg-brand-dark/70 backdrop-blur-sm flex items-center justify-center p-4"
          @click.self="closeCard"
        >
          <article
            class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
          >
            <!-- Header -->
            <header
              class="bg-gradient-to-r from-brand-dark to-brand-primary text-white px-6 py-4 flex items-center gap-4 shrink-0"
            >
              <img
                v-if="selected.icon"
                :src="selected.icon"
                :alt="selectedTitle"
                class="w-12 h-12 object-contain bg-white/15 rounded-lg p-1.5 shrink-0"
              />
              <h2 class="text-lg md:text-xl font-bold leading-tight">
                {{ selectedTitle }}
              </h2>
              <button
                type="button"
                @click="closeCard"
                class="ml-auto w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors shrink-0"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </button>
            </header>

            <!-- Body -->
            <div class="px-6 py-5 overflow-y-auto custom-scrollbar">
              <p class="text-[14px] text-brand-text leading-relaxed whitespace-pre-line">
                {{ selectedBody }}
              </p>
            </div>
          </article>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
