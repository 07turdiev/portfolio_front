<script setup>
import DirectionIcon from './DirectionIcon.vue'
import AnimatedNumber from './AnimatedNumber.vue'

defineProps({
  label: { type: String, required: true },
  count: { type: Number, required: true },
  icon: { type: String, default: 'theater' },
  selected: { type: Boolean, default: false }
})

defineEmits(['select'])
</script>

<template>
  <button
    type="button"
    @click="$emit('select')"
    :class="[
      'rounded-xl p-5 flex items-center gap-4 border text-left transition-all duration-200',
      selected
        ? 'bg-brand-primary text-white border-brand-primary shadow-md'
        : 'bg-white text-brand-dark border-gray-100 shadow-sm hover:shadow-md'
    ]"
  >
    <div
      :class="[
        'p-3 rounded-lg shrink-0',
        selected ? 'bg-white/20 text-white' : 'bg-[#f0f4ff] text-brand-primary'
      ]"
    >
      <DirectionIcon :icon="icon" class="w-8 h-8" />
    </div>

    <div class="min-w-0">
      <div
        :class="[
          'text-[13px] font-medium mb-1 leading-snug',
          selected ? 'text-blue-100' : 'text-brand-text'
        ]"
      >
        {{ label }}
      </div>
      <div
        :class="[
          'text-2xl font-bold tracking-tight tabular-nums',
          selected ? 'text-white' : 'text-[#2a4387]'
        ]"
      >
        <AnimatedNumber :value="count" />
      </div>
    </div>
  </button>
</template>
