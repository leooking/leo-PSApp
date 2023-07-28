<script setup>
import { inject, onMounted, reactive } from 'vue'
import ResourcePickerModal from '../Modals/ResourcePickerModal.vue'
import ResourceFormModal from '../Modals/ResourceFormModal.vue'
import ExternalPickerModal from '../Modals/ExternalPickerModal.vue'
import { useModal } from 'vue-final-modal'
import Modal from '../Modals/Modal.vue'
import Toggle from '../Toggle.vue'
import formatChecked from '../../lib/formatChecked'

const props = defineProps({
  isRow: Boolean,
})

const state = reactive({
  projectModalOpen: false,
  saveResources: false,
  checkedCache: {},
  prompt: null,
})

const interactionState = inject('interactionState')
const setOptionType = inject('setOptionType')
const setChecked = inject('setChecked')
const setPrompt = inject('setPrompt')
const setState = inject('setState')

onMounted(() => {
  // * tw-elements toggle won't change unless toggle is actually clicked
  const resourceToggle = document.querySelector('#resources')
  if (sessionStorage.getItem(`showResources`) === true && resourceToggle)
    resourceToggle.click()
  // if(sessionStorage.getItem(`saveResources`) === 'true') document.querySelector('#saveResources').click()
  if (localStorage.getItem('attachedResources') && state.saveResources) {
    setChecked(JSON.parse(localStorage.getItem('attachedResources')))
  }
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
const toggleSaveResources = (e) => {
  state.saveResources = e.target.checked
  sessionStorage.setItem(`saveResources`, e.target.checked)
}

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
      const updated = formatChecked(state.checkedCache)
      setChecked(updated, state.checkedCache)

      interactionState.checkedCache = state.checkedCache
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

const { open: openAttachSpecial, close: closeAttachSpecial } = useModal({
  component: Modal,
  attrs: {
    parentState: interactionState,
    isLarge: true,
    noCloseBtn: true,
    blockCloseOnOverlayClick: true,
    purpose: 'premium',
    onClose(noClear) {
      closeAttachSpecial()
    },
    onSetCurrent(pids) {
      state.checkedCache = pids
    },
    onConfirm() {
      const updated = formatChecked(state.checkedCache, true)

      setChecked(updated, state.checkedCache)
      interactionState.checkedCache = state.checkedCache
      closeAttachSpecial()
    },
  },
  slots: {
    default: ResourcePickerModal,
  },
})

const { open: openCreateResource, close: closeCreateResource } = useModal({
  component: Modal,
  attrs: {
    isLarge: true,
    onClose() {
      closeCreateResource()
    },
    onConfirm(pid) {
      let current = interactionState.checkedCache
      current[pid] = {
        checked: true,
        partialChecked: false,
      }
      const formatted = formatChecked(current)
      setChecked(formatted, current)
      closeCreateResource()
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

const showDataSourceText = () => {
  const asset = interactionState.asset

  if (props.isRow) {
    if (asset.my_resources_visible || asset.ext_resources_visible) return true
    else return false
  } else if (
    !asset.my_resources_visible &&
    !asset.ext_resources_visible &&
    !interactionState.usePremium
  )
    return false
  else return true
}
</script>
<style>
.p-tooltip {
  max-width: 400px !important;
}
</style>
<template>
  <div
    :class="`w-full flex font-bold space-y-2 text-sm ${
      props.isRow ? 'flex-row justify-start items-center ml-4' : 'flex-col ml-9'
    }`"
  >
    <p class="pr-4 mt-2" v-if="showDataSourceText()">Data Sources:</p>

    <div
      class="flex items-center justify-between mr-2"
      v-if="!interactionState.usePremium"
      v-tooltip.right="
        'Select from your internal resources and files to use to extract insights and ask questions against. You can select a single file for precision or a folder/multiple resources for a larger search'
      "
    >
      <Toggle
        :checked="interactionState.useResources"
        :toggle="toggleResources"
        for="resources"
        v-if="interactionState?.asset?.my_resources_visible"
      >
        Our Resources
        <span class="font-normal text-gray-400">(your team's uploads)</span>
      </Toggle>
      <button
        @click="openAttach"
        class="text-indigo-500 ml-2 material-icons md-24"
        v-if="interactionState.useResources"
      >
        sources
      </button>
    </div>

    <div
      class="flex items-center justify-between mr-2"
      v-if="!interactionState.usePremium"
      v-tooltip.right="
        'Select from a list of provided external sources to get unique insights and data from. You can only select a single external resource at a time for searching/data extraction'
      "
    >
      <Toggle
        :checked="interactionState.useExternal"
        :toggle="toggleExternal"
        for="external"
        v-if="interactionState?.asset?.ext_resources_visible"
      >
        External Sources
        <span class="font-normal text-gray-400">(public data)</span>
      </Toggle>
      <button
        @click="openAttachExternal"
        class="text-indigo-500 ml-2 material-icons md-24"
        v-if="interactionState.useExternal"
      >
        sources
      </button>
    </div>

    <div
      class="flex items-center justify-between min-w-[200px]"
      v-if="interactionState.usePremium"
    >
      <Toggle
        :checked="true"
        :toggle="() => {}"
        for="premium"
        :isDisabled="true"
        @click="openAttachSpecial"
      >
        {{
          interactionState.asset.generator_type === 'ask_shipley'
            ? 'Ask Shipley'
            : 'Ask Lohfeld'
        }}
      </Toggle>
      <button
        @click="openAttachSpecial"
        class="text-indigo-500 ml-2 material-icons md-24"
      >
        sources
      </button>
    </div>
  </div>
</template>
