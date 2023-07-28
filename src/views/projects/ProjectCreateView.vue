<script setup>
import { onMounted, reactive } from 'vue'
import toast from '../../lib/toast'
import api from '../../lib/axiosClient'
import { useRouter, useRoute } from 'vue-router'

const state = reactive({ project: [], loading: true })

defineProps({ project: Object })

const router = useRouter()
const route = useRoute()
</script>

<template>
  <div class="mb-6 flex flex-row">
    <div class="mr-4 flex items-center">
      <h2>New Project</h2>
    </div>
  </div>

  <!-- <h2 class="my-2">New Project</h2> -->
  <form class="md:px-5 w-full" @submit.stop.prevent="handleCreate">
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
            Create
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
