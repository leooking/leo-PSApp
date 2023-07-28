<script setup>
import { inject, ref, reactive } from 'vue'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Button from 'primevue/button'
import router from '../../router'
import autosave from '../../lib/autosave'
import Settings from './Settings.vue'
import Convo from '../Convo/Convo.vue'
import PromptArea from './PromptArea.vue'
import Disclaimer from '../../components/Disclaimer.vue'
import PromptLibraryBtn from '../../components/Buttons/PromptLibraryBtn.vue'
import DataSourcesToggles from '../../components/Buttons/DataSourcesToggles.vue'
import PromptBuilderTool from '../../components/PromptBuilderTool.vue'
import handlePromptBuilder from '../../lib/handlePromptBuilder'

const state = reactive({
  promptBuilder: {
    code: 0,
    label: '',
  },
})

const active = ref(2)
const interactionState = inject('interactionState')
const fetchConvo = inject('fetchConvo')

const handleTab = async (e) => {
  // * To convert help tab into link without letting it change to its empty tabPanel
  if (e.index === 3) {
    window.open(interactionState?.asset?.user_guide_url, '_blank')
    active.value = 2
  } else if (e.index === 1) await fetchConvo(interactionState?.asset?.pid)
  else active.value = e.index
}

const toggleSeason = (value, code) => {
  state.promptBuilder.label = value
  state.promptBuilder.code = code

  handlePromptBuilder(state.promptBuilder, interactionState)
}
const save = () => {
  autosave(interactionState)
  router.push('/assets')
}
</script>
<style>
.p-tabview-panel {
  min-height: 75vh;
}
.p-tabview-header:nth-child(4) {
  margin-left: auto !important;
}
</style>
<template>
  <TabView
    :style="{ maxHeight: '85vh' }"
    v-model:activeIndex="active"
    v-on:tab-click="handleTab"
  >
    <TabPanel v-if="interactionState.asset.pid">
      <template #header>
        <i class="pi pi-pencil mr-2"></i>
        <span>Draft</span>
      </template>
      <PromptArea />
    </TabPanel>
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
        <div class="flex pb-4 gap-x-2" v-if="interactionState.agreed">
          <PromptLibraryBtn class="max-w-[150px]" />
          <PromptBuilderTool class="w-[400px]" @toggle-season="toggleSeason" />
          <DataSourcesToggles isRow />
        </div>
        <Disclaimer v-if="interactionState.agreed" />
      </div>
    </TabPanel>
    <TabPanel>
      <template #header>
        <i class="pi pi-cog mr-2"></i>
        <span>Settings</span>
      </template>
      <Settings />
    </TabPanel>
    <TabPanel v-if="interactionState?.asset?.user_guide_url">
      <template #header :style="{ marginLeft: 'auto' }">
        <i class="pi pi-question-circle mr-2"></i>
        <span>Help</span>
      </template>
    </TabPanel>
    <TabPanel headerClass="[&>a]:!p-1 [&>a]:!border-0 [&>a]:!mr-2 [&>a]:!mt-2">
      <template #header :style="{ marginLeft: 'auto' }">
        <Button
          v-tooltip.bottom="'Save and Exit'"
          type="button"
          iconClass="savebt"
          class="bg-purple"
          icon="pi pi-save"
          size="small"
          @click.prevent="save"
        />
      </template>
    </TabPanel>
  </TabView>
</template>
