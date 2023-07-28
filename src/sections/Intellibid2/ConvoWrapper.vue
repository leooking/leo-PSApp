<script setup>
import { inject, reactive, onMounted } from 'vue'
import { useModal } from 'vue-final-modal'
import Modal from '../../components/Modals/Modal.vue'
import Convo from '../Convo/Convo.vue'
import Toggle from '../../components/Toggle.vue'
import PromptAssistantModal from '../../components/Modals/PromptAssistantModal.vue'
import ExternalPickerModal from '../../components/Modals/ExternalPickerModal.vue'
import ResourcePickerModal from '../../components/Modals/ResourcePickerModal.vue'
import ResourceFormModal from '../../components/Modals/ResourceFormModal.vue'

const state = reactive({
  checkedCache: [],
  checked: [],
})
const interactionState = inject('interactionState')
const setChecked = inject('setChecked')
const setPrompt = inject('setPrompt')
const setState = inject('setState')
const fetchConvo = inject('fetchConvo')

onMounted(async () => {
  await fetchConvo(interactionState.asset.pid)
})

const { open: openCreateResource, close: closeCreateResource } = useModal({
  component: Modal,
  attrs: {
    isLarge: true,
    onClose() {
      closeCreateResource()
    },
    onConfirm(pid) {
      setChecked([...interactionState.checked, pid])
      openAttach()
    },
    onChangeModal() {
      closeCreateResource()
      openAttach()
    },
  },
  slots: {
    default: ResourceFormModal,
  },
})

const { open: openAssistant, close: closeAssistant } = useModal({
  component: Modal,
  attrs: {
    isLarge: true,
    parentState: state,
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

const { open: openAttach, close: closeAttach } = useModal({
  component: Modal,
  attrs: {
    parentState: interactionState,
    isLarge: true,
    noCloseBtn: true,
    onClose() {
      state.checkedCache = {}
      closeAttach()
    },
    onSetCurrent(pids) {
      state.checkedCache = pids
    },
    onConfirm(pid) {
      setChecked(state.checkedCache)
      localStorage.setItem(
        'attachedResources',
        JSON.stringify(interactionState.checked)
      )
      closeAttach()
    },
    onChangeModal() {
      closeAttach()
      openCreateResource()
    },
  },
  slots: {
    default: ResourcePickerModal,
  },
})

const { open: openAttachExternal, close: closeAttachExternal } = useModal({
  component: Modal,
  attrs: {
    parentState: interactionState,
    isLarge: true,
    noCloseBtn: true,
    blockCloseOnOverlayClick: true,
    onClose(noClear) {
      closeAttachExternal()
      if (!noClear) setState('externalResource', null)
    },
    onSetCurrent(pid) {
      state.checkedCache = [pid]
    },
    onConfirm() {
      setChecked(state.checkedCache)
      closeAttachExternal()
    },
  },
  slots: {
    default: ExternalPickerModal,
  },
})

const toggleResources = (e) => {
  setState('useResources', e.target.checked)
  setState('useExternal', false)
  setChecked([])
  sessionStorage.setItem(`showResources`, e.target.checked)

  if (e.target.checked) openAttach()
}

const toggleExternal = (e) => {
  setState('useResources', false)
  setChecked([])
  setState('useExternal', e.target.checked)
  if (e.target.checked) openAttachExternal()
  else setState('externalResource', null)
}
</script>
<template>
  <div ref="convoWrapper" class="relative w-full">
    <Convo
      :classes="interactionState.agreed ? 'max-h-[65vh]' : 'max-h-[70vh]'"
    />
    <div class="flex pb-4" v-if="interactionState.agreed">
      <button
        class="w-[200px] h-[50px] bg-psci hover:bg-gold text-white hover:text-black py-2 px-3 rounded focus:outline-none focus:shadow-outline"
        @click="openAssistant"
      >
        Prompt Assistant
      </button>

      <div class="ml-8 flex w-full justify-between font-bold">
        <p class="text-sm">Data Sources:</p>
        <div class="flex w-full text-sm">
          <Toggle
            :checked="interactionState.useResources"
            :toggle="toggleResources"
            for="resources"
            :isDisabled="true"
            tooltip="Select from your internal resources and files to use to extract insights and ask questions against. You can select a single file for precision or a folder/multiple resources for a larger search'"
          >
            Our Resources
          </Toggle>

          <div class="flex justify-between items-center text-sm ml-6">
            <Toggle
              :checked="interactionState.useExternal"
              :toggle="toggleExternal"
              for="external"
              :isDisabled="true"
              tooltip="Select from a list of provided external sources to get unique insights and data from. You can only select a single external resource at a time for searching/data extraction'"
            >
              External Sources
            </Toggle>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
