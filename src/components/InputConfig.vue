<script setup>
import { reactive, ref, inject } from 'vue'
import Multiselect from '@vueform/multiselect'
import CharacterCounter from './CharacterCounter.vue'

const props = defineProps({
  customWordLimit: Number,
})

const interactionState = inject('interactionState')
const setPromptData = inject('setPromptData')

const state = reactive({
  configOpen: true,
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
</script>
<template>
  <div>
    <div :class="state.configOpen ? '' : 'max-h-0 overflow-hidden'">
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
              required
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
                v-model="interactionState.promptData.length"
                @change="setPromptData('length', $event)"
                placeholder="Desired response length"
                :options="textLengths"
                ref="multiselect"
                class="!text-sm !min-h-[32px] shadow-md !rounded-none !border-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full space-y-2 mt-[15px] md:mt-[-15px]">
        <label for="" class="text-gray-500 font-bold">
          Differentiators, Expertise, Past-Performance and Custom Wording:
        </label>
        <CharacterCounter
          :content="interactionState.promptData.custom_words"
          :limit="props.customWordLimit"
        >
          <textarea
            required
            :maxlength="props.customWordLimit"
            :value="interactionState.promptData.custom_words"
            @input="setPromptData('custom_words', $event.target.value)"
            class="w-full h-20 resize-none drop-shadow-md placeholder:text-gray-400 text-sm p-2"
            type="text"
            placeholder="Characteristics that make you stand out"
          />
        </CharacterCounter>
      </div>
    </div>
    <div class="flex w-full justify-center items-center mt-2">
      <div class="h-[1px] w-1/2 bg-gray-400" />
      <button
        class="text-gray-400 !text-4xl material-icons"
        @click="state.configOpen = false"
        v-if="state.configOpen"
      >
        expand_less
      </button>
      <button
        class="text-gray-400 !text-4xl material-icons"
        @click="state.configOpen = true"
        v-else
      >
        expand_more
      </button>
      <div class="h-[1px] w-1/2 bg-gray-400" />
    </div>
  </div>
</template>
