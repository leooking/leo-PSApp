<script setup>
import { onMounted, reactive, ref } from 'vue'
import toast from '../../lib/toast'
import api from '../../lib/axiosClient'
import { useRouter, useRoute } from 'vue-router'

const state = reactive({ project: {}, loading: true })

const router = useRouter()
const route = useRoute()

const toYYYYMMDD = (date_str) => {
  return new Date(date_str).toISOString().split('T')[0]
}

const project_name = ref('')
const project_description = ref('')
const project_type = ref('')
const project_deadline = ref('')
const project_state = ref('')
const project_agency = ref('')
const project_objective = ref('')

onMounted(async () => {
  try {
    const project = await api.get('projects/' + route.params.pid)

    project_name.value = project.name
    project_description.value = project.description
    project_type.value = project.project_type
    project_deadline.value = toYYYYMMDD(project.deadline)
    project_state.value = project.state
    project_agency.value = project.agency
    project_objective.value = project.objective

    state.project = project
    console.log(state.project)
  } catch (err) {
    toast.error(err.message)
  } finally {
    state.loading = false
  }
})

const handleEdit = async () => {
  try {
    const payload = {
      name: project_name.value,
      description: project_description.value,
      agency: project_agency.value,
      project_type: project_type.value,
      deadline: project_deadline.value,
      state: project_state.value,
      objective: project_objective.value,
    }
    // console.log(payload)

    const res = await api.put('projects/' + state.project.pid, payload)
    if (res) {
      toast.success('Project edited')
      router.push({ name: 'projects' })
    }
  } catch (err) {
    toast.error(err.message)
  }
}
</script>

<template>
  <span v-if="!state.project">Loading...</span>

  <div class="mb-6 flex flex-row">
    <div class="mr-4 flex items-center">
      <h2>Edit Project</h2>
    </div>
  </div>

  <form class="md:px-5 w-full" @submit.stop.prevent="handleEdit">
    <div class="md:px-10 mt-3">
      <div class="form-row">
        <div class="w-full">
          <label
            class="block text-gray-700 text-sm font-bold mb-1"
            for="project_name"
          >
            Project Name
          </label>
          <input
            v-model="project_name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            id="project_name"
            type="text"
            placeholder=""
          />
        </div>
      </div>

      <div class="form-row">
        <div class="w-full">
          <label
            class="block text-gray-700 text-sm font-bold mb-1"
            for="project_description"
          >
            Description
          </label>
          <textarea
            v-model="project_description"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            id="project_description"
            type="text"
            placeholder=""
          ></textarea>
        </div>
      </div>

      <div class="form-row">
        <div class="w-full">
          <label
            class="block text-gray-700 text-sm font-bold mb-1"
            for="project_agency"
          >
            Agency
          </label>
          <input
            v-model="project_agency"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            id="project_agency"
            type="text"
            placeholder=""
          />
        </div>
      </div>

      <!-- project type with text input -->
      <div class="form-row">
        <div class="w-full">
          <label
            class="block text-gray-700 text-sm font-bold mb-1"
            for="project_type"
          >
            Project Type
          </label>
          <input
            v-model="project_type"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            id="project_type"
            type="text"
            placeholder=""
          />
        </div>
      </div>

      <!-- type with select input -->
      <!-- <div class="form-row">
        <div class="w-full">
            <label class="block text-gray-700 text-sm font-bold mb-1" for="project_type">
                Project Type
            </label>
            <select v-model="project_type"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required id="project_type" type="text" placeholder="">
                <option value="1">Type 1</option>
                <option value="2">Type 2</option>
                <option value="3">Type 3</option>
            </select>
        </div>
    </div> -->

      <!-- state with text input -->
      <div class="form-row">
        <div class="w-full">
          <label
            class="block text-gray-700 text-sm font-bold mb-1"
            for="project_state"
          >
            State
          </label>
          <input
            v-model="project_state"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            id="project_state"
            type="text"
            placeholder=""
          />
        </div>
      </div>

      <!-- deadline -->
      <div class="form-row">
        <div class="w-full">
          <label
            class="block text-gray-700 text-sm font-bold mb-1"
            for="project_deadline"
          >
            Due date
          </label>
          <input
            v-model="project_deadline"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            id="project_deadline"
            type="date"
            placeholder=""
          />
        </div>
      </div>

      <!-- objective with text area -->
      <div class="form-row">
        <div class="w-full">
          <label
            class="block text-gray-700 text-sm font-bold mb-1"
            for="project_objective"
          >
            Objective
          </label>
          <textarea
            v-model="project_objective"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            id="project_objective"
            type="text"
            placeholder=""
          ></textarea>
        </div>
      </div>

      <div class="mt-2 w-full">
        <div class="flex flex-row items-center gap-4 w-full mt-4">
          <button
            class="bg-psci hover:bg-gold text-white hover:text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Edit
          </button>

          <button
            class="bg-slate-200 hover:bg-gold text-dark hover:text-black font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            <RouterLink to="/projects">Cancel</RouterLink>
          </button>
        </div>
      </div>
    </div>
  </form>
</template>
