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
    <!-- Qahramon: 5-pointed star -->
    <template v-if="icon === 'hero-star'">
      <path
        d="M12 2.5l2.95 6.65 7.05.65-5.4 4.7 1.7 7L12 17.9l-6.3 3.6 1.7-7L2 9.8l7.05-.65L12 2.5Z"
      />
    </template>

    <!-- Faxriy unvon: medal + ribbon (star inside) -->
    <template v-else-if="icon === 'honorary-ribbon'">
      <circle cx="12" cy="9" r="5.5" />
      <path
        d="M12 5.6l1.05 2.5 2.7.25-2.05 1.85.6 2.65L12 11.55l-2.3 1.3.6-2.65L8.25 8.35l2.7-.25L12 5.6Z"
      />
      <path d="M7.5 13.6 5 22l7-3.5 7 3.5-2.5-8.4" />
    </template>

    <!-- Orden: 4-pointed star burst -->
    <template v-else-if="icon === 'order'">
      <path d="M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2 2-8Z" />
      <circle cx="12" cy="12" r="2.5" />
    </template>

    <!-- Medal: triangle ribbon + circular coin with star -->
    <template v-else-if="icon === 'medal'">
      <path d="M8 3l4 7M16 3l-4 7" />
      <circle cx="12" cy="16" r="6" />
      <path
        d="M12 13.4l.75 1.6 1.75.2-1.3 1.2.4 1.7L12 17.2l-1.6.9.4-1.7-1.3-1.2 1.75-.2L12 13.4Z"
      />
    </template>

    <!-- Faxriy yorliq: certificate with corner fold + ribbon seal -->
    <template v-else-if="icon === 'diploma'">
      <path d="M5 4h11l3 3v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
      <path d="M16 4v3h3" />
      <path d="M8 11h7M8 14h7M8 17h4" />
      <circle cx="16.5" cy="18.5" r="2" />
    </template>
  </svg>
</template>
