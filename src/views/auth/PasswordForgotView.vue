<script setup>
import { ref } from 'vue'
import api from '../../lib/axiosClient'
import toast from '../../lib/toast'
import router from '../../router'

const email = ref('')
const handleClickForgot = async () => {
  const payload = {
    email: email.value,
  }

  try {
    const res = await api.post('session/reset_request', payload)
    if (res) {
      toast.success(
        'If your email is found, we will email password reset instructions.'
      )
      router.push('/session/email')
    }
  } catch (err) {
    toast.error(err.message)
  }
}
</script>

<template>
  <div class="flex justify-center align-center pt-12">
    <form
      class="w-1/3 bg-white shadow-md rounded px-12 pt-6 pb-8 mb-4"
      @submit.stop.prevent="handleClickForgot"
    >
      <h3 class="mb-4 text-center font-bold">Reset your password</h3>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          Provide your email
        </label>
        <input
          v-model="email"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
          id="email"
          type="email"
          placeholder="Email"
        />
      </div>
      <div class="flex items-center justify-between">
        <button
          class="w-full bg-psci hover:bg-gold text-white hover:text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Request reset instructions
        </button>
      </div>
      <p class="mt-3 text-center text-gray-500 text-xs">
        <RouterLink to="/">Return home</RouterLink>
      </p>
    </form>
  </div>
</template>
