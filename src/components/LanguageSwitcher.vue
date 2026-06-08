<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { SELECTABLE_LOCALES, setLocale } from '../i18n'

const { t, locale } = useI18n()

const open = ref(false)
const root = ref(null)

const options = computed(() =>
  SELECTABLE_LOCALES.map((code) => ({
    code,
    label: t(`lang.${code.replace('-', '_')}`)
  }))
)

const current = computed(
  () => options.value.find((o) => o.code === locale.value) || options.value[0]
)

function select(code) {
  setLocale(code)
  open.value = false
}

function onClickOutside(e) {
  if (root.value && !root.value.contains(e.target)) open.value = false
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      @click="open = !open"
      class="flex items-center gap-2 px-3.5 py-2 bg-[#f0f4ff] text-[#4775ff] font-medium text-sm rounded-lg hover:bg-blue-100 transition-colors"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
      </svg>
      <span>{{ current.label }}</span>
      <svg
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': open }"
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
    </button>

    <transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <ul
        v-if="open"
        class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 overflow-hidden"
      >
        <li v-for="opt in options" :key="opt.code">
          <button
            type="button"
            @click="select(opt.code)"
            :class="[
              'w-full text-left px-4 py-2 text-sm transition-colors',
              opt.code === locale
                ? 'bg-[#f0f4ff] text-[#4775ff] font-semibold'
                : 'text-brand-text hover:bg-gray-50'
            ]"
          >
            {{ opt.label }}
          </button>
        </li>
      </ul>
    </transition>
  </div>
</template>
