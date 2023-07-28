<script setup>
import { ref, inject } from 'vue'

const props = inject('props')
const newNote = ref('')
</script>
<template>
  <div>
    <h4 class="pb-5 pl-4">Create Note</h4>
    <form
      class="md:px-5 w-full"
      @submit.stop.prevent="
        () => {
          props.confirm(newNote)
          newNote = ''
        }
      "
    >
      <div class="form-row">
        <div class="form-field w-full">
          <label
            class="text-left block text-gray-700 text-sm font-bold mb-1"
            for="newNote"
            >Note
          </label>
          <textarea
            v-model="newNote"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            id="newNote"
            type="text"
            maxlength="512"
            rows="3"
          ></textarea>
          <p class="text-right text-s text-gray-400">512 char max</p>
        </div>
      </div>

      <button
        class="bg-psci hover:bg-gold text-white hover:text-black font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Add Note
      </button>
    </form>
  </div>
</template>
