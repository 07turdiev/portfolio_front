<script setup>
import { onMounted } from 'vue'
import MainHeader from '../components/MainHeader.vue'
import DirectionsSection from '../components/DirectionsSection.vue'
import MapSection from '../components/MapSection.vue'
import PeopleList from '../components/PeopleList.vue'
import BirthdayCalendar from '../components/BirthdayCalendar.vue'
import AwardsSection from '../components/AwardsSection.vue'
import MainFooter from '../components/MainFooter.vue'
import PortfolioModal from '../components/PortfolioModal.vue'
import { usePortfolioData } from '../composables/usePortfolioData'
import { useUrlSync } from '../composables/useUrlSync'

const { load } = usePortfolioData()
useUrlSync()

onMounted(load)
</script>

<template>
  <MainHeader />

  <main class="flex-grow w-full px-6 py-6 flex flex-col gap-6">
    <DirectionsSection />

    <section
      class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[clamp(600px,70vh,800px)]"
    >
      <MapSection />
      <PeopleList />
    </section>

    <BirthdayCalendar />

    <AwardsSection />
  </main>

  <MainFooter />

  <PortfolioModal />
</template>
