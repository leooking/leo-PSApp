<script setup>
import {
  ref,
  reactive,
  defineProps,
  onMounted,
  onUnmounted,
  nextTick,
} from 'vue'
const state = reactive({ interval: null, percent: 0 })

const props = defineProps({ name: String, deleteFunc: Function })
const loader = ref()

onMounted(async () => {
  await nextTick()
  console.log(loader.value)
  loader.value.style.width = '0%'
  state.percent = 0
  state.interval = setInterval(() => {
    if (state.percent < 100 && loader.value) {
      state.percent += 0.1
      loader.value.style.width = state.percent + '%'
    }
  }, 10)
  state.interval = setTimeout(() => {
    if (loader.value) loader.value.style.width = '100%'
  }, 1000)
})

onUnmounted(() => {
  clearInterval(state.interval)
})
</script>
<template lang="">
  <div class="w-full bg-gray-200 h-1">
    <div class="bg-blue-600 h-1" ref="loader" :style="{ width: 0 }"></div>
  </div>
</template>
