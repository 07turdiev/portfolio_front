<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { formatNumber } from '../utils/format'

const props = defineProps({
  value: { type: Number, required: true },
  duration: { type: Number, default: 1000 },
  updateDuration: { type: Number, default: 600 },
  format: { type: Function, default: formatNumber }
})

const displayValue = ref(0)

let rafId = null
let startTimestamp = 0
let startValue = 0
let targetValue = 0
let currentDuration = props.duration
let hasAnimatedInitial = false

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

function tick(timestamp) {
  if (!startTimestamp) startTimestamp = timestamp
  const elapsed = timestamp - startTimestamp
  const progress = currentDuration > 0 ? Math.min(elapsed / currentDuration, 1) : 1
  const eased = easeOutCubic(progress)
  const next = startValue + (targetValue - startValue) * eased
  displayValue.value = progress >= 1 ? targetValue : Math.round(next)
  if (progress < 1) {
    rafId = requestAnimationFrame(tick)
  } else {
    rafId = null
  }
}

function animateTo(to, duration) {
  if (rafId) cancelAnimationFrame(rafId)
  startValue = displayValue.value
  targetValue = Number(to) || 0
  currentDuration = duration
  startTimestamp = 0
  rafId = requestAnimationFrame(tick)
}

onMounted(() => {
  if (Number(props.value) > 0) {
    animateTo(props.value, props.duration)
    hasAnimatedInitial = true
  }
})

watch(
  () => props.value,
  (newVal) => {
    if (!hasAnimatedInitial && Number(newVal) > 0) {
      animateTo(newVal, props.duration)
      hasAnimatedInitial = true
    } else {
      animateTo(newVal, props.updateDuration)
    }
  }
)

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <span>{{ format(displayValue) }}</span>
</template>
