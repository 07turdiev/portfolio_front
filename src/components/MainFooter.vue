<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <footer
    class="bg-brand-footer text-[#92a8cc] py-4 px-6 text-sm mt-auto w-full"
  >
    <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
      <div>{{ t('footer.copyright') }}</div>
      <div class="text-xs text-[#7188ad]">
        <span class="font-semibold tracking-wide">"MADANIY HAYOT MEDIA MARKETING MARKAZI"</span>
        MCHJ {{ t('footer.developedBy') }}
      </div>
      <div>
        <a href="https://madaniyat.uz" target="_blank" class="hover:text-white transition-colors">madaniyat.uz</a>
        <span class="text-[#4b6a9c]"> | </span>
        <a href="https://madaniyhayot.uz" target="_blank" class="hover:text-white transition-colors">madaniyhayot.uz</a>
      </div>
    </div>
  </footer>
</template>
