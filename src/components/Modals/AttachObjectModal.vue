<script setup>
import { onMounted, reactive, inject, ref } from 'vue'
import api from '../../lib/axiosClient'
import toast from '../../lib/toast'
import Checkbox from 'primevue/checkbox'
import ProgressSpinner from 'primevue/progressspinner'
import fetchFolders from '../../lib/fetchFolders'

const props = inject('props')
const emit = inject('emit')
const checked = ref([])

const state = reactive({
  projects: [],
  checked: null,
  object: null,
  attached: [],
  loading: true,
})

const clear = () => {
  state.attached = []
  state.checked = {}
  state.projects = []
  state.loading = false
}

onMounted(async () => {
  const res = await fetchFolders('projects', 'projects')
  state.object = props?.parentState[props.name]
  state.projects = res.projects.filter((project) => !project.folder_type)
  state.object.projects.forEach((project) => checked.value.push(project.pid))
  state.loading = false
})

const submit = async () => {
  try {
    let plural
    if (props.name === 'asset') plural = 'assetz'
    else plural = `${props.name}s`

    const res = await api.post(
      `${plural}/${state.object.pid}/set_project_attachments`,
      { project_pids: checked.value }
    )
    toast.success('Updated Attachments')
    emit('confirm')
    clear()
  } catch (err) {
    toast.error(err.message)
  }
}
</script>
<template>
  <div>
    <form
      class="md:px-5 w-full"
      @submit.stop.prevent="submit"
      v-if="!state.loading"
    >
      <h3 class="mb-4">
        Select which project(s) you want to add this {{ props.name }} to:
      </h3>
      <div
        class="pb-6 px-12 flex flex-col space-y-4 items-start max-h-[300px] overflow-auto"
      >
        <div class="form-check" v-for="project in state?.projects">
          <Checkbox
            v-model="checked"
            :inputId="project.pid"
            name="project"
            :value="project.pid"
          />
          <label
            class="ml-4 form-check-label inline-block text-gray-800 cursor-pointer"
            :for="`check-${project.pid}`"
          >
            {{ project.name }}
          </label>
        </div>
      </div>

      <button
        class="bg-psci w-full hover:bg-gold text-white hover:text-black font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Set Project Attachments
      </button>
    </form>
    <div class="flex w-full justify-center items-center min-h-[350px]" v-else>
      <ProgressSpinner />
    </div>
  </div>
</template>
