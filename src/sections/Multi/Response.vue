<script setup>
import { defineProps, reactive, ref, inject, onMounted, watch } from 'vue'
import * as marked from 'marked'
import retainLineBreaks from '../../lib/retainLineBreaks'

const props = defineProps({ back: Function })

const interactionState = inject('interactionState')
const setLoading = inject('setLoading')
const fetchConvo = inject('fetchConvo')

const content = ref('')

const renderResults = async () => {
  await fetchConvo(interactionState.asset.pid)
  let val = ''

  const interaction = interactionState.asset.interactions.pop()

  let citations = ''
  interaction.citations.forEach((citation) => {
    citations += `<a class="list-none text-blue-500 flex items-center" href="/resources/${citation.resource_pid}">${citation.link_text} <i class="material-icons md-20 pl-2">folder</i></a> <br />`
  })
  val += `${retainLineBreaks(interaction.response)} 
    <br /> <br />
    ${citations}
    `
  content.value = val
  setLoading(false)
}

watch(
  () => interactionState.processingPrompt,
  (newVal) => {
    setTimeout(async () => {
      if (!newVal) renderResults()
    }, 1000)
  }
)

onMounted(() => {
  if (!interactionState.processingPrompt) renderResults()
})
</script>
<style>
.ql-toolbar {
  display: flex;
  justify-content: flex-end;
  height: 0px;
  border-bottom: none !important;
}
.ql-toolbar .ql-formats {
  display: none;
}
.dot {
  height: 5px;
  width: 5px;
  border-radius: 50%;
  background-color: #000;
  animation: blink 1s linear infinite;
  margin-left: 5px;
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

p {
  font-size: 1.1rem;
  line-height: 1.5rem;
  font-weight: 400;
  color: #000;
}

.hideScroll::-webkit-scrollbar {
  display: none !important;
}
.hideScroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hideScroll * {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}
</style>
<template>
  <div
    class="relative shadow-lg gap-2.5 hideScroll flex overflow-x-hidden flex-col w-full px-4 h-[80vh] md:mb-0 overflow-y-auto bg-white pt-4"
  >
    <p class="text-gray-500 text-s">Here is your IntelliBid response</p>

    <div class="max-h-[65vh] h-full z-[1]">
      <div
        class="text-lg w-full h-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none overflow-auto"
        v-html="
          marked.parse(content ? content : interactionState.processingResponse)
        "
      />
    </div>
    <div
      class="flex w-full justify-end"
      v-if="!interactionState.processingPrompt"
    >
      <div class="flex space-x-4 mt-5 pb-3">
        <button
          @click="back"
          class="z-[2] bg-psci whitespace-nowrap hover:bg-gold text-white font-bold px-4 py-3 rounded-md drop-shadow-md"
        >
          Add More Requirements
        </button>
        <RouterLink :to="`/assets/${interactionState?.asset?.pid}`">
          <button
            class="z-[2] bg-purple hover:bg-gold text-white hover:text-black px-4 py-3 rounded-md focus:outline-none focus:shadow-outline"
          >
            Save and Exit
          </button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
