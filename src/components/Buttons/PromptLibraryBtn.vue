<script setup>
import { inject } from 'vue'
import PromptAssistantModal from '../Modals/PromptAssistantModal.vue'
import { useModal } from 'vue-final-modal'
import Modal from '../Modals/Modal.vue'

const props = defineProps({
  classes: String,
})

const setPrompt = inject('setPrompt')
const interactionState = inject('interactionState')

const { open: openAssistant, close: closeAssistant } = useModal({
  component: Modal,
  attrs: {
    isLarge: true,
    noCloseBtn: true,
    onClose() {
      closeAssistant()
    },
    onConfirm(prompt) {
      setPrompt(prompt)
      closeAssistant()
    },
  },
  slots: {
    default: PromptAssistantModal,
  },
})
</script>
<style>
.p-tooltip {
  max-width: 400px !important;
}
</style>
<template>
  <button
    v-tooltip.right="
      'View a list of preloaded featured prompts that we recommend you try out. You can also save your favorite prompts and share them within your teams for others to use and explore'
    "
    :class="`w-full bg-psci hover:bg-gold text-white hover:text-black py-2 px-3 rounded focus:outline-none focus:shadow-outline ${props.classes}`"
    @click="openAssistant"
    v-if="interactionState?.asset?.prompt_assistant_visible"
  >
    Prompt Library
  </button>
</template>
