<script setup>
import { ref } from 'vue'
import { inject } from 'vue'

const setPrompt = inject('setPrompt')
const interactionState = inject('interactionState')
</script>
<style>
.p-tooltip {
  max-width: 400px !important;
}
</style>
<template>
  <div class="flex space-x-2">
    <button
      v-for="followUp in interactionState.follow_up_questions"
      :class="`bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded`"
      @click="setPrompt(followUp)"
    >
      {{ followUp }}
    </button>
  </div>
</template>