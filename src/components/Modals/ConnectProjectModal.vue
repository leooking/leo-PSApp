<script setup>
import { defineProps, ref } from 'vue'
import api from '../../lib/axiosClient'
import toast from '../../lib/toast'
import router from '../../router'

const props = defineProps({
  projects: Array,
  asset_pid: String,
  assetName: String,
  isOpen: Boolean,
  toggleOpen: Function,
})

const projectName = ref('')
const existingProject = ref('')

const submit = async (e) => {
  try {
    if (projectName.value) {
      const res = await api.post('projects', {
        asset_pid: props.asset_pid,
        name: projectName.value,
      })
      router.push(`projects/${res.pid}`)
    } else {
      const res = await api.post(
        `assetz/${props.asset_pid}/attach_to_project`,
        {
          project_pid: existingProject.value.pid,
        }
      )
      router.push(`projects/${existingProject.value.pid}`)
    }
  } catch (err) {
    toast.error(err.message)
  } finally {
    props.toggleOpen()
  }
}
</script>
<template>
  <div
    :class="`modal fade fixed top-0 left-0 show w-full h-full outline-none ${
      !isOpen && 'hidden'
    }`"
    id="confirmProjectModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="confirmProjectModal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg relative pointer-events-none max-w-lg">
      <div
        class="modal-content border-none shadow-xl relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current"
      >
        <div
          class="modal-header flex flex-shrink-0 items-center justify-between p-4"
        >
          <button
            type="button"
            id="closeProjectModal"
            class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-skiba hover:opacity-75 hover:no-underline"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="toggleOpen"
          ></button>
        </div>
        <div class="modal-body p-4">
          <form class="md:px-2 w-full mt-[-40px]" @submit.stop.prevent="submit">
            <h4 class="mb-6 font-xl">Save insight to Project:</h4>
            <div class="form-row">
              <div class="w-full">
                <label
                  class="block text-gray-700 text-sm font-bold mb-1"
                  for="name"
                >
                  Save to an existing project
                </label>
                <div
                  class="flex flex-col space-y-3 my-3 max-h-[200px] overflow-y-auto"
                >
                  <div class="form-check" v-for="project in props.projects">
                    <input
                      :onInput="(existingProject = project)"
                      class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                      type="radio"
                      name="radio"
                      :id="`radio_${project.pid}`"
                      id="flexRadioDefault1"
                    />
                    <label
                      class="form-check-label inline-block text-gray-800 cursor-pointer"
                      :for="`radio_${project.pid}`"
                    >
                      {{ project.name }}
                    </label>
                  </div>
                </div>
              </div>

              <div class="w-full">
                <label
                  class="block text-gray-700 text-sm font-bold mb-1"
                  for="name"
                >
                  Or create a new project
                </label>
                <input
                  v-model="projectName"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="projectName"
                  type="text"
                  placeholder="Name new project"
                />
              </div>
            </div>

            <button
              class="w-full bg-purple hover:bg-gold text-white hover:text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
