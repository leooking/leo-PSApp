<script setup>
import { reactive, onMounted, inject, ref } from 'vue'
import api from '../../lib/axiosClient'
import toast from '../../lib/toast'
import Prompt from '../Prompt.vue'
import Radio from '../Radio.vue'
import CharacterCounter from '../CharacterCounter.vue'
import { getItem } from '../../lib/storage'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import NothingFound from '../NothingFound.vue'

const emit = inject('emit')
const name = ref('')
const currentUser = getItem('currentUser')
const description = ref('')
const promptModel = ref('')

const state = reactive({
  loading: false,
  activeTab: 2,
  isEdit: false,
  prompts: {
    mine: [],
    org: [],
    group: [],
    featured: [],
  },
  purpose: 'Create',
  editPromptPid: '',
  scope: '',
  hasUpdated: false,
})

const loadPrompts = async () => {
  const prompts = await api.get('prompts')

  state.prompts.mine = prompts.mine.sort((a, b) => a.name.localeCompare(b.name))
  state.prompts.group = prompts.group.sort((a, b) =>
    a.name.localeCompare(b.name)
  )
  state.prompts.featured = prompts.featured.sort((a, b) =>
    a.name.localeCompare(b.name)
  )
  state.prompts.group = prompts.group.sort((a, b) => a.name.localeCompare(b.name))
}
onMounted(async () => {
  await loadPrompts()
})

const showPromptForm = async () => {
  state.activeTab = 4
  name.value = ''
  description.value = ''
  promptModel.value = ''
  state.scope = ''
  state.purpose = 'Create'
  state.isEdit = true
}

const showEditPromptForm = async (prompt) => {
  state.activeTab = 4
  name.value = prompt.name
  description.value = prompt.description
  promptModel.value = prompt.prompt_text
  state.scope = prompt.scope
  state.purpose = 'Edit'
  state.editPromptPid = prompt.pid
  state.isEdit = true
}

const submitForm = () => {
  state.loading = true
  state.purpose === 'Create' ? createPrompt() : editPrompt()
  state.isEdit = false
  state.activeTab = 0
}

const createPrompt = async () => {
  try {
    const payload = {
      name: name.value,
      description: description.value,
      prompt_text: promptModel.value,
      scope: state.scope,
    }
    await api.post('prompts', payload)
    toast.success('Prompt created')
    await loadPrompts()
    state.activeTab = state.scope === 'mine' ? 1 : 2
    clearPrompt()
    state.loading = false
  } catch (err) {
    state.loading = false
    toast.error(err)
  }
}

const clearPrompt = () => {
  name.value = ''
  description.value = ''
  promptModel.value = ''
}

const selectScope = (val) => (state.scope = val)
const editPrompt = async () => {
  try {
    const payload = {
      name: name.value,
      description: description.value,
      prompt_text: promptModel.value,
      scope: state.scope,
    }
    await api.put('prompts/' + state.editPromptPid, payload)
    toast.success('Prompt updated')
    await loadPrompts()
    state.loading = false
  } catch (err) {
    state.loading = false
    toast.error(err)
  }
}

const deletePrompt = async (pid) => {
  try {
    state.loading = true
    await api.delete('prompts/' + pid)
    toast.success('Prompt deleted')
    await loadPrompts()
    state.loading = false
  } catch (err) {
    state.loading = false
    toast.error(err)
  }
}

const sharePrompt = async (prompt, scope = 'group') => {
  console.log('share')
  try {
    state.loading = true
    const payload = {
      scope: 'group',
    }
    await api.put('prompts/' + prompt.pid, payload)
    await loadPrompts()
    state.loading = false
  } catch (err) {
    state.loading = false
    toast.error(err)
  }
}

const setActiveTab = async (tab) => {
  if (state.hasUpdated) {
    await loadPrompts()
    state.hasUpdated = false
  }
  state.activeTab = tab
}

const clear = () => {
  state.purpose = 'Create'
  state.isEdit = false
  state.activeTab = 0
}
const setHasUpdated = () => (state.hasUpdated = true)
</script>
<style>
.p-tabview-nav {
  width: 100%;
  display: flex;
  justify-content: center;
}

.prompt-library .p-tabview {
  max-height: 500px;
  overflow: auto;
}
.prompt-library .p-tabview-header,
.prompt-library .p-tabview-nav-link {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
}

.prompt-library *,
.confirm-modal-content {
  scrollbar-width: none;
}
.prompt-library *::-webkit-scrollbar,
.confirm-modal-content::webkit-scrollbar {
  display: none;
}
</style>
<template>
  <div class="prompt-library rounded-md overflow-hidden p-2 w-full mt-1">
    <div class="overflow-y-scroll scrollbar rounded-md mt-1">
      <div class="w-full mx-auto rounded-md" v-if="!state.isEdit">
        <TabView :activeIndex="state.activeTab">
          <TabPanel>
            <template #header>
              <span>Mine</span>
            </template>
            <div v-if="state.prompts.mine.length > 0">
              <div v-for="prompt in state.prompts.mine" :key="prompt.pid">
                <Prompt
                  :prompt="prompt"
                  :showEditPromptForm="showEditPromptForm"
                  :sharePrompt="sharePrompt"
                  :deletePrompt="deletePrompt"
                  :setHasUpdated="setHasUpdated"
                />
              </div>
            </div>
            <NothingFound
              v-else
              altTitle="No Prompts Found"
              subTitle="Create a new prompt to get started"
            />
          </TabPanel>
          <TabPanel>
            <template #header>
              <span>Our Shared</span>
            </template>
            <div v-if="state.prompts.group.length > 0">
              <div v-for="prompt in state.prompts.group" :key="prompt.pid">
                <Prompt
                  :prompt="prompt"
                  :showEditPromptForm="
                    prompt.user_pid === currentUser.pid && showEditPromptForm
                  "
                  :deletePrompt="
                    prompt.user_pid === currentUser.pid && deletePrompt
                  "
                  :setHasUpdated="setHasUpdated"
                />
              </div>
            </div>
            <NothingFound
              v-else
              altTitle="No Prompts Found"
              subTitle="Create a new prompt to get started"
            />
          </TabPanel>
          <TabPanel>
            <template #header>
              <span>Featured</span>
            </template>
            <div v-for="prompt in state.prompts.featured">
              <Prompt :prompt="prompt" :setHasUpdated="setHasUpdated" />
            </div>
          </TabPanel>
        </TabView>
        <div
          class="max-h-[80px] h-full bg-white rounded-md w-full py-3 bg-white"
          v-if="state.activeTab !== 4"
        >
          <button
            type="submit"
            class="bg-psci hover:bg-gold text-white hover:text-black py-3 px-4 rounded focus:outline-none focus:shadow-outline"
            @click="showPromptForm"
          >
            New Prompt
          </button>
          <button
            class="ml-[10px] text-black font-bold hover:opacity-[.6] py-3 px-4 rounded focus:outline-none focus:shadow-outline md-18"
            @click="state.isEdit ? clear() : emit('close')"
          >
            Cancel
          </button>
        </div>
      </div>
      <form v-else @submit.stop.prevent="submitForm">
        <div class="w-full rounded-md p-1 mb-1 max-h-[450px] overflow-y-auto">
          <div class="pl-1 pr-5 pt-2">
            <div class="mb-4">
              <label class="text-xl font-bold text-black" for="name">
                Name:
              </label>
              <input
                class="mt-1 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                id="name"
                type="text"
                v-model="name"
                placeholder="Short and memorable"
              />
            </div>
            <div class="mb-4">
              <label class="text-xl font-bold text-black" for="description">
                Description (optional):
              </label>
              <input
                class="mt-1 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                type="text"
                v-model="description"
                placeholder="Usage notes"
              />
            </div>
            <div class="mb-4">
              <label for="prompt">
                <p>
                  <span class="text-xl font-bold text-black">Prompt: </span>
                </p>
              </label>
              <CharacterCounter :content="promptModel" limit="2000">
                <textarea
                  class="mt-1 appearance-none border min-h-[150px] rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  id="prompt"
                  type="text"
                  v-model="promptModel"
                  placeholder="Prompt text"
                  maxlength="2000"
                />
              </CharacterCounter>
            </div>
            <div>
              <p class="text-xl font-bold text-black mb-3">
                How will this prompt be shared?
              </p>
              <div class="flex w-full justify-around">
                <Radio
                  :isRequired="true"
                  name="I will keep it private"
                  value="mine"
                  :checked="state.scope === 'mine'"
                  :toggle="selectScope"
                />
                <Radio
                  :isRequired="true"
                  name="I will share it"
                  value="group"
                  :checked="state.scope === 'group'"
                  :toggle="selectScope"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="flex mt-6">
          <button
            type="submit"
            class="min-w-[125px] bg-psci hover:bg-gold text-white hover:text-black py-3 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save
          </button>
          <button
            class="min-w-[125px] ml-[10px] text-black font-bold hover:opacity-[.6] py-3 px-4 rounded focus:outline-none focus:shadow-outline md-18"
            @click="clear"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
