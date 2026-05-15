<script setup>
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'

const { t } = useI18n()
</script>

<template>
  <header
    class="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between gap-4 sticky top-0 z-50"
  >
    <!-- Ministry name -->
    <div class="flex items-center gap-3">
      <img
        src="/logo.svg"
        :alt="t('header.ministry')"
        class="h-11 w-auto shrink-0"
      />
      <h1 class="text-lg md:text-xl font-bold text-brand-dark leading-tight">
        {{ t('header.ministry') }}
      </h1>
    </div>

    <!-- Language switcher -->
    <div class="shrink-0">
      <LanguageSwitcher />
    </div>
  </header>
</template>
