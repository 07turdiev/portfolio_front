<script setup>
defineProps({
  icon: { type: String, required: true }
})
</script>

<template>
  <svg
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <!-- Barchasi: 2x2 katak -->
    <template v-if="icon === 'all'">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
    </template>

    <!-- Teatr va sirk: ikki teatr niqobi -->
    <template v-else-if="icon === 'theater'">
      <path
        d="M13 6c-2.8 0-4.8.8-4.8.8v4.6c0 3.3 2.1 6.1 4.8 6.1s4.8-2.8 4.8-6.1V6.8S15.8 6 13 6Z"
      />
      <path d="M8.2 4.3C6 4.5 4 5.2 4 5.2v4.3c0 2.4 1.1 4.6 2.8 5.8" />
      <path d="M10.9 10.4c.5-.5 1.4-.5 1.9 0" />
      <path d="M13.4 10.4c.5-.5 1.4-.5 1.9 0" />
      <path d="M10.8 13.1c.9 1 3.4 1 4.3 0" />
    </template>

    <!-- Ta'lim: akademik qalpoq -->
    <template v-else-if="icon === 'education'">
      <path d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4Z" />
      <path d="M6 10.3v3.9c0 1.6 2.7 2.8 6 2.8s6-1.2 6-2.8v-3.9" />
      <path d="M21.5 8.7v4.6" />
      <circle cx="21.5" cy="14" r="0.85" fill="currentColor" stroke="none" />
    </template>

    <!-- Nomoddiy madaniy meros: tarixiy bino -->
    <template v-else-if="icon === 'heritage'">
      <path d="M3 9.5 12 4l9 5.5" />
      <path d="M3 9.5h18" />
      <path d="M5 9.5v8M9.67 9.5v8M14.33 9.5v8M19 9.5v8" />
      <path d="M3.5 17.5h17M2.5 20.5h19" />
    </template>

    <!-- Kino: klapperbord -->
    <template v-else-if="icon === 'cinema'">
      <path d="M3 8.5h18v-3H3z" />
      <path d="M7.5 5.5 5.5 8.5M12 5.5 10 8.5M16.5 5.5 14.5 8.5" />
      <path d="M3 8.5h18V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5Z" />
    </template>

    <!-- Konsert-tomosha: mikrofon -->
    <template v-else-if="icon === 'concert'">
      <path d="M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
      <path d="M9.2 8h5.6M9.2 10h5.6" />
      <path d="M6 11a6 6 0 0 0 12 0" />
      <path d="M12 17v4" />
      <path d="M8.5 21h7" />
    </template>
  </svg>
</template>
