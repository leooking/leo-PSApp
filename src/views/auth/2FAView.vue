<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import api from '../../lib/axiosClient'
import { getItem } from '../../lib/storage'
import router from '../../router'
import user from '../../lib/user'
import toast from '../../lib/toast'
import { errors } from '../../lib/messages'

const otp = ref('')
const handleOTPVerification = async () => {
  const payload = {
    otp: otp.value,
    auth_token: getItem('authToken'),
  }
  try {
    const res = await api.post('session/verify_otp', payload)
    if (res) {
      user.signIn(res)
      router.push('/')
    }
  } catch (err) {
    toast.error(err?.response?.data?.error)
  }
}
</script>

<template>
  <div class="flex justify-center align-center pt-12">
    <div class="w-1/3 bg-white shadow-md rounded px-12 pt-6 pb-4 mb-4">
      <form @submit.stop.prevent="handleOTPVerification">
        <h3 class="mb-4 text-center font-bold">Two factor authentication</h3>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="otp">
            Please enter the 6 digit code sent to your email
          </label>
          <input v-model="otp"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required type="text" pattern="[0-9]{6}" title="Please enter a 6-digit OTP" placeholder="Enter your one time password" />
        </div>
        <div class="flex items-center justify-between">
          <button id="submit"
            class="w-full bg-psci hover:bg-gold text-white hover:text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit">
            Finish signing-in
          </button>
        </div>
      </form>
      <p class="mt-3 text-center text-gray-400 text-xs">
        Need help?
        <a class="underline hover:bold" href="mailto:support@procurementsciences.com">Email support</a>
      </p>
    </div>
  </div>
</template>
