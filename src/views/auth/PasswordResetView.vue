<script setup>
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { ref } from 'vue'
import api from '../../lib/axiosClient'
import toast from '../../lib/toast'

const route = useRoute()
const router = useRouter()
const password = ref('')
const token = ref(route.query.token)
console.log(token)

const handleClickReset = async () => {
  const payload = {
    password: password.value,
    token: route.query.token,
  }
  try {
    const res = await api.post('session/password_reset', payload)
    if (res) {
      toast.success('Your password has been reset, please login')
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
      @submit.stop.prevent="handleClickReset"
    >
      <h3 class="mb-4 text-center font-bold">Choose a new password</h3>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          Type your password
        </label>
        <input
          v-model="password"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
          id="password"
          type="password"
          placeholder="•••••••••"
        />
      </div>
      <div class="flex items-center justify-between">
        <button
          class="w-full bg-psci hover:bg-gold text-white hover:text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Save new password
        </button>
      </div>
      <p class="mt-3 text-center text-gray-500 text-xs">
        <RouterLink to="/">Return home</RouterLink>
      </p>
    </form>
  </div>
</template>
