<script setup>
import { ref, inject, onMounted, reactive, watch } from 'vue'
import toast from '../../lib/toast'
import api from '../../lib/axiosClient'
import { marked } from 'marked'
import cleanPrompt from '../../lib/cleanPrompt'
import ReviewInteraction from '../../components/ReviewInteraction.vue'
import formatResponse from '../../lib/formatResponse'
import CharacterCounter from '../../components/CharacterCounter.vue'
import getCharacterLimit from '../../lib/getCharacterLimit'
import Disclaimer from '../../components/Disclaimer.vue'
import FollowUpBtn from '../../components/Buttons/FollowUpBtn.vue'
import Button from 'primevue/button'
import axios from 'axios'
import {
  initWebSocket,
  handleInteraction,
  execute,
} from '../../lib/handleInteraction'

const props = defineProps({
  classes: String,
  hideDisclaimer: Boolean,
  isAIChat: Boolean,
})

const state = reactive({
  scrollLocked: false,
  loading: false,
})

const convo = ref(null)
const interactionState = inject('interactionState')
const agree = inject('agree')
const setLoading = inject('setLoading')
const setState = inject('setState')
const fetchConvo = inject('fetchConvo')

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
})

const toBottom = () => {
  setTimeout(() => {
    if (
      convo?.value &&
      convo.value.scrollHeight -
        (convo?.value.scrollTop + convo?.value.clientHeight) <=
        200
    )
      convo.value.scrollTop = convo.value.scrollHeight
  }, 10)
}

const filteredData = () => {
  const rids = interactionState.asset.revisions.find((item) => item.revision_pid == interactionState.asset.revision_pid)
  const filteredData = interactionState.asset.interactions.filter((item) => rids.rvs_ids.includes(item.revision_pid) || item.revision_pid == null)
  return filteredData
}

const generate = () => {
  state.loading = true
  try {
    const reload = () => fetchConvo(interactionState.asset.pid)
    if (props.isAIChat)
      if (interactionState.useExternal)
        execute(
          interactionState,
          setLoading,
          toBottom,
          {},
          reload,
          'chat/winmore' // 'text2sql'
        )
      else
        execute(
          interactionState,
          setLoading,
          toBottom,
          {},
          reload,
          'chat/winmore'
        )
    else execute(interactionState, setLoading, toBottom, {}, reload)
  } catch (err) {
    toast.error(err.message)
  } finally {
    state.loading = false
  }
}

const agreeToBottom = () => {
  agree()
  console.log(convo.value.scrollTop, convo.value.scrollHeight)
  setTimeout(() => {
    if (convo.value) convo.value.scrollTop = convo.value.scrollHeight
  }, 10)
}
</script>
<style>
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
.responses p,
.responses ul,
.responses ol {
  margin-bottom: 10px;
}

.gap {
  gap: 10px;
}

</style>
<template>
  <div
    :class="`flex justify-between flex-col-reverse max-h-[85vh] md:flex-row ${props.classes}`"
  >
    <div class="flex flex-col justify-start w-full">
      <div
        ref="convo"
        class="overflow-hidden relative shadow-lg flex w-full flex-col h-[80vh] overflow-y-auto bg-white pt-4 items-center"
      >
        <img alt="Alert icon" src="@/assets/alert_120x.png" width="80" />
        <div
          class="flex justify-center w-full mt-3 pb-8 px-4 border-b-2 border-gray-400"
        >
          <div class="space-y-3 max-w-[1000px] font-bold">
            <p
              v-html="marked.parse(interactionState.asset.convo_preface)"
              v-if="interactionState?.asset?.convo_preface"
            ></p>
          </div>
        </div>

        <div
          class="flex flex-col space-y-6 mt-6 pb-4 w-full px-6 pb-6"
          v-if="interactionState?.agreed"
        >
          <div v-if="interactionState.asset.interactions.length > 0">
            <div
              v-for="interaction in filteredData()"
              :value="interaction.value"
              :key="interaction.value"
            >
              <div class="flex w-full justify-end">
                <div class="flex flex-col max-w-[80%] md:max-w-[80%]">
                  <p class="mb-4 text-[#A7672D] font-bold">
                    {{ interaction.prompt }}
                  </p>
                </div>
              </div>
              <div class="flex flex-row items-start mt-4">
                <ReviewInteraction
                  :thumbs="interaction.thumbs"
                  :pid="interaction.pid"
                  :interactions="filteredData()"
                />
                <div class="flex flex-col max-w-[80%] md:max-w-[80%]">
                  <div
                    class="responses"
                    v-html="marked.parse(interaction.response)"
                    v-if="interaction?.response"
                  ></div>
                  <ul
                    class="ml-0 list-none text-blue-500 flex flex-col items-start pt-3"
                    v-if="interaction.citations.length > 0"
                  >
                    <li
                      v-for="(citation, index) in interaction.citations"
                      :key="index"
                      class="w-full mb-2"
                    >
                      <div
                        class="flex cursor-pointer w-full items-center"
                        @click="
                          citation.showRelevantChunk =
                            !citation.showRelevantChunk
                        "
                      >
                        <i
                          class="material-icons md-20 pr-1"
                          v-if="citation.type === 'resource'"
                        >
                          folder
                        </i>
                        <span>
                          {{
                            citation.type === 'resource'
                              ? citation?.resource_name
                              : citation.link
                          }}
                        </span>
                        <i
                          class="material-icons md-20 select-none"
                          v-if="citation.showRelevantChunk"
                        >
                          expand_more
                        </i>
                        <i
                          class="material-icons md-20 pl-0 select-none"
                          v-if="!citation.showRelevantChunk"
                        >
                          chevron_right
                        </i>
                      </div>
                      <blockquote
                        v-if="citation.showRelevantChunk"
                        class="my-2 blockquote p-4 italic border-l-4 bg-neutral-100 text-neutral-600 border-neutral-500"
                      >
                        {{ citation?.relevant_chunk }}

                        <div class="mt-2">
                          <a
                            :href="
                              citation.type === 'resource'
                                ? `/resources/${citation.resource_pid}`
                                : citation.link
                            "
                            class="not-italic underline hover:text-blue-800 flex items-center"
                            target="__blank"
                          >
                            View resource
                          </a>
                        </div>
                      </blockquote>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div v-if="interactionState.processingPrompt">
            <div class="flex w-full justify-end">
              <div class="flex flex-col max-w-[80%] md:max-w-[80%]">
                <p class="mb-4 text-[#A7672D] font-bold">
                  {{ interactionState.processingPrompt }}
                </p>
              </div>
            </div>
            <div class="flex flex-row items-start mt-4">
              <ReviewInteraction disabled />
              <div class="flex flex-col max-w-[80%] md:max-w-[80%]">
                <div
                  class="responses"
                  v-html="marked.parse(interactionState.processingResponse)"
                  v-if="interactionState?.processingResponse"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex w-full mt-auto items-center p-3"
          v-if="!interactionState?.agreed"
        >
          <button
            @click="agreeToBottom"
            class="w-full bg-psci hover:bg-gold text-white hover:text-black py-3 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            I understand and am ready to begin.
          </button>
        </div>
      </div>
      <form
        class="flex flex-col w-full items-center py-2 gap"
        @submit.stop.prevent="generate"
        v-if="interactionState?.agreed"
      >
        <div v-if="interactionState.asset.interactions.length > 0" class="flex w-full px-0">
          <FollowUpBtn/>
        </div>
        <div class="flex w-full px-0">
          <CharacterCounter
            :content="interactionState.promptData.prompt"
            :limit="getCharacterLimit(interactionState, null, 'convo')"
            :hasBtn="true"
          >
            <textarea
              v-model="interactionState.promptData.prompt"
              class="min-h-[75px] md:min-h-[100px] mr-[85px] shadow resize-none appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              id="description"
              type="text"
              :maxLength="getCharacterLimit(interactionState, null, 'convo')"
              placeholder="Type your prompt here..."
            />
          </CharacterCounter>

          <Button
            type="submit"
            :loading="state.loading"
            label="Send"
            icon="pi pi-send"
            class="relative z-2 max-h-[70px] md:max-h-[100px] bg-psci hover:bg-gold border-none text-white hover:text-black py-3 px-5 rounded focus:outline-none focus:shadow-outline"
          />
          <!--<psci
            type="submit"
            class="relative z-2 max-h-[70px] md:max-h-[100px] bg-psci hover:bg-gold text-white hover:text-black py-3 px-5 rounded focus:outline-none focus:shadow-outline"
            
          >
            <span class="material-icons">send</span><br />
            Send
          </button>-->
        </div>
        <Disclaimer v-if="!props.hideDisclaimer" />
      </form>
    </div>
  </div>
</template>
