<script setup>
import { reactive, inject } from 'vue'

const state = reactive({
  isOpen: true,
})

const parentProps = inject('props')

const props = defineProps({
  notification: Object,
  isTopBar: Boolean,
})

// * Tailwind generates a style file based on classes found in the code, dynamic classes therefore won't be rendered. This is a solution for that.
const bgColor = () => {
  const colors = {
    'bg-red-500': 'bg-red-500',
    'bg-sky-300': 'bg-sky-300',
    'bg-slate-400': 'bg-slate-400',
  }
  if (props.notification?.top_bar_color)
    return colors[props.notification.top_bar_color]
  else return 'bg-purple'
}
</script>

<template>
  <div
    :class="
      props.isTopBar &&
      `relative flex w-full items-start justify-around !w-full py-3 z-[1000] ${bgColor()}`
    "
    v-if="state.isOpen"
  >
    <div class="w-[50px]" />
    <p
      :class="
        isTopBar ? 'text-center text-white' : 'text-center text-xl font-bold'
      "
    >
      {{
        isTopBar
          ? notification?.display_text
          : parentProps?.parentState?.display_text
      }}
    </p>
    <button
      class="text-white material-icons"
      @click="state.isOpen = false"
      v-if="props.isTopBar"
    >
      close
    </button>
  </div>
</template>
