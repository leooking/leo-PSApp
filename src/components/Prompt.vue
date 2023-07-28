<script setup>
import { reactive } from 'vue'
import { inject } from 'vue'
import api from '../lib/axiosClient'
import { debounce } from 'vue-debounce'

const props = defineProps({
  prompt: Object,
  userPid: String,
  showEditPromptForm: Function,
  sharePrompt: Function,
  deletePrompt: Function,
  usePrompt: Function,
  setHasUpdated: Function,
})
const emit = inject('emit')

const state = reactive({
  showPrompt: false,
  favorited: props?.prompt?.favorited,
})

const favorit = async () => {
  state.favorited = !state.favorited
  state.showPrompt = !state.showPrompt
  if (state.favorited)
    await api.post(`prompts/${props.prompt.pid}/add_to_favorites`)
  else await api.post(`prompts/${props.prompt.pid}/remove_from_favorites`)

  props.setHasUpdated()
}
</script>

<template>
  <div
    class="clickFixBottom mt-2 flex flex-col rounded-md border-2 p-1 cursor-pointer ease-in-out duration-300 hover:bg-gray-100 z-1 relative"
    @click="state.showPrompt = !state.showPrompt"
  >
    <div class="flex justify-between mb-1">
      <div class="pr-3 py-3">
        <div class="flex items-center">
          <div
            class="flex self-start min-h-[50px] px-2 mt-[3px] flex-col"
            @click="favorit"
          >
            <button
              class="text-yellow-500 material-icons md-32"
              v-if="state.favorited"
            >
              star
            </button>
            <button class="text-yellow-500 material-icons md-32" v-else>
              star_border
            </button>
          </div>

          <div class="col-span-11">
            <h3 class="text-xl font-bold">{{ prompt.name }}</h3>
            <p class="">{{ prompt.description }}</p>
          </div>
        </div>
      </div>
      <div
        class="flex flex-col p-1 h-auto min-h-[85px] justify-between items-end"
      >
        <div class="flex space-x-3 items-center">
          <button
            class="mt-1"
            type="button"
            v-if="!!sharePrompt"
            @click="sharePrompt(prompt)"
          >
            <i class="material-icons text-blue-900">share</i>
          </button>
          <button
            class="mt-1"
            type="button"
            v-if="!!showEditPromptForm"
            @click="showEditPromptForm(prompt)"
          >
            <i class="material-icons text-blue-900">edit</i>
          </button>
          <button
            v-if="!!deletePrompt"
            class="text-gray-400 material-icons md-32"
            @click="props.deletePrompt(prompt.pid)"
          >
            delete
          </button>
          <div />
        </div>

        <!-- Idea for later
        <button 
        v-else
        type="button"
        class="text-purple w-full h-[25px] relative z-10 clickFixTop"
        
        @click="props.sharePrompt(prompt.pid, 'mine')">
        Clone
      </button>-->
        <button
          class="bg-psci hover:bg-gold text-white hover:text-black font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          type="button"
          @click="emit('confirm', prompt.prompt_text)"
        >
          Use
        </button>
      </div>
    </div>
    <p
      class="px-3"
      :style="{
        height: !state.showPrompt ? 0 : 'auto',
        display: state.showPrompt ? 'block' : 'none',
      }"
    >
      <span class="py-2">{{ prompt.prompt_text }}</span>
    </p>
  </div>
</template>
