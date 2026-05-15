<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePortfolioData } from '../composables/usePortfolioData'

const { t, tm } = useI18n()
const { filteredPeople, openPerson } = usePortfolioData()

const PHOTO = '/img/person-placeholder.jpg'
const VISIBLE_PILLS = 2

const today = (() => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
})()

const viewMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))
const expandedDayKey = ref(null)

function parseBirth(s) {
  if (!s) return null
  const [day, month, year] = s.split('.').map(Number)
  if (!day || !month) return null
  return { day, month, year }
}

const monthNames = computed(() => tm('calendar.months'))
const weekdayNames = computed(() => tm('calendar.weekdays'))

const monthLabel = computed(() => {
  const m = viewMonth.value
  return `${monthNames.value[m.getMonth()]} ${m.getFullYear()}`
})

const peopleByDay = computed(() => {
  const m = viewMonth.value.getMonth() + 1
  const map = {}
  for (const p of filteredPeople.value) {
    const b = parseBirth(p.personal?.birthDate)
    if (b && b.month === m) {
      ;(map[b.day] = map[b.day] || []).push(p)
    }
  }
  // sort each day list by full name
  for (const arr of Object.values(map)) {
    arr.sort((a, b) => a.fullName.localeCompare(b.fullName))
  }
  return map
})

const upcoming = computed(() => {
  let best = null
  let bestDiff = Infinity
  for (const p of filteredPeople.value) {
    const b = parseBirth(p.personal?.birthDate)
    if (!b) continue
    let next = new Date(today.getFullYear(), b.month - 1, b.day)
    if (next < today)
      next = new Date(today.getFullYear() + 1, b.month - 1, b.day)
    const diff = Math.round((next - today) / 86400000)
    if (diff < bestDiff) {
      bestDiff = diff
      best = { person: p, date: next, daysLeft: diff }
    }
  }
  return best
})

const upcomingDateLabel = computed(() => {
  if (!upcoming.value) return ''
  const d = upcoming.value.date
  return `${d.getDate()} ${monthNames.value[d.getMonth()]}`
})

const upcomingDaysText = computed(() => {
  if (!upcoming.value) return ''
  const n = upcoming.value.daysLeft
  if (n === 0) return t('calendar.today')
  return t('calendar.daysLeft', { n })
})

const calendarDays = computed(() => {
  const m = viewMonth.value
  const year = m.getFullYear()
  const month = m.getMonth()
  const firstDay = new Date(year, month, 1)
  const offset = (firstDay.getDay() + 6) % 7
  const out = []
  for (let i = offset - 1; i >= 0; i--) {
    out.push({ date: new Date(year, month, -i), inMonth: false })
  }
  const last = new Date(year, month + 1, 0).getDate()
  for (let d = 1; d <= last; d++) {
    out.push({ date: new Date(year, month, d), inMonth: true })
  }
  while (out.length < 42) {
    const prev = out[out.length - 1].date
    out.push({
      date: new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1),
      inMonth: false
    })
  }
  return out
})

function dayKey(d) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function isToday(d) {
  return dayKey(d) === dayKey(today)
}

function peopleForDay(d, inMonth) {
  if (!inMonth) return []
  return peopleByDay.value[d.getDate()] ?? []
}

function visiblePills(people, expanded) {
  if (expanded || people.length <= VISIBLE_PILLS + 1) return people
  return people.slice(0, VISIBLE_PILLS)
}

function hiddenCount(people, expanded) {
  if (expanded) return 0
  if (people.length <= VISIBLE_PILLS + 1) return 0
  return people.length - VISIBLE_PILLS
}

function toggleExpand(d) {
  const k = dayKey(d)
  expandedDayKey.value = expandedDayKey.value === k ? null : k
}

function prevMonth() {
  const m = new Date(viewMonth.value)
  m.setMonth(m.getMonth() - 1)
  viewMonth.value = m
  expandedDayKey.value = null
}

function nextMonth() {
  const m = new Date(viewMonth.value)
  m.setMonth(m.getMonth() + 1)
  viewMonth.value = m
  expandedDayKey.value = null
}

function goToToday() {
  viewMonth.value = new Date(today.getFullYear(), today.getMonth(), 1)
  expandedDayKey.value = null
}
</script>

<template>
  <section
    class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5"
  >
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <h2 class="text-xl font-bold text-brand-dark">
        {{ t('calendar.title') }}
      </h2>
      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="goToToday"
          class="px-3 py-1.5 rounded-md text-sm font-medium text-brand-primary bg-[#f0f4ff] hover:bg-blue-100 transition-colors"
        >
          {{ t('calendar.today') }}
        </button>
        <button
          type="button"
          @click="prevMonth"
          class="w-9 h-9 rounded-md hover:bg-gray-100 flex items-center justify-center text-brand-dark transition-colors"
        >
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
        <div
          class="font-semibold text-brand-dark capitalize min-w-[140px] text-center"
        >
          {{ monthLabel }}
        </div>
        <button
          type="button"
          @click="nextMonth"
          class="w-9 h-9 rounded-md hover:bg-gray-100 flex items-center justify-center text-brand-dark transition-colors"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M9 5l7 7-7 7"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Upcoming banner -->
    <button
      v-if="upcoming"
      type="button"
      @click="openPerson(upcoming.person)"
      class="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-brand-dark to-brand-primary text-white text-left hover:shadow-md transition-shadow"
    >
      <img
        :src="PHOTO"
        :alt="upcoming.person.fullName"
        class="w-16 h-16 rounded-full object-cover border-2 border-white/50 shrink-0"
      />
      <div class="flex-grow min-w-0">
        <div
          class="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70 mb-0.5"
        >
          {{ t('calendar.upcoming') }}
        </div>
        <div class="text-lg md:text-xl font-bold truncate">
          {{ upcoming.person.fullName }}
        </div>
        <div class="text-sm text-white/85">
          {{ upcomingDateLabel }}
        </div>
      </div>
      <div class="shrink-0 text-right pr-1">
        <div class="text-3xl md:text-4xl font-bold leading-none">
          {{ upcoming.daysLeft }}
        </div>
        <div class="text-[11px] uppercase tracking-wider text-white/80 mt-1">
          {{ upcomingDaysText }}
        </div>
      </div>
    </button>

    <!-- Calendar grid -->
    <div class="border border-gray-200 rounded-lg overflow-hidden">
      <div
        class="grid grid-cols-7 bg-[#f4f6fa] text-center text-[11px] font-semibold text-brand-muted uppercase tracking-wider"
      >
        <div
          v-for="w in weekdayNames"
          :key="w"
          class="py-2 border-r border-gray-200 last:border-r-0"
        >
          {{ w }}
        </div>
      </div>

      <div class="grid grid-cols-7 auto-rows-fr">
        <div
          v-for="(day, i) in calendarDays"
          :key="i"
          :class="[
            'border-t border-r border-gray-200 last:border-r-0 p-1.5 flex flex-col gap-1 min-h-[96px] transition-colors',
            (i + 1) % 7 === 0 ? '!border-r-0' : '',
            day.inMonth ? 'bg-white' : 'bg-gray-50/50',
            isToday(day.date) && day.inMonth ? 'bg-[#f0f4ff]/60' : ''
          ]"
        >
          <div class="flex items-center justify-between">
            <span
              :class="[
                'text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full',
                !day.inMonth
                  ? 'text-gray-300'
                  : isToday(day.date)
                    ? 'bg-brand-primary text-white'
                    : 'text-brand-dark'
              ]"
            >
              {{ day.date.getDate() }}
            </span>
          </div>

          <div class="flex flex-col gap-0.5 min-h-0">
            <button
              v-for="person in visiblePills(
                peopleForDay(day.date, day.inMonth),
                expandedDayKey === dayKey(day.date)
              )"
              :key="person.id"
              type="button"
              @click.stop="openPerson(person)"
              class="text-left text-[11px] leading-tight bg-[#e6edff] text-brand-primary hover:bg-brand-primary hover:text-white px-1.5 py-0.5 rounded truncate transition-colors"
              :title="person.fullName"
            >
              {{ person.fullName }}
            </button>

            <button
              v-if="hiddenCount(peopleForDay(day.date, day.inMonth), expandedDayKey === dayKey(day.date)) > 0"
              type="button"
              @click.stop="toggleExpand(day.date)"
              class="text-left text-[11px] font-medium text-brand-muted hover:text-brand-primary px-1.5 py-0.5 rounded transition-colors"
            >
              + {{ hiddenCount(peopleForDay(day.date, day.inMonth), expandedDayKey === dayKey(day.date)) }}
            </button>

            <button
              v-else-if="expandedDayKey === dayKey(day.date) && peopleForDay(day.date, day.inMonth).length > VISIBLE_PILLS + 1"
              type="button"
              @click.stop="toggleExpand(day.date)"
              class="text-left text-[11px] font-medium text-brand-muted hover:text-brand-primary px-1.5 py-0.5 rounded transition-colors"
            >
              −
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
