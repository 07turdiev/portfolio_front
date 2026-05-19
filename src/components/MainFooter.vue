<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <footer
    class="bg-brand-footer text-[#92a8cc] py-5 px-6 text-sm mt-auto w-full"
  >
    <div
      class="flex flex-col md:flex-row items-center justify-between gap-4"
    >
      <div>{{ t('footer.copyright') }}</div>
      <div>
        <a href="https://madaniyat.uz" target="_blank" class="hover:text-white transition-colors">madaniyat.uz</a>
        <span class="text-[#4b6a9c]"> | </span>
        <a href="https://madaniyhayot.uz" target="_blank" class="hover:text-white transition-colors">madaniyhayot.uz</a>
      </div>
    </div>
    <!-- Ishlab chiquvchi -->
    <div class="border-t border-[#2a3854]/60 mt-4 pt-3 text-center text-xs text-[#7188ad]">
      <span class="font-semibold tracking-wide">"MADANIY HAYOT MEDIA MARKETING MARKAZI"</span>
      MCHJ {{ t('footer.developedBy') }}
    </div>
  </footer>
</template>
