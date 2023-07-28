<script setup>
import { inject, ref, reactive } from 'vue'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Convo from '../Convo/Convo.vue'
import Toggle from '../../components/Toggle.vue'
import ExternalPickerModal from '../../components/Modals/ExternalPickerModal.vue'
import ResourcePickerModal from '../../components/Modals/ResourcePickerModal.vue'
import ResourceFormModal from '../../components/Modals/ResourceFormModal.vue'
import { useModal } from 'vue-final-modal'
import Modal from '../../components/Modals/Modal.vue'
import formatChecked from '../../lib/formatChecked'
import Disclaimer from '../../components/Disclaimer.vue'
import * as marked from 'marked'
import CascadeSelect from 'primevue/cascadeselect'
import PromptLibraryBtn from '../../components/Buttons/PromptLibraryBtn.vue'
import PromptBuilderTool from '../../components/PromptBuilderTool.vue'
import handlePromptBuilder from '../../lib/handlePromptBuilder'
import DataSourceToggles from '../../components/Buttons/DataSourcesToggles.vue'
import Button from 'primevue/button'
import router from '../../router'

const state = reactive({
  checkedCache: [],
  checked: [],
  promptBuilder: {
    code: 0,
    label: '',
  },
})

const active = ref(0)
const interactionState = inject('interactionState')
const setChecked = inject('setChecked')
const setPrompt = inject('setPrompt')
const setState = inject('setState')
const fetchConvo = inject('fetchConvo')
const builder = ref()

const handleTab = async (e) => {
  // * To convert help tab into link without letting it change to its empty tabPanel
  if (e.index === 2) {
    window.open(interactionState?.asset?.user_guide_url, '_blank')
    active.value = 2
  } else active.value = e.index
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
      let formatted = formatChecked(state.checkedCache)
      setChecked(formatted, null, true)
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
  setState('useAltResources', e.target.checked)
  setState('useExternal', false)
  setChecked([], null, true)

  if (e.target.checked) openAttach()
}

const toggleExternal = (e) => {
  setState('useResources', false)
  setChecked([])
  setState('useExternal', e.target.checked)
  if (e.target.checked) openAttachExternal()
  else setState('externalResource', null)
}

const toggleSeason = (value, code) => {
  state.promptBuilder.label = value
  state.promptBuilder.code = code

  handlePromptBuilder(state.promptBuilder, interactionState)
}
</script>
<style>
.p-tabview-panel {
  min-height: 75vh;
}
.p-tabview-header:nth-child(3) {
  margin-left: auto !important;
}
.p-tabview-nav {
  justify-content: start;
}
</style>
<template>
  <div class="w-full flex justify-center winmore">
    <TabView
      :style="{ maxHeight: '85vh', maxWidth: '95%', width: '100%' }"
      v-model:activeIndex="active"
      v-on:tab-click="handleTab"
    >
      <TabPanel>
        <template #header>
          <i class="pi pi-bolt mr-2"></i>
          <span>AI Chat</span>
        </template>
        <div class="pt-4">
          <Convo
            :classes="interactionState.agreed ? 'max-h-[65vh]' : 'max-h-[70vh]'"
            :hideDisclaimer="true"
            :isAIChat="true"
          />
          <div class="flex pb-4" v-if="interactionState.agreed">
            <PromptLibraryBtn
              classes="!max-w-[150px]"
              v-if="interactionState.asset.prompt_assistant_visible"
            />
            <div
              v-tooltip.right="
                'Quickly build powerfully fine-tuned prompts with multiple options around tone, format, persona’s, etc.'
              "
              class="ml-2"
            >
              <PromptBuilderTool
                @toggle-season="toggleSeason"
                v-if="interactionState.asset.prompt_builder_visible"
              />
            </div>

            <DataSourceToggles :isRow="true" />
          </div>
          <Disclaimer v-if="interactionState.agreed" />
        </div>
      </TabPanel>
      <TabPanel>
        <template #header :style="{ marginLeft: 'auto' }">
          <i class="pi pi-book mr-2"></i>
          <span>Instructions</span>
        </template>
        <div class="relative">
          <a
            v-if="interactionState?.asset?.user_guide_url"
            :href="interactionState?.asset?.user_guide_url"
            target="__blank"
            class="absolute right-0 top-0"
          >
            <button
              class="bg-purple hover:bg-gold text-white hover:text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              User Guide
            </button>
          </a>

          <p
            v-html="marked.parse(interactionState.asset.sidebar_instruction)"
            v-if="interactionState?.asset?.sidebar_instruction"
          ></p>
        </div>
      </TabPanel>
      <TabPanel :disabled="!interactionState?.asset?.user_guide_url">
        <template #header :style="{ marginLeft: 'auto' }">
          <i class="pi pi-question-circle mr-2"></i>
          <span>Help</span>
        </template>
      </TabPanel>
      <TabPanel
        headerClass="[&>a]:!p-1 [&>a]:!border-0 [&>a]:!mr-2 [&>a]:!mt-2"
      >
        <template #header :style="{ marginLeft: 'auto' }">
          <Button
            v-tooltip.bottom="'Save and Exit'"
            type="button"
            iconClass="save"
            class="bg-purple"
            icon="pi pi-save"
            size="small"
            @click.prevent="(save) => router.push('/assets')"
          />
        </template>
      </TabPanel>
    </TabView>
  </div>
</template>
