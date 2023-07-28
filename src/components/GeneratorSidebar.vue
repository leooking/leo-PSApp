<script setup>
import { inject, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import * as marked from 'marked'
import PromptBuilderTool from './PromptBuilderTool.vue'
import DataSourcesToggles from './Buttons/DataSourcesToggles.vue'
import PromptLibraryBtn from './Buttons/PromptLibraryBtn.vue'
import handlePromptBuilder from '../lib/handlePromptBuilder'

const interactionState = inject('interactionState')

const state = reactive({
  promptBuilder: {
    code: 0,
    label: '',
  },
})

const toggleSeason = (value, code) => {
  state.promptBuilder.label = value
  state.promptBuilder.code = code

  handlePromptBuilder(state.promptBuilder, interactionState)
}
</script>
<template>
  <div class="flex flex-col md:max-w-[30%] w-full space-y-6 mt-4 md:mt-0">
    <div class="flex justify-between">
      <RouterLink
        to="/assets"
        class="text-gray-500 flex gap-2 whitespace-nowrap"
      >
        <span class="material-icons text-sm">arrow_back</span>
        Back to Assets
      </RouterLink>

      <a
        v-if="interactionState?.asset?.user_guide_url"
        :href="interactionState?.asset?.user_guide_url"
        target="__blank"
      >
        <button
          class="bg-purple hover:bg-gold text-white hover:text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          User Guide
        </button>
      </a>
    </div>

    <div class="flex items-center">
      <h1 class="text-3xl">{{ interactionState.asset.generator_name }}</h1>
    </div>

    <p>
      <span class="font-bold">Name: </span>
      {{ interactionState.asset.name }}
    </p>

    <div
      class="shadow-lg overflow-y-scroll max-h-[450px] h-full bg-white rounded-md p-3"
    >
      <div class="pft-6 h-full min-h-[350px] space-y-3 examples">
        <p
          v-html="marked.parse(interactionState.asset.sidebar_instruction)"
          v-if="interactionState?.asset?.sidebar_instruction"
        ></p>
      </div>
    </div>

    <PromptBuilderTool
      @toggle-season="toggleSeason"
      v-if="interactionState.asset.prompt_builder_visible"
    />
    <PromptLibraryBtn
      classes="w-full"
      v-if="interactionState.asset.prompt_assistant_visible"
    />

    <DataSourcesToggles />
  </div>
</template>
