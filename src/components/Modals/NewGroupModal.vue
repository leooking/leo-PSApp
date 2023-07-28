<script setup>
import { ref, inject } from 'vue'

const emit = inject('emit')
const props = inject('props')

const groupName = ref('')

const createGroup = () => {
  // console.log(props)
  // emit('createGroup', groupName)
  props.confirm(groupName)
}
</script>
<template>
  <div>
    <h4 class="pb-5 pl-4">Create Note</h4>
    <form class="md:px-5 w-full" @submit.stop.prevent="">
      <div class="form-row">
        <div class="form-field w-full">
          <label
            class="text-left block text-gray-700 text-sm font-bold mb-1"
            for="groupName"
          >
            Group Name
          </label>
          <input
            v-model="groupName"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            id="groupName"
            type="text"
          />
        </div>
      </div>

      <button
        class="bg-psci hover:bg-gold text-white hover:text-black font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
        type="button"
        @click="createGroup"
      >
        Create Group
      </button>
    </form>
  </div>
</template>
