<script setup>
import { inject, onMounted, ref, reactive, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import SelectOptions from './SelectOptions.vue'
import formatInteractions from '../../lib/formatIntellibid-2'
import toast from '../../lib/toast'
import getCharacterLimit from '../../lib/getCharacterLimit'
import api from '../../lib/axiosClient'
import autosave from '../../lib/autosave'
import {
  initWebSocket,
  handleInteraction,
  execute,
} from '../../lib/handleInteraction'

const interactionState = inject('interactionState')
const setLoading = inject('setLoading')
const fetchConvo = inject('fetchConvo')
const area = ref()

const state = reactive({
  usingDraft: false,
})

const handleChange = (e) => {
  const content = e.target.innerHTML
  localStorage.setItem(
    'intellibid-2',
    JSON.stringify({ [interactionState.asset.pid]: content })
  )
}

const toBottom = () => {
  setTimeout(() => {
    const editor = document.querySelector('.ql-container')
    editor.scrollTop = editor.scrollHeight
  }, 10)
}

onMounted(() => {
  if (interactionState.asset) {
    interactionState.artifact = interactionState.asset.last_autosave
      ? interactionState.asset.last_autosave
      : formatInteractions(interactionState.asset.interactions)
  }

  toBottom()
})

const getHighlighted = (e) => {
  const selection = window.getSelection()
  const range = selection.getRangeAt(0)
  const text = range.toString()
  interactionState.current = text
}

const handlePaste = (e) => {
  e.preventDefault()
  interactionState.artifact += `<p style="color: rgb(0, 0, 0);">${e.clipboardData.getData(
    'text'
  )}</p>`
}

const generate = () => {
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
    state.usingDraft = true
    const payload = {
      prompt: interactionState.current,
      inputs: {
        industry: 'industry',
        company: interactionState.promptData.company,
        agency: interactionState.promptData.agency,
        type: interactionState.promptData.type,
        length: interactionState.promptData.textLength,
        custom_words: interactionState.promptData.custom_words,
        sentiment: interactionState.promptData.sentiment,
        key_words: interactionState.promptData.key_words,
      },
      chains: true,
      ib2_action: interactionState.optionType,
    }

    let temp = interactionState.artifact

    interactionState.artifact = `${temp} ${
      temp && '<br />'
    } <p class="ql-align-right"><strong>${
      interactionState.current
    }</strong></p> <p id="response"></p>`
    toBottom()

    const save = () => {
      autosave(interactionState)
      fetchConvo(interactionState?.asset?.pid)
      state.usingDraft = false
      toBottom()
    }

    execute(interactionState, setLoading, toBottom, payload, save)
  }
}

watch(
  () => interactionState.processingResponse,
  (newVal, oldVal) => {
    if (newVal && state.usingDraft) {
      const responseAreas = document.querySelectorAll(`#response`)
      const responseArea = responseAreas[responseAreas.length - 1]

      if (responseArea) {
        let words = newVal.trim().split(' ')
        responseArea.innerHTML = `${words.join(' ')}`
        toBottom()
      }
    }
  }
)
</script>
<style>
.ql-toolbar {
  position: sticky;
  top: 0px;
  bottom: 20;
  left: 0;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
  background: rgb(250, 250, 250);
}
.ql-toolbar .ql-formats {
  display: block !important;
}

.ql-container {
  height: 45vh;
  background: #fff;
  overflow: auto;
}
.ql-editor {
  padding-top: 35px;
  height: auto;
}
</style>
<template>
  <form class="h-full" @submit.stop.prevent="generate">
    <div class="relative h-full" ref="area">
      <SelectOptions />

      <QuillEditor
        v-model:content="interactionState.artifact"
        contentType="html"
        theme="snow"
        toolbar="essential"
        @input="handleChange"
        v-on:mouseup="getHighlighted"
      />
    </div>
  </form>
</template>
