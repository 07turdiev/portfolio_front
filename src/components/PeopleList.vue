<script setup>
import { useI18n } from 'vue-i18n'
import { usePortfolioData } from '../composables/usePortfolioData'
import { formatNumber } from '../utils/format'

const { t } = useI18n()
const {
  filteredPeople,
  peopleSummary,
  searchQuery,
  genderFilter,
  sortBy,
  peopleLoading,
  resetFilters,
  openPerson
} = usePortfolioData()

const PHOTO = '/img/person-placeholder.jpg'
</script>

<template>
  <div
    class="lg:col-span-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col p-6 overflow-hidden min-h-0"
  >
    <!-- Combined filter + search row -->
    <div class="grid grid-cols-[1fr_auto_auto_auto] gap-2 mb-3 shrink-0">
      <!-- Search -->
      <div class="relative">
        <svg
          class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
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
          class="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
        />
      </div>

      <!-- Gender -->
      <div class="relative">
        <select
          v-model="genderFilter"
          class="appearance-none bg-gray-50 border border-gray-200 text-brand-dark font-medium text-sm pl-3 pr-9 py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-colors"
        >
          <option value="all">{{ t('filter.allGenders') }}</option>
          <option value="male">{{ t('filter.male') }}</option>
          <option value="female">{{ t('filter.female') }}</option>
        </select>
        <svg
          class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark pointer-events-none"
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
      </div>

      <!-- Sort -->
      <div class="relative">
        <select
          v-model="sortBy"
          class="appearance-none bg-gray-50 border border-gray-200 text-brand-dark font-medium text-sm pl-3 pr-9 py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-colors"
        >
          <option value="name-asc">{{ t('filter.sortNameAsc') }}</option>
          <option value="name-desc">{{ t('filter.sortNameDesc') }}</option>
          <option value="birth-asc">{{ t('filter.sortBirthAsc') }}</option>
          <option value="birth-desc">{{ t('filter.sortBirthDesc') }}</option>
          <option value="region">{{ t('filter.sortRegion') }}</option>
        </select>
        <svg
          class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark pointer-events-none"
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
      </div>

      <!-- Reset -->
      <button
        type="button"
        @click="resetFilters"
        :title="t('filter.reset')"
        class="bg-white border border-gray-200 text-brand-dark hover:text-brand-primary hover:border-brand-primary px-3 py-2.5 rounded-lg flex items-center justify-center transition-colors"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M4 4v6h6M20 20v-6h-6M4 10a8 8 0 0114-3M20 14a8 8 0 01-14 3"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      </button>
    </div>

    <!-- Summary -->
    <div
      class="bg-[#f5f8ff] border border-blue-100 rounded-lg overflow-hidden mb-3 shrink-0"
    >
      <div class="grid grid-cols-3 divide-x divide-blue-100">
        <div class="px-3 py-2.5 text-center">
          <div
            class="text-[10px] uppercase tracking-wider text-brand-muted font-semibold"
          >
            {{ t('people.totalLabel') }}
          </div>
          <div
            class="text-xl font-bold text-brand-dark mt-1 tabular-nums"
          >
            {{ formatNumber(peopleSummary.total) }}
          </div>
        </div>
        <div class="px-3 py-2.5 text-center">
          <div
            class="text-[10px] uppercase tracking-wider text-brand-muted font-semibold"
          >
            {{ t('people.men') }}
          </div>
          <div
            class="text-xl font-bold text-brand-dark mt-1 tabular-nums"
          >
            {{ formatNumber(peopleSummary.men) }}
          </div>
        </div>
        <div class="px-3 py-2.5 text-center">
          <div
            class="text-[10px] uppercase tracking-wider text-brand-muted font-semibold"
          >
            {{ t('people.women') }}
          </div>
          <div
            class="text-xl font-bold text-brand-dark mt-1 tabular-nums"
          >
            {{ formatNumber(peopleSummary.women) }}
          </div>
        </div>
      </div>
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
