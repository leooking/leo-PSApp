<script setup>
import GeneratorModal from './Modals/generatorModal.vue'
import { useModal } from 'vue-final-modal'
import Modal from './Modals/Modal.vue'

const props = defineProps({
  generator: Object,
  project: Object,
  projectsList: Array,
})

const { open, close } = useModal({
  component: Modal,
  attrs: {
    generator: props.generator,
    projectsList: props.projectsList,
    project: props.project,
    onClose() {
      close()
    },
  },
  slots: {
    default: GeneratorModal,
  },
})
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
<template>
  <div class="min-h-[250px] max-w-[500px] shadow-md bg-white rounded-md w-full">
    <div
      :class="`w-full flex justify-between items-center p-2 ${
        props.generator.scope === 'private' ? 'bg-indigo-900' : 'bg-psci'
      }`"
    >
      <h4 class="font-bold text-white">{{ props.generator?.name }}</h4>
      <span
        class="material-symbols-outlined text-white mr-2"
        v-if="props.generator.scope === 'private'"
        >shield_lock</span
      >
    </div>
    <div class="p-2 h-[85%] min-h-[250px] flex flex-col">
      <p>{{ props.generator?.card_description }}</p>

      <!-- trigger modal -->
      <button
        @click="open"
        type="button"
        :class="`mt-auto hover:bg-gold text-white hover:text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline focus:ring-0 active:bg-psci active:shadow-lg transition duration-150 ease-in-out w-full ${
          props.generator.scope === 'private' ? 'bg-indigo-900' : 'bg-psci'
        }`"
      >
        Launch
      </button>
    </div>
  </div>
</template>
