<script setup>
import { inject } from 'vue'

const emit = inject('emit')

</script>

<template>
  <div class="modal-body p-2">
    Do you want to delete this notification?
  </div>
  <div class="mt-2 w-full">
    <div class="flex flex-row items-center gap-4 w-full mt-4">
      <button
          class="bg-psci hover:bg-gold text-white hover:text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          @click="emit('confirm')"
      >
        Yes
      </button>

      <button
          class="bg-slate-200 hover:bg-gold text-dark hover:text-black font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
          type="button"
          @click="emit('close')"
      >
        No
      </button>
    </div>
  </div>
</template>
