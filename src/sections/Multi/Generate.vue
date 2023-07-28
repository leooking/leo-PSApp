<script setup>
import 'tw-elements'
import { inject } from 'vue'
import InputConfig from '../../components/InputConfig.vue'
import toast from '../../lib/toast'
import api from '../../lib/axiosClient'
import * as marked from 'marked'
import CharacterCounter from '../../components/CharacterCounter.vue'
import getCharacterLimit from '../../lib/getCharacterLimit'
import {
  initWebSocket,
  handleInteraction,
  execute,
} from '../../lib/handleInteraction'

const props = defineProps({
  next: Function,
  back: Function,
})

const interactionState = inject('interactionState')
const agree = inject('agree')
const setData = inject('setData')
const setPrompt = inject('setPrompt')
const setLoading = inject('setLoading')

const generate = () => {
  localStorage.setItem(
    'promptData',
    JSON.stringify(interactionState.promptData)
  )

  const payload = {
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
  }

  execute(
    interactionState,
    setLoading,
    () => {},
    payload,
    () => {}
  )
  props.next()
}
</script>

<template>
  <div
    class="shadow-lg flex flex-col w-full px-4 h-[85vh] md:mb-0 overflow-y-auto bg-gray-100 pt-4 items-center"
  >
    <p class="mb-4 text-gray-500 text-s">
      Section 1
      <span class="italic">(required)</span>
      — Specify attributes IntelliBid will use to prepare your bid response:
    </p>

    <form
      class="flex flex-col w-full h-full ease-in-out duration-300"
      v-if="interactionState.agreed"
      @submit.stop.prevent="generate"
    >
      <InputConfig
        :setData="setData"
        :promptData="interactionState.promptData"
        :setPromptData="interactionState.setPromptData"
        :customWordLimit="getCharacterLimit(interactionState, 'customWords')"
      />

      <p class="mb-8 mt-4 text-gray-500 text-s text-center">
        Section 2
        <span class="italic">(required)</span>
        — Specify the requirements or topic on which IntelliBid will respond:
      </p>

      <div class="relative w-full flex-1 mt-2">
        <label
          for=""
          class="absolute bottom-full -translate-y-2 text-gray-500 font-bold"
        >
          Requirement(s) or Topic:
        </label>

        <CharacterCounter
          :content="interactionState.promptData.prompt"
          :limit="getCharacterLimit(interactionState, 'requirement')"
        >
          <textarea
            v-model="interactionState.promptData.prompt"
            required
            class="h-full w-full resize-none drop-shadow-lg placeholder:text-gray-300 py-4 px-2"
            name=""
            id=""
            cols="30"
            rows="10"
            placeholder="Generate again if length is an issue"
            :maxlength="getCharacterLimit(interactionState, 'requirement')"
          />
        </CharacterCounter>
      </div>
      <div class="flex justify-end mt-2 mb-1">
        <button
          type="submit"
          class="my-3 bg-psci hover:bg-gold text-white font-bold p-3 rounded-md drop-shadow-md"
        >
          Generate Bid Response
        </button>
      </div>
    </form>
    <div class="w-full flex flex-col items-center h-full" v-else>
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
