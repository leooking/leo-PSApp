<script setup>
import { defineProps } from 'vue'

const props = defineProps({ name: String, detachFunc: Function })
</script>
<template>
  <div
    class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none"
    :id="`confirm${props.name}Detach`"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    :aria-labelledby="`confirm${props.name}Detach`"
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
            id="closeDetachModal"
            class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-skiba hover:opacity-75 hover:no-underline"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body p-4">
          <form class="md:px-5 w-full" @submit.stop.prevent="props.detachFunc">
            <h4 class="text-center mb-12" id="confirmProjectDetachLabel">
              Are you sure you want to detach this resource?
            </h4>

            <button
              class="bg-psci w-full hover:bg-gold text-white hover:text-black font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Confirm Detach
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
