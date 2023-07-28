<script setup>
import { ref, onMounted, reactive } from 'vue'
import { vue3Debounce, debounce } from 'vue-debounce'
import api from '../lib/axiosClient'
import toast from '../lib/toast'
import { errors } from '../lib/messages'
import user from '../lib/user'
import router from '../router'
import 'tw-elements'

const state = reactive({ loading: true })

const first_name = ref('')
const last_name = ref('')
const email = ref('')
const email_verified = ref('')

onMounted(async () => {
  try {
    const res = await api.get('users/' + user.pid)

    first_name.value = res.profile.fname
    last_name.value = res.profile.lname
    email.value = res.email
    email_verified.value = res.email_verified
  } catch (err) {
    toast.error(err.message)
  } finally {
    state.loading = false
  }
})

const verifyEmail = async (pid) => {
  try {
    const res = await api.get(
      'users/' + user.pid + '/resend_verification_email'
    )
    email_verified.value = 'sent'
    toast.info('Request received, email sent.')
  } catch (err) {
    toast.error(errors.settings?.[err?.response?.status] ?? err.message)
  }
}

const handleResetPassword = async () => {
  try {
    const res = await api.post('session/reset_request', { email: user.email })
    if (res) {
      toast.info(
        'Password reset email sent. Check your inbox for a link to reset your password.'
      )
    }
  } catch (err) {
    toast.error(errors.settings?.[err?.response?.status] ?? err.message)
  }
}

const handleUpdate = async (pid) => {
  const payload = {
    fname: first_name.value,
    lname: last_name.value,
    email: email.value,
  }
  try {
    const res = await api.put('users/' + pid, payload)
    if (res) {
      router.push('/')
    }
  } catch (err) {
    toast.error(errors.settings?.[err?.response?.status] ?? err.message)
  }
}
</script>

<template>
  <div class="mb-6 flex flex-row">
    <div class="mr-4 flex items-center">
      <h2>User Settings</h2>
    </div>
  </div>

  <form class="md:px-5 w-full" @submit.stop.prevent="handleUpdate(user.pid)">
    <div class="grid grid-cols-1 gap-5">
      <div class="align-center px-10">
        <div class="form-row">
          <div class="w-6/12">
            <label
              class="block text-gray-700 text-sm font-bold mb-1"
              for="first_name"
            >
              First Name
            </label>
            <input
              v-model="first_name"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              id="first_name"
              type="text"
              placeholder=""
            />
          </div>

          <div class="w-6/12">
            <label
              class="block text-gray-700 text-sm font-bold mb-1"
              for="last_name"
            >
              Last Name
            </label>
            <input
              v-model="last_name"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              id="last_name"
              type="text"
              placeholder=""
            />
          </div>
        </div>

        <div class="form-row">
          <div class="w-full">
            <label
              class="block text-gray-700 text-sm font-bold mb-1"
              for="email"
              >Email</label
            >
            <input
              v-model="email"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              id="email"
              type="email"
              placeholder=""
            />
            <p
              v-if="email_verified"
              class="text-right text-xs italic text-gray-500 mt-2"
            >
              <span v-if="email_verified === 'sent'"
                >A verification email has been sent</span
              >
              <span v-else>Email is verified</span>
            </p>
            <p
              @click="verifyEmail(user.pid)"
              v-else-if="!email_verified"
              class="underline hover:text-bold mt-2 hover:text-black hover:cursor-pointer text-right text-xs text-red-600"
            >
              Resend email validation
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="px-10 mt-2 w-full">
      <div class="flex flex-row items-center gap-4 w-full mt-4">
        <button
          class="bg-psci hover:bg-gold text-white hover:text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Update
        </button>

        <button
          class="bg-slate-200 hover:bg-gold text-dark hover:text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          <RouterLink to="/">Cancel</RouterLink>
        </button>
      </div>
    </div>
  </form>
</template>
