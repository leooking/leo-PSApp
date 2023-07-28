<script setup>
import 'tw-elements'
import toast from '../../lib/toast'
import api from '../../lib/axiosClient'
import { ref, reactive, inject, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Radio from '../Radio.vue'

const globalState = reactive({ loading: false })
const route = useRoute()

const props = inject('props')
const emit = inject('emit')

const name = ref('')
const description = ref('')
const agency = ref('')
const link = ref('')
const type = ref('')
const start_date = ref('')
const deadline = ref('')
const state = ref('')
const scope = ref('')

onMounted(() => {
  if (!name.value)
    name.value = props.parentState?.project?.name
      ? props.parentState?.project?.name
      : ''
  if (!description.value)
    description.value = props.parentState?.project?.description
      ? props.parentState?.project?.description
      : ''
  if (!agency.value)
    agency.value = props.parentState?.project?.agency
      ? props.parentState?.project?.agency
      : ''
  if (!link.value)
    link.value = props.parentState?.project?.link
      ? props.parentState?.project?.link
      : ''
  if (!type.value)
    type.value = props.parentState?.project?.project_type
      ? props.parentState?.project?.project_type
      : ''
  if (!start_date.value)
    start_date.value = props.parentState?.project?.start_date
      ? new Date(props.parentState?.project?.start_date)
          .toISOString()
          .split('T')[0]
      : new Date()
  if (!deadline.value)
    deadline.value = props.parentState?.project?.deadline
      ? new Date(props.parentState?.project?.deadline)
          .toISOString()
          .split('T')[0]
      : new Date()
  if (!state.value)
    state.value = props.parentState?.project?.state
      ? props.parentState?.project?.state
      : ''
  if (!scope.value)
    scope.value = props.parentState?.project?.scope
      ? props.parentState?.project?.scope
      : ''
})

const submitForm = () => {
  globalState.loading = true
  props?.purpose === 'Create' ? createProject() : editProject()

  name.value = ''
  description.value = ''
  agency.value = ''
  link.value = ''
  type.value = ''
  start_date.value = ''
  deadline.value = ''
  state.value = ''
  scope.value = ''
}

const createProject = async () => {
  try {
    let payloadScope
    if (scope.value) payloadScope = scope.value
    else payloadScope = route.query.scope === 'private' ? 'mine' : 'group'
    const payload = {
      name: name.value,
      description: description.value,
      agency: agency.value,
      type: type.value,
      start_date: start_date.value,
      deadline: deadline.value,
      state: state.value,
      scope: payloadScope,
    }
    const res = await api.post('projects', payload)
    toast.success('Project created')
    globalState.loading = false
    emit('confirm')
  } catch (err) {
    globalState.loading = false
    emit('close')
    toast.error(err)
  }
}

const editProject = async () => {
  try {
    const payload = {
      name: name.value,
      description: description.value,
      agency: agency.value,
      type: type.value,
      start_date: start_date.value,
      deadline: deadline.value,
      state: state.value,
    }
    const res = await api.put(
      `projects/${props.parentState.project.pid}`,
      payload
    )
    props.parentState.projects = props.parentState.projects.map((project) =>
      project.pid === res.pid ? { ...res, is_team_member: true } : project
    )
    toast.success('Project updated')
    globalState.loading = false
    emit('confirm')
  } catch (err) {
    globalState.loading = false
    emit('close')
    toast.error(err)
  }
}

const closeModal = () => {
  emit('close')
}
</script>
<template>
  <div v-if="!state.loading">
    <div class="mb-6 flex flex-row">
      <div class="flex items-center">
        <h2>{{ props?.purpose === 'Create' ? 'New' : 'Edit' }} Project</h2>
      </div>
    </div>

    <form class="w-full" @submit.stop.prevent="submitForm">
      <div class="mt-3">
        <div class="form-row">
          <div class="w-full">
            <label
              class="block text-gray-700 text-sm font-bold mb-1"
              for="dname"
            >
              Name
            </label>
            <input
              v-model="name"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              id="name"
              type="text"
              placeholder=""
            />
          </div>
        </div>

        <!-- start_date -->
        <div class="flex">
          <div class="form-row mr-1">
            <div class="w-full">
              <label
                class="block text-gray-700 text-sm font-bold mb-1"
                for="start_date"
              >
                Start Date
              </label>
              <input
                v-model="start_date"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                id="start_date"
                type="date"
                placeholder=""
              />
            </div>
          </div>

          <!-- deadline -->
          <div class="form-row">
            <div class="w-full ml-1">
              <label
                class="block text-gray-700 text-sm font-bold mb-1"
                for="deadline"
              >
                Due date
              </label>
              <input
                v-model="deadline"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                id="deadline"
                type="date"
                placeholder=""
              />
            </div>
          </div>
        </div>

        <div class="form-row mt-4" v-if="!route.query.scope">
          <div class="w-full">
            <label
              class="block text-gray-700 text-sm font-bold mb-1"
              for="project_sharing"
            >
              Project Sharing
            </label>
            <div class="shadow-lg pt-2 pb-4 px-4 bg-gray-100">
              <p class="text-sm text-gray-500 mb-2">
                How will this project be shared?
              </p>
              <div class="flex w-full justify-around text-sm">
                <Radio
                  :isRequired="true"
                  name="I will keep it private"
                  value="mine"
                  :checked="scope === 'mine'"
                  :toggle="(val) => (scope = val)"
                />
                <Radio
                  :isRequired="true"
                  name="I will share it"
                  value="group"
                  :checked="scope === 'group'"
                  :toggle="(val) => (scope = val)"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="mt-2 w-full">
          <div class="flex flex-row items-center gap-4 w-full mt-4">
            <button
              class="bg-psci hover:bg-gold text-white hover:text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              id="submit"
            >
              {{ props?.purpose === 'Create' ? 'Create' : 'Update' }}
            </button>

            <button
              class="bg-slate-200 hover:bg-gold text-dark hover:text-black font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
              type="button"
              @click="closeModal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
  <div v-else>
    <div class="flex w-full justify-center items-center min-h-[500px]">
      <div
        class="inline-block h-24 w-24 text-purple animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1s_linear_infinite]"
        role="status"
      >
        <span
          class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span
        >
      </div>
    </div>
  </div>
</template>
