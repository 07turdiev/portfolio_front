<script setup>
defineProps({
  title: { type: String, required: true },
  icon: { type: String, default: 'building' }
})
</script>

<template>
  <a
    href="#"
    class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow min-h-[140px] gap-3"
  >
    <svg
      v-if="icon === 'building'"
      class="w-10 h-10 text-brand-dark"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
      />
    </svg>

    <svg
      v-else-if="icon === 'users'"
      class="w-10 h-10 text-brand-dark"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
      />
    </svg>

    <svg
      v-else-if="icon === 'shield-check'"
      class="w-10 h-10 text-brand-dark"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
      />
    </svg>

    <svg
      v-else-if="icon === 'globe'"
      class="w-10 h-10 text-brand-dark"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
      />
    </svg>

    <svg
      v-else-if="icon === 'megaphone'"
      class="w-10 h-10 text-brand-dark"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
      />
    </svg>

    <svg
      v-else-if="icon === 'globe-search'"
      class="w-10 h-10 text-brand-dark"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
      />
    </svg>

    <svg
      v-else-if="icon === 'user-check'"
      class="w-10 h-10 text-brand-dark"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
      />
      <path
        d="M15 11l2 2 4-4"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
      />
    </svg>

    <span class="font-bold text-brand-dark text-sm leading-tight">
      {{ title }}
    </span>
  </a>
</template>
