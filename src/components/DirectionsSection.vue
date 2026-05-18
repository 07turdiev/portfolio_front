<script setup>
import { useI18n } from 'vue-i18n'
import DirectionCard from './DirectionCard.vue'
import { usePortfolioData } from '../composables/usePortfolioData'

const { t } = useI18n()
const { directions, selectedDirectionKey, selectDirection } = usePortfolioData()
</script>

<template>
  <section
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
  >
    <DirectionCard
      v-for="dir in directions"
      :key="dir.key"
      :label="t(`directions.${dir.key}`)"
      :count="dir.count"
      :icon="dir.icon"
      :selected="dir.key === selectedDirectionKey"
      @select="selectDirection(dir.key)"
    />
  </section>
</template>
