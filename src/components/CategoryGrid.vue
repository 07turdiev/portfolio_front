<script setup>
import { useI18n } from 'vue-i18n'
import CategoryCard from './CategoryCard.vue'

const { t } = useI18n()

const categories = [
  { key: 'parties', icon: 'building' },
  { key: 'candidates', icon: 'users' },
  { key: 'local_observers', icon: 'shield-check' },
  { key: 'foreign_observers', icon: 'globe' },
  { key: 'local_media', icon: 'megaphone' },
  { key: 'foreign_media', icon: 'globe-search' },
  { key: 'voters', icon: 'user-check' }
]
</script>

<template>
  <section class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
    <CategoryCard
      v-for="cat in categories"
      :key="cat.key"
      :title="t(`categories.${cat.key}`)"
      :icon="cat.icon"
    />
  </section>
</template>
