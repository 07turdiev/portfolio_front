<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePortfolioData } from '../composables/usePortfolioData'

const { t } = useI18n()
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

const PHOTO = '/img/person-placeholder.jpg'
const person = computed(() => selectedPerson.value)

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
  ]
})

const placeRows = computed(() => {
  if (!person.value) return []
  const p = person.value
  return [
    {
      l: t('portfolio.birthPlace'),
      v: placeLabel(p.birthDistrictName, p.birthRegionKey)
    },
    {
      l: t('portfolio.residence'),
      v: placeLabel(p.districtName, p.regionKey)
    }
  ]
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
  ]
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
    { l: t('portfolio.health'), v: w.health },
    { l: t('portfolio.lastMedicalTreatment'), v: w.lastMedicalTreatment },
    { l: t('portfolio.medicalCheckup'), v: w.medicalCheckup },
    { l: t('portfolio.healthProblems'), v: w.healthProblems }
  ]
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
        class="fixed inset-0 z-[100] bg-brand-dark/70 backdrop-blur-sm flex items-center justify-center p-3 lg:px-20"
        @click.self="closePerson"
      >
        <!-- Close -->
        <button
          type="button"
          @click="closePerson"
          class="fixed top-5 right-5 z-[110] w-10 h-10 flex items-center justify-center rounded-full bg-white/95 text-brand-dark shadow-lg hover:bg-white transition-colors"
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
          class="fixed left-3 lg:left-6 top-1/2 -translate-y-1/2 z-[110] w-11 h-11 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-white/95 text-brand-dark shadow-lg hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
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
          class="fixed right-3 lg:right-6 top-1/2 -translate-y-1/2 z-[110] w-11 h-11 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-white/95 text-brand-dark shadow-lg hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
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
          class="fixed bottom-4 left-1/2 -translate-x-1/2 z-[110] bg-white/95 text-brand-dark text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg"
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
            :key="person.id"
            class="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[94vh] overflow-y-auto custom-scrollbar"
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
                  {{ person.fullName }}
                </h2>
                <div
                  class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[13px] text-white/90"
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
                  <header class="flex items-center gap-2 px-4 py-2.5 bg-[#eef3f9]">
                    <span class="w-1 h-4 rounded-full bg-[#5b87b3]"></span>
                    <h3
                      class="text-xs font-bold uppercase tracking-wider text-[#3f6286]"
                    >
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
                          class="flex gap-2 py-1 border-b border-gray-100 last:border-0 text-[13px]"
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
                    <dl class="mt-1">
                      <div
                        v-for="row in placeRows"
                        :key="row.l"
                        class="flex gap-2 py-1.5 border-b border-gray-100 last:border-0 text-[13px]"
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

                <section class="rounded-lg border border-gray-200 overflow-hidden">
                  <header class="flex items-center gap-2 px-4 py-2.5 bg-[#eef3f9]">
                    <span class="w-1 h-4 rounded-full bg-[#5b87b3]"></span>
                    <h3
                      class="text-xs font-bold uppercase tracking-wider text-[#3f6286]"
                    >
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

                <section class="rounded-lg border border-gray-200 overflow-hidden">
                  <header class="flex items-center gap-2 px-4 py-2.5 bg-[#eef3f9]">
                    <span class="w-1 h-4 rounded-full bg-[#5b87b3]"></span>
                    <h3
                      class="text-xs font-bold uppercase tracking-wider text-[#3f6286]"
                    >
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
                      <div class="font-medium text-brand-dark">
                        {{ member.name }}
                      </div>
                      <div class="text-brand-muted text-xs">
                        {{ member.info }} — {{ member.note }}
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <!-- Column 2 -->
              <div class="flex flex-col gap-4">
                <section class="rounded-lg border border-gray-200 overflow-hidden">
                  <header class="flex items-center gap-2 px-4 py-2.5 bg-[#eef3e9]">
                    <span class="w-1 h-4 rounded-full bg-[#7d9b6e]"></span>
                    <h3
                      class="text-xs font-bold uppercase tracking-wider text-[#536b46]"
                    >
                      {{ t('portfolio.education') }}
                    </h3>
                  </header>
                  <dl class="px-4 py-2">
                    <div
                      v-for="row in educationRows"
                      :key="row.l"
                      class="flex gap-3 py-1.5 border-b border-gray-100 last:border-0 text-[13px]"
                    >
                      <dt class="w-2/5 text-brand-muted shrink-0">{{ row.l }}</dt>
                      <dd class="w-3/5 font-medium text-brand-dark">{{ row.v }}</dd>
                    </div>
                  </dl>
                </section>

                <section class="rounded-lg border border-gray-200 overflow-hidden">
                  <header class="flex items-center gap-2 px-4 py-2.5 bg-[#eef3e9]">
                    <span class="w-1 h-4 rounded-full bg-[#7d9b6e]"></span>
                    <h3
                      class="text-xs font-bold uppercase tracking-wider text-[#536b46]"
                    >
                      {{ t('portfolio.work') }}
                    </h3>
                  </header>
                  <dl class="px-4 py-2">
                    <div
                      v-for="row in workRows"
                      :key="row.l"
                      class="flex gap-3 py-1.5 border-b border-gray-100 last:border-0 text-[13px]"
                    >
                      <dt class="w-2/5 text-brand-muted shrink-0">{{ row.l }}</dt>
                      <dd class="w-3/5 font-medium text-brand-dark">{{ row.v }}</dd>
                    </div>
                  </dl>
                </section>
              </div>

              <!-- Column 3 -->
              <div class="flex flex-col gap-4 h-full min-h-0">
                <section class="rounded-lg border border-gray-200 overflow-hidden shrink-0">
                  <header class="flex items-center gap-2 px-4 py-2.5 bg-[#eef3e9]">
                    <span class="w-1 h-4 rounded-full bg-[#7d9b6e]"></span>
                    <h3
                      class="text-xs font-bold uppercase tracking-wider text-[#536b46]"
                    >
                      {{ t('portfolio.achievements') }}
                    </h3>
                  </header>
                  <ul class="px-4 py-2 flex flex-col max-h-[280px] overflow-y-auto custom-scrollbar">
                    <li
                      v-for="(ach, idx) in person.achievements"
                      :key="idx"
                      class="flex gap-3 py-2 border-b border-gray-100 last:border-0"
                    >
                      <span
                        class="shrink-0 bg-[#eef3e9] text-[#536b46] text-xs font-bold px-2 py-1 rounded h-fit"
                      >
                        {{ ach.year }}
                      </span>
                      <span class="text-[13px] text-brand-dark leading-snug">
                        {{ ach.title }}
                      </span>
                    </li>
                  </ul>
                </section>

                <section class="rounded-lg border border-gray-200 overflow-hidden flex flex-col flex-grow min-h-[260px]">
                  <header class="flex items-center gap-2 px-4 py-2.5 bg-[#fbefe4] shrink-0">
                    <span class="w-1 h-4 rounded-full bg-[#e0935f]"></span>
                    <h3
                      class="text-xs font-bold uppercase tracking-wider text-[#a8602f]"
                    >
                      {{ t('portfolio.activity') }}
                    </h3>
                  </header>
                  <div class="px-4 py-3 flex flex-col gap-3 flex-grow min-h-0">
                    <!-- Tavsifnoma — qolgan joyni egallaydi -->
                    <div class="flex flex-col flex-grow min-h-0">
                      <div
                        class="text-xs font-semibold text-brand-dark uppercase tracking-wide mb-1.5 shrink-0"
                      >
                        {{ t('portfolio.description') }}
                      </div>
                      <div class="flex-grow overflow-y-auto custom-scrollbar pr-1 min-h-0">
                        <p
                          class="text-[13px] text-brand-text leading-relaxed text-justify"
                        >
                          {{ person.activity.description }}
                        </p>
                      </div>
                    </div>
                    <!-- Davlat tadbirlari — pastda, o'z hajmida -->
                    <div class="border-t border-gray-100 pt-3 shrink-0">
                      <div
                        class="text-xs font-semibold text-brand-dark uppercase tracking-wide mb-1.5"
                      >
                        {{ t('portfolio.stateEvents') }}
                      </div>
                      <div class="max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
                        <p
                          class="text-[13px] text-brand-text leading-relaxed text-justify"
                        >
                          {{ person.activity.stateEvents }}
                        </p>
                      </div>
                    </div>
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
