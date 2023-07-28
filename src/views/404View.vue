<script>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="flex justify-center align-center">
    <div class="bg-white shadow-lg rounded m-12 px-12 py-8">
      <h3 class="text-center">Page not found!</h3>
      <button
        class="mt-3 w-full bg-psci hover:bg-gold text-white hover:text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
      >
        <RouterLink to="/">Return home</RouterLink>
      </button>
    </div>
  </div>
</template>
