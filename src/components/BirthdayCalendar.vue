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
    <!-- Upcoming birthday — formal banner at top -->
    <button
      v-if="upcoming"
      type="button"
      @click="openPerson(upcoming.person)"
      class="group relative w-full bg-[#f5f8ff] border border-blue-100 rounded-lg overflow-hidden text-left hover:shadow-md transition-shadow"
    >
      <span
        class="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-primary"
      ></span>
      <div
        class="pl-6 pr-5 py-4 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-6"
      >
        <div class="border-2 border-brand-primary p-0.5 bg-white shrink-0">
          <img
            :src="PHOTO"
            :alt="upcoming.person.fullName"
            class="w-[68px] h-[84px] object-cover"
          />
        </div>

        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-1.5">
            <svg
              class="w-4 h-4 text-brand-primary shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 13c0-1.1.9-2 2-2h10a2 2 0 012 2v6H5v-6z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
              <path
                d="M5 16c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0M9 11V8m3 3V8m3 3V8M12 5l-1.5-2m1.5 2l1.5-2"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
            <span
              class="text-[11px] uppercase tracking-[0.25em] font-bold text-brand-primary"
            >
              {{ t('calendar.upcoming') }}
            </span>
          </div>
          <div
            class="text-xl md:text-2xl font-bold text-brand-dark leading-tight"
          >
            {{ upcoming.person.fullName }}
          </div>
          <div class="text-sm text-brand-muted mt-0.5 truncate">
            {{ upcoming.person.work.position }}
          </div>
          <div
            class="flex items-center gap-1.5 mt-2 text-sm font-semibold text-brand-dark"
          >
            <svg
              class="w-4 h-4 text-brand-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
            {{ upcomingDateLabel }}
          </div>
        </div>

        <div
          class="md:border-l md:border-blue-200 md:pl-6 text-center shrink-0"
        >
          <div
            class="text-5xl font-bold text-brand-primary leading-none tabular-nums"
          >
            {{ upcoming.daysLeft }}
          </div>
          <div
            class="text-[10px] uppercase tracking-[0.25em] font-semibold text-brand-muted mt-2"
          >
            {{ upcomingDaysText }}
          </div>
        </div>
      </div>
    </button>

    <div class="flex items-center justify-between gap-4 flex-wrap">
      <h2 class="text-xl font-bold text-brand-dark">
        {{ t('calendar.title') }}
      </h2>
      <button
        type="button"
        @click="goToToday"
        class="px-3 py-1.5 rounded-md text-sm font-medium text-brand-primary bg-[#f0f4ff] hover:bg-blue-100 transition-colors"
      >
        {{ t('calendar.today') }}
      </button>
    </div>

    <!-- Prominent month banner with nav -->
    <div
      class="flex items-center justify-center gap-3 md:gap-6 bg-[#f0f4ff] border border-blue-100 rounded-lg py-3 px-4"
    >
      <button
        type="button"
        @click="prevMonth"
        class="w-10 h-10 rounded-full bg-white hover:bg-brand-primary hover:text-white flex items-center justify-center text-brand-dark shadow-sm transition-colors shrink-0"
      >
        <svg
          class="w-5 h-5"
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
        class="text-2xl md:text-3xl font-bold text-brand-dark uppercase tracking-wide text-center min-w-[200px]"
      >
        {{ monthLabel }}
      </div>
      <button
        type="button"
        @click="nextMonth"
        class="w-10 h-10 rounded-full bg-white hover:bg-brand-primary hover:text-white flex items-center justify-center text-brand-dark shadow-sm transition-colors shrink-0"
      >
        <svg
          class="w-5 h-5"
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
