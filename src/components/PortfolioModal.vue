<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { usePortfolioData } from '../composables/usePortfolioData'

const { t, locale } = useI18n()
const articleRef = ref(null)
const exporting = ref(false)

async function exportPdf() {
  if (exporting.value || !selectedPerson.value) return
  exporting.value = true
  try {
    // Backenddan WeasyPrint orqali tayyor PDF olamiz
    const lang = locale.value.replace('-', '_') // uz-latn → uz_latn
    const res = await axios.get(
      `/api/people/${selectedPerson.value.id}/pdf`,
      { params: { lang }, responseType: 'blob' }
    )
    const blob = new Blob([res.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const safe = (selectedPerson.value?.fullName || 'portfolio').replace(/[\/\\?%*:|"<>]/g, '-')
    a.download = `${safe}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (e) {
    console.error('PDF eksport xatosi:', e)
  } finally {
    exporting.value = false
  }
}
const {
  selectedPerson,
  selectedPersonIndex,
  filteredPeople,
  hasPrevPerson,
  hasNextPerson,
  closePerson,
  goToPrevPerson,
  goToNextPerson
} = usePortfolioData()

const PHOTO = '/img/person-placeholder.svg'
const person = computed(() => selectedPerson.value)
const isDeceased = computed(() => person.value?.work?.healthKey === 'deceased')

// Sog'lig'i bloki uchun fon va aksent rangi
const HEALTH_HEADER_CLASS = {
  good:     { bg: 'bg-green-50',  border: 'border-green-600',  text: 'text-green-800' },
  average:  { bg: 'bg-yellow-50', border: 'border-yellow-600', text: 'text-yellow-800' },
  poor:     { bg: 'bg-red-50',    border: 'border-red-600',    text: 'text-red-800' },
  deceased: { bg: 'bg-gray-100',  border: 'border-gray-500',   text: 'text-gray-700' }
}
function healthClasses(key) {
  return HEALTH_HEADER_CLASS[key] || { bg: 'bg-gray-50', border: 'border-gray-400', text: 'text-gray-700' }
}

function placeLabel(districtName, regionKey) {
  if (!regionKey) return ''
  const region = t(`regions.names.${regionKey}`)
  return districtName ? `${districtName}, ${region}` : region
}

const personalRows = computed(() => {
  if (!person.value) return []
  const p = person.value.personal
  return [
    { l: t('portfolio.lastName'), v: p.lastName },
    { l: t('portfolio.firstName'), v: p.firstName },
    { l: t('portfolio.middleName'), v: p.middleName },
    { l: t('portfolio.nationality'), v: p.nationality },
    { l: t('portfolio.birthDate'), v: p.birthDate }
  ].filter((r) => r.v && String(r.v).trim())
})

const placeRows = computed(() => {
  if (!person.value) return []
  const p = person.value
  return [
    { l: t('portfolio.birthPlace'), v: p.personal.birthPlace },
    {
      l: t('portfolio.residence'),
      v: p.personal.residencePlace || placeLabel(p.districtName, p.regionKey)
    }
  ].filter((r) => r.v && String(r.v).trim())
})

const educationRows = computed(() => {
  if (!person.value) return []
  const e = person.value.education
  return [
    { l: t('portfolio.university'), v: e.university },
    { l: t('portfolio.specialty'), v: e.specialty },
    { l: t('portfolio.academicDegree'), v: e.academicDegree },
    { l: t('portfolio.languages'), v: e.languages },
    { l: t('portfolio.training'), v: e.training }
  ].filter((r) => r.v && String(r.v).trim())
})

const workRows = computed(() => {
  if (!person.value) return []
  const w = person.value.work
  return [
    { l: t('portfolio.position'), v: w.position },
    { l: t('portfolio.careerLevel'), v: w.careerLevel },
    { l: t('portfolio.totalExperience'), v: w.totalExperience },
    { l: t('portfolio.leadershipExperience'), v: w.leadershipExperience },
    { l: t('portfolio.leadershipPositions'), v: w.leadershipPositions },
    { l: t('portfolio.lastMedicalTreatment'), v: w.lastMedicalTreatment },
    { l: t('portfolio.medicalCheckup'), v: w.medicalCheckup },
    { l: t('portfolio.healthProblems'), v: w.healthProblems }
  ].filter((r) => r.v && String(r.v).trim())
})

function onKey(e) {
  if (!person.value) return
  if (e.key === 'Escape') closePerson()
  else if (e.key === 'ArrowLeft') goToPrevPerson()
  else if (e.key === 'ArrowRight') goToNextPerson()
}
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<template>
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
        v-if="person"
        class="portfolio-modal-overlay fixed inset-0 z-[100] bg-brand-dark/70 backdrop-blur-sm flex items-center justify-center p-3 lg:px-20"
        @click.self="closePerson"
      >
        <!-- PDF eksport -->
        <button
          type="button"
          @click="exportPdf"
          :disabled="exporting"
          :title="t('portfolio.exportPdf')"
          class="no-print fixed top-5 right-[68px] z-[110] h-10 px-3.5 flex items-center gap-2 rounded-full bg-white/95 text-brand-dark shadow-lg hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-wait"
        >
          <svg v-if="!exporting" class="w-4 h-4" fill="currentColor" viewBox="0 0 3873 3873">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3087.5,3646.1h-2302c-220.2,0-399.3-179.1-399.3-399.3V1096.6c0-20.6,16.7-37.3,37.3-37.3s37.3,16.7,37.3,37.3v2150.2c0,179,145.6,324.6,324.6,324.6h2302.1c179,0,324.7-145.6,324.7-324.6V626.2c0-179-145.7-324.6-324.7-324.6H1255.8c-20.6,0-37.3-16.7-37.3-37.3s16.7-37.3,37.3-37.3h1831.7c220.2,0,399.3,179.1,399.3,399.3v2620.6C3486.8,3467,3307.7,3646,3087.5,3646.1L3087.5,3646.1z"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M513.6,1059.3h704.9V354.4L513.6,1059.3z M1255.8,1133.9H423.5c-15.1,0-28.7-9.1-34.5-23c-5.8-14-2.6-30,8.1-40.7l832.3-832.3c10.7-10.7,26.7-13.9,40.7-8.1c14,5.8,23,19.4,23,34.5v832.3C1293.2,1117.2,1276.4,1133.9,1255.8,1133.9L1255.8,1133.9z"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M1569.8,1974.4l366.7,527.2l366.7-527.2h-217.4c-20.6,0-37.3-16.7-37.3-37.3V796.3h-224v1140.8c0,20.6-16.7,37.3-37.3,37.3L1569.8,1974.4L1569.8,1974.4z M1936.5,2604.3c-12.2,0-23.7-6-30.6-16l-438.1-629.9c-7.9-11.4-8.9-26.3-2.4-38.6c6.4-12.3,19.2-20,33.1-20H1750V759c0-20.6,16.7-37.3,37.3-37.3h298.6c20.6,0,37.3,16.7,37.3,37.3v1140.8h251.5c13.9,0,26.6,7.7,33.1,20c6.4,12.3,5.5,27.2-2.4,38.6l-438.1,629.9C1960.1,2598.4,1948.7,2604.3,1936.5,2604.3z"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M1080.8,3076.7h1711.5v-224H1080.8V3076.7z M2829.5,3151.4H1043.4c-20.6,0-37.3-16.7-37.3-37.3v-298.6c0-20.6,16.7-37.3,37.3-37.3h1786.1c20.6,0,37.3,16.7,37.3,37.3V3114C2866.9,3134.6,2850.1,3151.4,2829.5,3151.4z"/>
          </svg>
          <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="40 80" stroke-linecap="round"/>
          </svg>
          <span class="text-xs font-semibold">PDF</span>
        </button>

        <!-- Close -->
        <button
          type="button"
          @click="closePerson"
          class="no-print fixed top-5 right-5 z-[110] w-10 h-10 flex items-center justify-center rounded-full bg-white/95 text-brand-dark shadow-lg hover:bg-white transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M6 18L18 6M6 6l12 12"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </button>

        <!-- Prev -->
        <button
          type="button"
          @click="goToPrevPerson"
          :disabled="!hasPrevPerson"
          class="no-print fixed left-3 lg:left-6 top-1/2 -translate-y-1/2 z-[110] w-11 h-11 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-white/95 text-brand-dark shadow-lg hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M15 19l-7-7 7-7"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </button>

        <!-- Next -->
        <button
          type="button"
          @click="goToNextPerson"
          :disabled="!hasNextPerson"
          class="no-print fixed right-3 lg:right-6 top-1/2 -translate-y-1/2 z-[110] w-11 h-11 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-white/95 text-brand-dark shadow-lg hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M9 5l7 7-7 7"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </button>

        <!-- Page counter -->
        <div
          class="no-print fixed bottom-4 left-1/2 -translate-x-1/2 z-[110] bg-white/95 text-brand-dark text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg"
        >
          {{ selectedPersonIndex + 1 }} / {{ filteredPeople.length }}
        </div>

        <!-- Landscape album page -->
        <Transition
          mode="out-in"
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-x-3"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 -translate-x-3"
        >
          <article
            ref="articleRef"
            :key="person.id"
            class="portfolio-print-root bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[94vh] overflow-hidden transition-[filter] duration-300"
            :style="isDeceased ? { filter: 'grayscale(100%)', WebkitFilter: 'grayscale(100%)' } : {}"
          >
            <!-- Compact hero -->
            <div
              class="bg-gradient-to-r from-brand-dark to-brand-primary text-white px-6 md:px-8 py-4"
            >
              <div class="min-w-0">
                <div
                  class="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60"
                >
                  {{ t('portfolio.title') }}
                </div>
                <h2 class="text-xl md:text-2xl font-bold leading-tight mt-0.5">
                  {{ person.fullName }}<template v-if="isDeceased">
                    <span class="font-normal text-white/80"> — {{ person.work.health }}</span>
                  </template>
                </h2>
                <div
                  class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[13px] leading-5 text-white/90"
                >
                  <span>{{ t(`directions.${person.directionKey}`) }}</span>
                  <span class="flex items-center gap-1.5">
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      />
                      <path
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      />
                    </svg>
                    {{ t(`regions.names.${person.regionKey}`) }}
                    <template v-if="person.districtName">
                      , {{ person.districtName }}
                    </template>
                  </span>
                  <span
                    class="bg-white/15 px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ person.work.position }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 3 columns filling the landscape width -->
            <div class="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <!-- Column 1 -->
              <div class="flex flex-col gap-4">
                <section class="rounded-lg border border-gray-200 overflow-hidden">
                  <header class="px-4 py-2.5 bg-[#eef3f9] border-l-[3px] border-[#5b87b3]">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-[#3f6286]">
                      {{ t('portfolio.personal') }}
                    </h3>
                  </header>
                  <div class="p-4">
                    <div class="flex gap-4">
                      <img
                        :src="person.photo || PHOTO"
                        :alt="person.fullName"
                        @error="(e) => (e.target.src = PHOTO)"
                        class="w-24 h-32 object-cover border border-gray-200 rounded shrink-0"
                      />
                      <dl class="flex-grow min-w-0">
                        <div
                          v-for="row in personalRows"
                          :key="row.l"
                          class="flex items-start gap-2 py-1 border-b border-gray-100 last:border-0 text-[13px]"
                        >
                          <dt class="w-2/5 text-brand-muted shrink-0">
                            {{ row.l }}
                          </dt>
                          <dd class="w-3/5 font-medium text-brand-dark">
                            {{ row.v }}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <dl v-if="placeRows.length" class="mt-1">
                      <div
                        v-for="row in placeRows"
                        :key="row.l"
                        class="flex items-start gap-2 py-1.5 border-b border-gray-100 last:border-0 text-[13px]"
                      >
                        <dt class="w-2/5 text-brand-muted shrink-0">
                          {{ row.l }}
                        </dt>
                        <dd class="w-3/5 font-medium text-brand-dark">
                          {{ row.v }}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </section>

                <section
                  v-if="person.family.maritalStatus && person.family.maritalStatus.trim()"
                  class="rounded-lg border border-gray-200 overflow-hidden"
                >
                  <header class="px-4 py-2.5 bg-[#eef3f9] border-l-[3px] border-[#5b87b3]">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-[#3f6286]">
                      {{ t('portfolio.familyInfo') }}
                    </h3>
                  </header>
                  <div class="px-4 py-3 text-[13px]">
                    <div class="text-brand-muted mb-1">
                      {{ t('portfolio.maritalStatus') }}
                    </div>
                    <div class="font-medium text-brand-dark">
                      {{ person.family.maritalStatus }}
                    </div>
                  </div>
                </section>

                <section
                  v-if="person.family.members && person.family.members.length"
                  class="rounded-lg border border-gray-200 overflow-hidden"
                >
                  <header class="px-4 py-2.5 bg-[#eef3f9] border-l-[3px] border-[#5b87b3]">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-[#3f6286]">
                      {{ t('portfolio.familyMembers') }}
                    </h3>
                  </header>
                  <div class="divide-y divide-gray-100">
                    <div
                      v-for="member in person.family.members"
                      :key="member.relation"
                      class="px-4 py-2.5 text-[13px]"
                    >
                      <div
                        class="text-brand-muted text-xs uppercase tracking-wide mb-0.5"
                      >
                        {{ t(`portfolio.${member.relation}`) }}
                      </div>
                      <div v-if="member.name" class="font-medium text-brand-dark">
                        {{ member.name }}
                      </div>
                      <div
                        v-if="member.info || member.note"
                        class="text-brand-muted text-xs"
                      >
                        <template v-if="member.info">{{ member.info }}</template>
                        <template v-if="member.info && member.note"> — </template>
                        <template v-if="member.note">{{ member.note }}</template>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <!-- Column 2 -->
              <div class="flex flex-col gap-4">
                <section
                  v-if="educationRows.length"
                  class="rounded-lg border border-gray-200 overflow-hidden"
                >
                  <header class="px-4 py-2.5 bg-[#eef3e9] border-l-[3px] border-[#7d9b6e]">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-[#536b46]">
                      {{ t('portfolio.education') }}
                    </h3>
                  </header>
                  <dl class="px-4 py-2">
                    <div
                      v-for="row in educationRows"
                      :key="row.l"
                      class="flex items-start gap-3 py-1.5 border-b border-gray-100 last:border-0 text-[13px]"
                    >
                      <dt class="w-2/5 text-brand-muted shrink-0">{{ row.l }}</dt>
                      <dd class="w-3/5 font-medium text-brand-dark">{{ row.v }}</dd>
                    </div>
                  </dl>
                </section>

                <section
                  v-if="workRows.length"
                  class="rounded-lg border border-gray-200 overflow-hidden"
                >
                  <header class="px-4 py-2.5 bg-[#eef3e9] border-l-[3px] border-[#7d9b6e]">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-[#536b46]">
                      {{ t('portfolio.work') }}
                    </h3>
                  </header>
                  <dl class="px-4 py-2">
                    <div
                      v-for="row in workRows"
                      :key="row.l"
                      class="flex items-start gap-3 py-1.5 border-b border-gray-100 last:border-0 text-[13px]"
                    >
                      <dt class="w-2/5 text-brand-muted shrink-0">{{ row.l }}</dt>
                      <dd class="w-3/5 font-medium text-brand-dark">{{ row.v }}</dd>
                    </div>
                  </dl>
                </section>

                <!-- Sog'lig'i — alohida sarlavha blok, ranglar holatga qarab -->
                <section
                  v-if="person.work.health"
                  class="rounded-lg border overflow-hidden"
                  :class="[healthClasses(person.work.healthKey).bg, 'border-gray-200']"
                >
                  <header
                    class="px-4 py-2.5 border-l-[3px]"
                    :class="healthClasses(person.work.healthKey).border"
                  >
                    <h3
                      class="text-xs font-bold uppercase tracking-wider"
                      :class="healthClasses(person.work.healthKey).text"
                    >
                      {{ t('portfolio.health') }}: {{ person.work.health }}
                    </h3>
                  </header>
                </section>
              </div>

              <!-- Column 3 — 3 ta alohida bo'lim, Tavsifnoma chegarali cho'ziladi -->
              <div class="flex flex-col gap-4">
                <!-- 1. Yutuqlar -->
                <section
                  v-if="person.achievements && person.achievements.length"
                  class="rounded-lg border border-gray-200 overflow-hidden"
                >
                  <header class="px-4 py-2.5 bg-[#eef3e9] border-l-[3px] border-[#7d9b6e]">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-[#536b46]">
                      {{ t('portfolio.achievements') }}
                    </h3>
                  </header>
                  <ul class="px-4 py-2 max-h-[220px] overflow-y-auto custom-scrollbar">
                    <li
                      v-for="(ach, idx) in person.achievements"
                      :key="idx"
                      class="flex gap-3 py-2 border-b border-gray-100 last:border-0"
                    >
                      <span class="shrink-0 bg-[#eef3e9] text-[#536b46] text-xs font-bold px-2 py-1 rounded h-fit">
                        {{ ach.year }}
                      </span>
                      <span class="text-[13px] text-brand-dark leading-snug">
                        {{ ach.title }}
                      </span>
                    </li>
                  </ul>
                </section>

                <!-- 2. Tavsifnoma — qolgan joyni egallaydi, lekin chegarali -->
                <section
                  v-if="person.activity.description && person.activity.description.trim()"
                  class="rounded-lg border border-gray-200 overflow-hidden flex flex-col flex-grow min-h-[180px] max-h-[400px]"
                >
                  <header class="px-4 py-2.5 bg-[#fbefe4] border-l-[3px] border-[#e0935f] shrink-0">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-[#a8602f]">
                      {{ t('portfolio.description') }}
                    </h3>
                  </header>
                  <div class="px-4 py-3 flex-grow overflow-y-auto custom-scrollbar min-h-0">
                    <p class="text-[13px] text-brand-text leading-relaxed text-justify">
                      {{ person.activity.description }}
                    </p>
                  </div>
                </section>

                <!-- 3. Davlat tadbirlari -->
                <section
                  v-if="person.activity.stateEvents && person.activity.stateEvents.trim()"
                  class="rounded-lg border border-gray-200 overflow-hidden"
                >
                  <header class="px-4 py-2.5 bg-[#fef3e2] border-l-[3px] border-[#c98135]">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-[#8b5a25]">
                      {{ t('portfolio.stateEvents') }}
                    </h3>
                  </header>
                  <div class="px-4 py-3 max-h-[160px] overflow-y-auto custom-scrollbar">
                    <p class="text-[13px] text-brand-text leading-relaxed text-justify">
                      {{ person.activity.stateEvents }}
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </article>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
