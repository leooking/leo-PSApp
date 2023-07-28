<script setup>
import { reactive, ref, inject } from 'vue'
import Multiselect from '@vueform/multiselect'
import CharacterCounter from '../../components/CharacterCounter.vue'
import ResourcePickerModal from '../../components/Modals/ResourcePickerModal.vue'
import { useModal } from 'vue-final-modal'
import Modal from '../../components/Modals/Modal.vue'
import getCharacterLimit from '../../lib/getCharacterLimit'
import ResourceFormModal from '../../components/Modals/ResourceFormModal.vue'
import formatChecked from '../../lib/formatChecked'

const props = defineProps({
  customWordLimit: Number,
})

const interactionState = inject('interactionState')
const setPromptData = inject('setPromptData')
const setChecked = inject('setChecked')

const state = reactive({
  checkedCache: [],
})

const textLengths = ref([
  '1 sentence',
  '2 or 3 sentences',
  '1 or 2 paragraphs',
  '3 or 4 paragraphs',
  '5 or 6 paragraphs',
])

const optionsSentiment = ref([
  'Innovative',
  'Descriptive',
  'Informative',
  'Persuasive',
  'Inspiring',
  'Confident',
  'Technical',
  'Educational',
  'Friendly',
  'Detailed',
  'Professional',
  'Credible',
])
const optionsKeywords = ref([
  'Reliable',
  'Innovative',
  'Trustworthy',
  'Experienced',
  'Effective',
  'Strategic',
  'Proven',
  'Secure',
  'High-quality',
  'User-friendly',
  'Customizable',
  'Cutting-edge',
  'Flexible',
  'Scalable',
  'Comprehensive',
])

const { open: openAttach, close: closeAttach } = useModal({
  component: Modal,
  attrs: {
    parentState: interactionState,
    isLarge: true,
    noCloseBtn: true,
    onOpen() {
      interactionState.limit = 5
    },
    onClose() {
      state.checkedCache = []
      closeAttach()
    },
    onSetCurrent(pids) {
      state.checkedCache = pids
    },
    onConfirm() {
      const updated = formatChecked(state.checkedCache)
      setChecked(updated, state.checkedCache)
      if (updated.length > 0) interactionState.useResources = true
      else interactionState.useResources = false
      closeAttach()
      closeCreateResource()
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
</script>
<template>
  <div>
    <h3 class="mb-4">Required</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div class="space-y-3 pb-7">
        <div class="grid grid-cols-3 items-center">
          <label for="" class="text-gray-500 font-bold"> Company: </label>
          <input
            required
            :value="interactionState.promptData.company"
            @input="setPromptData('company', $event.target.value)"
            class="col-span-2 h-8 drop-shadow-md placeholder:text-gray-400 text-sm px-2"
            type="text"
            placeholder="Your company"
          />
        </div>
        <div class="grid grid-cols-3 items-center">
          <label for="" class="text-gray-500 font-bold">
            Standout Attributes:
          </label>
          <div class="relative col-span-2 cursor-pointer">
            <Multiselect
              required
              v-model="interactionState.promptData.key_words"
              @change="setPromptData('key_word', $event)"
              placeholder="What your company stands for"
              :options="optionsKeywords"
              mode="tags"
              ref="multiselect"
              class="!text-sm !min-h-[32px] shadow-md !rounded-none !border-none cursor-pointer"
            />
          </div>
        </div>
        <div class="grid grid-cols-3 items-center">
          <label for="" class="text-gray-500 font-bold">
            Desired Sentiment:
          </label>
          <div class="relative col-span-2 cursor-pointer">
            <Multiselect
              required
              v-model="interactionState.promptData.sentiment"
              @change="setPromptData('sentiment', $event)"
              placeholder="Sentiment you would like to project"
              :options="optionsSentiment"
              mode="tags"
              ref="multiselect"
              class="!text-sm !min-h-[32px] shadow-md !rounded-none !border-none"
            />
          </div>
        </div>
      </div>
      <div class="space-y-3">
        <div class="grid grid-cols-3 items-center">
          <label for="" class="text-gray-500 font-bold"> Agency: </label>
          <input
            :value="interactionState.promptData.agency"
            @input="setPromptData('agency', $event.target.value)"
            class="col-span-2 h-8 drop-shadow-md placeholder:text-gray-400 text-sm px-2"
            type="text"
            placeholder="Agency name"
          />
        </div>
        <div class="grid grid-cols-3 items-center">
          <label for="" class="text-gray-500 font-bold">
            System/Service:
          </label>
          <input
            required
            :value="interactionState.promptData.type"
            @input="setPromptData('type', $event.target.value)"
            class="col-span-2 h-8 drop-shadow-md placeholder:text-gray-400 text-sm px-2"
            type="text"
            placeholder="System/service type for this bid"
          />
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 items-center">
          <label for="" class="text-gray-500 font-bold">
            Response Length:
          </label>
          <div class="relative col-span-2">
            <Multiselect
              required
              v-model="interactionState.promptData.textLength"
              @change="setPromptData('textLength', $event)"
              placeholder="Desired response length"
              :options="textLengths"
              ref="multiselect"
              class="!text-sm !min-h-[32px] shadow-md !rounded-none !border-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>

    <hr class="my-12" />

    <div class="w-full flex justify-between">
      <h3>Optional</h3>
      <button
        v-tooltip.bottom="
          'Optionally select up to 5 resources to use as the baseline when generating responses, this will help supplement the AI with more relevant information of your choosing'
        "
        @click="openAttach()"
        type="button"
        class="min-w-[200px] max-h-[40px] bg-purple hover:bg-gold text-white hover:text-black py-2 px-3 rounded focus:outline-none focus:shadow-outline"
      >
        Pick Baseline Resources
      </button>
    </div>
    <p>Select resources for the AI to use as a baseline</p>
    <p>(past proposals, past performances, capability statements)</p>

    <div class="flex flex-col w-full space-y-2 mt-8">
      <label for="" class="text-gray-500 font-bold">
        Custom Commands / Wording:
      </label>
      <CharacterCounter
        :content="interactionState.promptData.custom_words"
        :limit="getCharacterLimit(interactionState, 'customWords')"
      >
        <textarea
          v-tooltip.bottom="
            'Optionally add any custom wording about your solutions, service, differentiators, or expertise to be used by the AI when creating your responses. You can also provide the AI with custom commands such as words not to use, style, formatting, etc.'
          "
          :maxlength="getCharacterLimit(interactionState, 'customWords')"
          :value="interactionState.promptData.custom_words"
          @input="setPromptData('custom_words', $event.target.value)"
          class="w-full h-20 resize-none drop-shadow-md placeholder:text-gray-400 text-sm p-2"
          type="text"
          placeholder="Characteristics that make you stand out"
        />
      </CharacterCounter>
    </div>
  </div>
</template>
