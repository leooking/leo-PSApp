<script setup>
import {reactive, onMounted, provide, useSlots, onBeforeUnmount} from 'vue'
import { useRoute } from 'vue-router'
import toast from '../lib/toast'
import api from '../lib/axiosClient'
import Sidebar from '../components/GeneratorSidebar.vue'
import formatResponse from '../lib/formatResponse'
import {assetNameEvent} from "@/lib/assetNameEvent";

const slots = useSlots()
const props = defineProps({
  enabled: Object,
  single: Boolean,
  noScrollbar: Boolean,
})

const state = reactive({
  asset: {},
  loading: false,
  current: null,
  artifact: null,
  processingPrompt: null,
  processingResponse: null,
  assetPid: null,
  revisionPid: null,
  agreed: false,
  projectModalOpen: false,
  data: null,
  checked: [],
  altChecked: [],
  checkedCache: {},
  altCheckedCache: {},
  externalResource: null,
  useResources: false,
  useExternal: false,
  usePremium: false,
  promptData: {
    industry: '',
    company: '',
    agency: '',
    type: '',
    textLength: '',
    custom_words: '',
    key_words: [],
    sentiment: [],
    prompt: '',
  },
  requirement: '',
  response: '',
  optionType: 'respond',
  promptBuilderText: {
    code: 0,
    label: '',
  },
})

const fetchConvo = async (pid) => {
  if (pid) {
    const asset = await api.get('assetz/' + pid + '?revision_check=false')

    state.asset = formatResponse(asset)
    console.log(state.asset);
    state.revisionPid = state.asset.revision_pid
    if (state.asset.generator_type === 'ask_lohfeld')
      state.asset.interactions.forEach((interaction) => {
        if (interaction.response) {
          try {
            const { response, citations } = JSON.parse(interaction.response)

            interaction.response = response
            if (citations) {
              citations.forEach((citation) => {
                citation.type = 'resource'
                citation.link_text = citation.resource_name
                citation.relevant_chunk = citation.relevant_chunk
              })
              console.log(citations)
              interaction.citations = citations
            }
          } catch (err) {
            interaction.response = interaction.response
          }
        }
      })
  }
}

onMounted(async () => {
  const route = useRoute()
  try {
    state.assetPid = route.params.pid

    if (route.params.pid) await fetchConvo(route.params.pid)

    const promptData = localStorage.getItem('promptData')
    if (promptData) {
      state.promptData = JSON.parse(promptData)
      state.promptData.prompt = ''
    }

    if (
      state.asset?.generator_type === 'ask_shipley' ||
      state.asset?.generator_type === 'ask_lohfeld'
    )
      state.usePremium = true
    else state.usePremium = false
  } catch (err) {
    toast.error(err.message)
  }

  assetNameEvent.emit('assetName', state.asset.name) // For the navigation bar
})

onBeforeUnmount(() => {
  assetNameEvent.emit('removeAssetName')
})

const agree = () => (state.agreed = true)
const setChecked = (checked, checkedCache, isAlt) => {
  if (isAlt) {
    state.altChecked = checked
    if (checkedCache) state.altCheckedCache = checkedCache
  } else {
    state.checked = checked
    if (checkedCache) state.checkedCache = checkedCache
  }
}
const setData = (data) => (state.data = data)
const setPromptData = (name, data) => {
  state.promptData[name] = data
  localStorage.setItem('promptData', JSON.stringify(state.promptData))
}
const setUseResources = (val) => (state.useResources = val)
const setPrompt = (val) => (state.promptData.prompt = val)
const setLoading = (val) => (state.loading = val)
const setRequirement = (val) => (state.requirement = val)
const setResponse = (val) => (state.response = val)
const setOptionType = (val) => (state.optionType = val)
const setState = (name, val) => (state[name] = val)

provide('setData', setData)
provide('setPromptData', setPromptData)
provide('setPrompt', setPrompt)
provide('setChecked', setChecked)
provide('setUseResources', setUseResources)
provide('agree', agree)
provide('interactionState', state)
provide('agree', agree)
provide('setLoading', setLoading)
provide('setRequirement', setRequirement)
provide('setResponse', setResponse)
provide('setOptionType', setOptionType)
provide('setState', setState)
provide('fetchConvo', fetchConvo)
</script>
<style scoped>
.noScrollbar {
  scrollbar-width: none;
}
.noScrollbar::-webkit-scrollbar {
  display: none;
}
</style>
<template>
  <div
    class="flex justify-between flex-col-reverse md:flex-row"
    v-if="!slots.alternatePage"
  >
    <slot
      name="alternateSidebar"
      v-if="slots.alternateSidebar && !props.single"
    />
    <Sidebar v-else-if="!props.single" />

    <div
      :class="`w-full overflow-y-auto overflow-x-hidden ${
        props.noScrollbar && 'noScrollbar'
      } ${props.single ? 'max-w-none' : 'md:max-w-[68%]'}`"
    >
      <slot name="default" />
    </div>
  </div>
  <div v-if="slots.alternatePage">
    <slot name="alternatePage" />
  </div>
</template>
