<script setup>
import 'tw-elements'
import { inject } from 'vue'
import toast from '../../lib/toast'
import api from '../../lib/axiosClient'
import * as marked from 'marked'
import Toggle from '../../components/Toggle.vue'
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
const setLoading = inject('setLoading')

const generate = () => {
  setLoading(true)

  const payload = {
    prompt: `The proposal requirement is "${interactionState.requirement}"" The proposal response is "${interactionState.response}"`,
  }

  const complete = () => setLoading(false)
  execute(interactionState, setLoading, () => {}, payload, complete)
  props.next()
}
</script>
<style src="@vueform/multiselect/themes/default.css"></style>

<template>
  <div
    class="shadow-lg flex flex-col w-full px-4 h-[85vh] md:mb-0 overflow-y-auto bg-gray-100 pt-4 items-center"
  >
    <form
      class="flex flex-col items-center w-full h-full"
      v-if="interactionState.agreed"
      @submit.stop.prevent="generate"
    >
      <p class="mb-6 text-gray-500 text-s">Section 1 — SmartCheck Settings</p>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
        <Toggle
          :checked="true"
          :isDisabled="true"
          classes="checked:bg-green-500"
        >
          Compliance Check
        </Toggle>
        <Toggle
          :checked="true"
          :isDisabled="true"
          classes="checked:bg-green-500"
        >
          Readability
        </Toggle>
        <Toggle
          :checked="true"
          :isDisabled="true"
          classes="checked:bg-green-500"
        >
          Score Improvement Tips
        </Toggle>
        <Toggle
          :checked="true"
          :isDisabled="true"
          classes="checked:bg-green-500"
        >
          Evaluation Score
        </Toggle>
        <Toggle
          :checked="true"
          :isDisabled="true"
          classes="checked:bg-green-500"
        >
          Completeness
        </Toggle>
        <Toggle :isDisabled="true" classes="checked:bg-green-500">
          Enhanced Response Suggestion
        </Toggle>
      </div>
      <p class="my-6 text-gray-500 text-s">
        Section 2
        <span class="italic">(required)</span>
        — Enter the Requirement
      </p>

      <div class="relative w-full flex-1 mt-2">
        <label
          for=""
          class="absolute bottom-full -translate-y-2 text-gray-500 font-bold"
        >
          Requirement:
        </label>

        <CharacterCounter
          :content="interactionState.requirement"
          :limit="getCharacterLimit(interactionState, 'requirement')"
        >
          <textarea
            v-model="interactionState.requirement"
            required
            class="h-full w-full resize-none drop-shadow-lg placeholder:text-gray-300 py-4 px-2"
            name=""
            id=""
            cols="30"
            rows="10"
            placeholder="Enter a single requirement"
            :maxlength="getCharacterLimit(interactionState, 'requirement')"
          ></textarea>
        </CharacterCounter>
      </div>

      <p class="mb-8 my-6 text-gray-500 text-s text-center">
        Section 3
        <span class="italic">(required)</span>
        — Enter the response you would like evaluated (Only Enter One)
      </p>

      <div class="relative w-full flex-1 mt-2">
        <label
          for=""
          class="absolute bottom-full -translate-y-2 text-gray-500 font-bold"
        >
          Response:
        </label>

        <CharacterCounter
          :content="interactionState.response"
          :limit="getCharacterLimit(interactionState, 'response')"
        >
          <textarea
            v-model="interactionState.response"
            required
            class="h-full w-full resize-none drop-shadow-lg placeholder:text-gray-300 py-4 px-2"
            name=""
            id=""
            cols="30"
            rows="10"
            placeholder="Enter a single Response"
            :maxlength="getCharacterLimit(interactionState, 'response')"
          ></textarea>
        </CharacterCounter>
      </div>
      <div class="flex w-full justify-end mt-2 mb-1">
        <button
          type="submit"
          class="my-3 bg-psci hover:bg-gold text-white font-bold p-3 rounded-md drop-shadow-md"
        >
          Run SmartCheck
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
