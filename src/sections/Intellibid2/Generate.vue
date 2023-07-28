<script setup>
import 'tw-elements'
import { inject, reactive, ref } from 'vue'
import InputConfig from '../../components/InputConfig.vue'
import * as marked from 'marked'
import PromptArea from './PromptArea.vue'
import { useModal } from 'vue-final-modal'
import Modal from '../../components/Modals/Modal.vue'
import ResourcePickerModal from '../../components/Modals/ResourcePickerModal.vue'
import ResourceFormModal from '../../components/Modals/ResourceFormModal.vue'
import InteractionWrapper from '../../components/InteractionWrapper.vue'
import ConvoWrapper from './ConvoWrapper.vue'
import toast from '../../lib/toast'
import api from '../../lib/axiosClient'
import autosave from '../../lib/autosave'
import getCharacterLimit from '../../lib/getCharacterLimit'

const interactionState = inject('interactionState')
const agree = inject('agree')
const setChecked = inject('setChecked')

const state = reactive({
  activeTab: 0,
  checkedCache: [],
})

const convoWrapper = ref(null)
const convoWrapper2 = ref(null)

const { open: openAttach, close: closeAttach } = useModal({
  component: Modal,
  attrs: {
    parentState: {
      ...interactionState,
      limit: 5,
    },
    isLarge: true,
    noCloseBtn: true,
    onClose() {
      closeAttach()
    },
    onSetCurrent(pids) {
      console.log('pids', pids)
      state.checkedCache = pids
    },
    onConfirm() {
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

const setTab = (e, num) => {
  e.preventDefault()
  state.activeTab = num
  setTimeout(() => {
    if (convoWrapper.value)
      convoWrapper.value.scrollTop = convoWrapper.value.scrollHeight
    if (convoWrapper2.value)
      convoWrapper2.value.scrollTop = convoWrapper2.value.scrollHeight
  }, 10)
}

const generate = async () => {
  if (
    interactionState.current.length >=
    getCharacterLimit(interactionState, 'maximum-highlight')
  )
    toast.error(
      `You selected ${
        interactionState.current.length
      } characters. The maximum allowed is ${getCharacterLimit(
        interactionState,
        'maximum-highlight'
      )}, please reselect less text and try again`
    )
  else {
    try {
      interactionState.loading = true
      const payload = {
        prompt: interactionState.current,
        inputs: {
          industry: 'industry',
          company: interactionState.promptData.company,
          agency: interactionState.promptData.agency,
          type: interactionState.promptData.type,
          length: interactionState.promptData.length,
          custom_words: interactionState.promptData.custom_words,
          sentiment: interactionState.promptData.sentiment,
          key_words: interactionState.promptData.key_words,
        },
        resource_pids: interactionState.checked,
        shared_resources: interactionState.checked,
        use_my_resources: interactionState.useResources,
        use_ext_resources: interactionState.useExternal,
        chains: true,
        ib2_action: interactionState.optionType,
      }
      if (!interactionState.useResources) delete payload.resource_pids
      else if (!interactionState.useExternal) delete payload.shared_resources

      api
        .post(`assetz/${interactionState.asset.pid}/interaction`, payload)
        .then(async (res) => {
          let temp = interactionState.artifact
          const lastInteraction = res.interactions[res.interactions.length - 1]
          interactionState.artifact = `${temp} ${
            temp && '<br />'
          } <p class="ql-align-right"><strong>${
            lastInteraction.prompt
          }</strong></p> <br /> ${lastInteraction.response}`
          interactionState.loading = false
          autosave(interactionState)
        })
        .catch((err) => {
          toast.error(err.message)
          console.log(err)
          interactionState.loading = false
        })
    } catch (err) {
      toast.error(err.message)
      console.log(err)
      interactionState.loading = false
    }
  }
}
</script>
<style src="@vueform/multiselect/themes/default.css"></style>

<template>
  <div
    class="shadow-lg flex flex-col w-full px-4 h-[85vh] md:mb-0 overflow-y-auto bg-gray-100 pt-4 items-center"
  >
    <div
      class="flex w-full justify-between mb-6 pb-4 pt-2 border-b-2 border-gray-300"
      v-if="interactionState.agreed"
    >
      <div class="flex flex-col items-center">
        <div class="flex">
          <button
            class="w-[200px] mr-4 bg-psci hover:bg-gold text-white hover:text-black py-2 px-3 rounded focus:outline-none focus:shadow-outline"
            :style="{ opacity: state.activeTab === 0 ? 1 : 0.25 }"
            @click="setTab($event, 0)"
          >
            Generate AI text mode
          </button>
          <button
            class="w-[200px] bg-psci hover:bg-gold text-white hover:text-black py-2 px-3 rounded focus:outline-none focus:shadow-outline"
            :style="{ opacity: state.activeTab === 1 ? 1 : 0.25 }"
            @click="setTab($event, 1)"
          >
            AI Research mode
          </button>
        </div>
        <!--<p class="text-right italic text-sm text-gray-600 pt-2">
          Choose mode based on current objective
        </p>-->
      </div>
    </div>

    <form
      class="flex flex-col w-full h-full ease-in-out duration-300"
      @submit.stop.prevent="generate"
    >
      <InputConfig
        :customWordLimit="getCharacterLimit(interactionState, 'customWords')"
      />

      <p class="w-full mb-8 mt-4 text-gray-500 text-s">
        Section 2
        <!-- <span class="italic">(required)</span> -->
        — Select desired behavior, hightlight text and apply
      </p>

      <div class="relative w-full flex-1 mt-2 bg-white">
        <PromptArea />
      </div>
    </form>
    <div
      class="w-full h-full !max-h-[75vh] overflow-x-hidden"
      ref="convoWrapper2"
      v-if="interactionState.agreed && state.activeTab === 1"
    >
      <!--Encapsulate the convo comp with it's own state separate from intellibid-2-->
      <InteractionWrapper>
        <template #alternatePage>
          <ConvoWrapper />
        </template>
      </InteractionWrapper>
    </div>
    <div
      class="w-full flex flex-col items-center h-full"
      v-if="!interactionState.agreed"
    >
      <img alt="Alert icon" src="@/assets/alert_120x.png" width="80" />
      <div
        class="flex justify-center w-full mt-3 pb-8 px-4 border-b-2 border-gray-400"
      >
        <div class="space-y-3 max-w-[600px] font-bold">
          <p
            v-html="marked.parse(interactionState.asset.convo_preface)"
            v-if="interactionState?.asset?.convo_preface"
          ></p>
        </div>
      </div>

      <div class="flex w-full mt-auto items-center p-3 mt-auto">
        <button
          @click="agree"
          class="w-full bg-psci hover:bg-gold text-white hover:text-black py-3 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          I understand and am ready to begin.
        </button>
      </div>
    </div>
  </div>
</template>
