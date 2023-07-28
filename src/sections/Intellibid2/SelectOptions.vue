<script setup>
import { inject, ref, onMounted } from 'vue'
import autosave from '../../lib/autosave'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import ProgressBar from 'primevue/progressbar'
import router from '../../router'

const interactionState = inject('interactionState')
const setOptionType = inject('setOptionType')

onMounted(() => {
  window.addEventListener('pagehide', () => autosave(interactionState))
  window.addEventListener('beforeunload', () => autosave(interactionState))
})

const options = ref([
  {
    label: 'Generate requirement response',
    value: 'respond',
  },
  {
    label: 'Explain this requirement',
    value: 'explain',
  },
  {
    label: 'Tips & suggestions for this requirement',
    value: 'suggestions',
  },
  {
    label: 'Summarize selected text',
    value: 'summarize',
  },
  {
    label: 'Make this text more detailed and informative',
    value: 'add-detail',
  },
  {
    label: 'Convert this text to a single narrative',
    value: 'narrative',
  },
  {
    label: 'Convert this text into bullet points',
    value: 'bullet-points',
  },
  {
    label: 'Autocomplete based on this text',
    value: 'autocomplete',
  },
])

const save = () => {
  autosave(interactionState)
  router.push('/assets')
}
</script>
<style>
.multiselect-dropdown {
  max-height: 12rem !important;
}

.p-progressbar-value {
  background-color: rgb(101, 87, 245) !important;
}
</style>
<template>
  <div class="flex w-full justify-between items-end pb-2">
    <p class="text-sm font-bold">Select desired change to highlighted text</p>
  </div>
  <div
    class="flex justify-center items-center px-[25px] flex-wrap w-full py-3 border border-y-2"
    v-if="!interactionState.processingResponse"
  >
    <!--* Weird UI bug when using prime vue Button, using Tag avoids that.-->
    <button
      type="submit"
      v-tooltip.bottom="
        !interactionState.current && 'Please select text to generate'
      "
      @click="() => setOptionType(option.value)"
      class="rounded m-2 whitespace-nowrap disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed transition-all duration-300 hover:opacity-80 transition-all duration-300 w-min-content"
      :disabled="
        interactionState.processingResponse || !interactionState.current
      "
      v-for="option in options"
    >
      <Tag :value="option.label" class="whitespace-nowrap" />
    </button>
  </div>
  <div class="w-full flex items-center border border-y-2 h-[62px]" v-else>
    <div class="w-full">
      <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
    </div>
  </div>
</template>
