<script setup>
import { useI18n } from 'vue-i18n'
import { usePortfolioData } from '../composables/usePortfolioData'
import { formatNumber } from '../utils/format'

const { t } = useI18n()
const {
  filteredPeople,
  peopleSummary,
  searchQuery,
  selectedRegionKey,
  peopleLoading,
  backToCountry,
  openPerson
} = usePortfolioData()

const PHOTO = '/img/person-placeholder.jpg'
</script>

<template>
  <div
    class="lg:col-span-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col p-6 overflow-hidden min-h-0"
  >
    <!-- Search -->
    <div class="relative mb-4">
      <svg
        class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="t('people.searchPlaceholder')"
        class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
      />
    </div>

    <!-- Summary -->
    <div
      class="bg-[#eef2f6] rounded-xl p-3 px-4 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 mb-3"
    >
      <div class="flex items-center gap-4 w-full md:w-auto">
        <div class="bg-brand-dark text-white p-3 rounded-lg shrink-0">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </div>
        <div>
          <div class="text-sm text-brand-muted font-medium">
            {{ t('people.totalLabel') }}
          </div>
          <div class="font-bold text-brand-dark text-xl leading-none mt-1">
            {{ formatNumber(peopleSummary.total) }}
          </div>
        </div>
      </div>
      <div class="flex gap-2 w-full md:w-auto shrink-0">
        <div
          class="bg-[#d5dfed] px-4 py-2 rounded-lg flex items-center gap-3 w-1/2 md:w-[150px]"
        >
          <svg
            class="w-5 h-5 text-brand-dark/70"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clip-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              fill-rule="evenodd"
            />
          </svg>
          <div>
            <div
              class="text-[11px] text-brand-dark/70 font-semibold uppercase tracking-wider"
            >
              {{ t('people.men') }}
            </div>
            <div class="font-bold text-brand-dark leading-tight">
              {{ formatNumber(peopleSummary.men) }}
            </div>
          </div>
        </div>
        <div
          class="bg-[#c2d0e1] px-4 py-2 rounded-lg flex items-center gap-3 w-1/2 md:w-[150px]"
        >
          <svg
            class="w-5 h-5 text-brand-dark/70"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clip-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              fill-rule="evenodd"
            />
          </svg>
          <div>
            <div
              class="text-[11px] text-brand-dark/70 font-semibold uppercase tracking-wider"
            >
              {{ t('people.women') }}
            </div>
            <div class="font-bold text-brand-dark leading-tight">
              {{ formatNumber(peopleSummary.women) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active region filter chip -->
    <div v-if="selectedRegionKey" class="mb-3">
      <button
        type="button"
        @click="backToCountry"
        class="inline-flex items-center gap-2 bg-[#f0f4ff] text-brand-primary text-sm font-medium pl-3 pr-2 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
      >
        {{ t(`regions.names.${selectedRegionKey}`) }}
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M6 18L18 6M6 6l12 12"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      </button>
    </div>

    <!-- People list -->
    <div
      class="flex-grow overflow-y-auto custom-scrollbar pr-2 flex flex-col min-h-0"
    >
      <div
        v-if="peopleLoading"
        class="flex-grow flex items-center justify-center text-brand-muted text-sm"
      >
        {{ t('common.loading') }}
      </div>

      <div
        v-else-if="!filteredPeople.length"
        class="flex-grow flex items-center justify-center text-brand-muted text-sm"
      >
        {{ t('people.empty') }}
      </div>

      <button
        v-for="person in filteredPeople"
        v-else
        :key="person.id"
        type="button"
        @click="openPerson(person)"
        class="flex items-center gap-3 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors px-2 rounded text-left w-full"
      >
        <img
          :src="PHOTO"
          :alt="person.fullName"
          class="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200"
        />
        <div class="min-w-0 flex-grow">
          <div class="text-brand-dark font-semibold text-sm truncate">
            {{ person.fullName }}
          </div>
          <div class="text-brand-muted text-xs truncate">
            {{ person.work.position }} • {{ t(`regions.names.${person.regionKey}`) }}
          </div>
        </div>
        <svg
          class="w-4 h-4 text-gray-300 shrink-0"
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
</template>
