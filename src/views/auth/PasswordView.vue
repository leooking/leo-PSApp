<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import api from '../../lib/axiosClient'
import { getItem } from '../../lib/storage'
import router from '../../router'
import user from '../../lib/user'
import toast from '../../lib/toast'
import { errors } from '../../lib/messages'

const password = ref('')
const handleClickFinish = async () => {
  const payload = {
    password: password.value,
    auth_token: getItem('authToken'),
  }
  try {
    const res = await api.post('session/password', payload)
    if (res) {
      if (res.mfa_enabled) {
        router.push('/session/2fa')
      } else {
        user.signIn(res)
        router.push('/')
      }
    }
  } catch (err) {
    toast.error(errors.password?.[err?.response?.status] ?? err.message)
  }
}
</script>

<template>
  <div class="flex justify-center align-center pt-12">
    <form
      class="w-1/3 bg-white shadow-md rounded px-12 pt-6 pb-4 mb-4"
      @submit.stop.prevent="handleClickFinish"
    >
      <h3 class="mb-4 text-center font-bold">Finish signing in</h3>
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="password"
        >
          Password
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
          id="submit"
          class="w-full bg-psci hover:bg-gold text-white hover:text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Finish signing in
        </button>
      </div>
      <p class="mt-3 text-center text-gray-400 text-xs">
        <RouterLink class="underline mr-2" to="/session/forgot_password"
          >Forgot password?</RouterLink
        >
        Need help?
        <a
          class="underline hover:bold"
          href="mailto:support@procurementsciences.com"
          >Email support</a
        >
      </p>
    </form>
  </div>
</template>
