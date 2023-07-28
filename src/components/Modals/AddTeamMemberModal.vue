<script setup>
import { inject } from 'vue'

const emit = inject('emit')
const props = inject('props')
</script>
<template>
  <div>
    <h4 class="pb-5 pl-4">Add Team Member</h4>
    <form class="md:px-5 w-full" @submit.stop.prevent="">
      <div class="form-row">
        <div class="form-field w-full">
          <ul
            class="list-none space-y-4 max-h-[600px] overflow-auto"
            v-if="props?.parentState?.availableUsers.length > 0"
          >
            <li
              class="w-full flex justify-between"
              v-for="user in props?.parentState?.availableUsers"
            >
              {{ user.fname }} {{ user.lname }}

              <button
                class="bg-psci hover:bg-gold text-white hover:text-black font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                @click="emit('confirm', user)"
              >
                Add
              </button>
            </li>
          </ul>
          <h4 class="text-center py-6" v-else>No users available</h4>
        </div>
      </div>
    </form>
  </div>
</template>
