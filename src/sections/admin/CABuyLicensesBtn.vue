<script setup>
import { reactive } from 'vue'

const props = defineProps({
  nb_licenses: {
    type: Number,
    default: 10,
  },
})

const state = reactive({
  nb_licenses: props.nb_licenses,
})

const buyLicenses = () => {
  alert(`Buy ${state.nb_licenses} Licenses`)
}
</script>

<template>
  <button
    class="bg-psci hover:bg-gold text-white hover:text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    type="button"
    id="buy-licenses"
    @click="buyLicenses"
  >
    Buy {{ state.nb_licenses }} licenses
  </button>
</template>
