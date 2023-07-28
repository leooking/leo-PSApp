<script setup>
import { inject } from 'vue'

const props = inject('props')
const emit = inject('emit')
</script>
<template>
  <div class="modal-body p-4">
    <form class="md:px-5 w-full" @submit.stop.prevent="emit('confirm')">
      <h4 class="text-center mb-12">
        Are you sure you want to delete this {{ props.name.toLowerCase() }}?
      </h4>

      <button
        class="bg-psci w-full hover:bg-gold text-white hover:text-black font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
        type="submit"
        id="confirm-delete"
      >
        Confirm Deletion
      </button>
    </form>
  </div>
</template>
