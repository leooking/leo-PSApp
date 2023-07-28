<script setup>
import { ref } from 'vue'
import api, { setupRequestHeaders } from '../../lib/axiosClient'
import { setItem } from '../../lib/storage'
import toast from '../../lib/toast'
import { auth0Login, handleCallback } from '../../lib/authService';
import { useRouter, useRoute } from 'vue-router'
import { errors } from '../../lib/messages'

const email = ref('')
const loading = ref(false);
const router = useRouter()
const route = useRoute()

const handleClickNext = async () => {
  const payload = {
    email: email.value.toLowerCase(),
  }
  try {
    const res = await api.post('session/email', payload)
    if (res) {
      setItem('apiKey', res.api_key)
      setItem('authToken', res.auth_token)
      setupRequestHeaders()
      router.push('/session/password')
    }
  } catch (err) {
    toast.error(errors.email?.[err?.response?.status] ?? err.message)
    router.push('/')
  }
}

const loginWithAuth0 = async () => {
  try {
    loading.value = true;
    await auth0Login();
    await handleCallback();
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex justify-center align-center pt-12">
    <div class="w-1/3 bg-white shadow-md rounded px-12 pt-6 pb-4 mb-4">
    <form  @submit.stop.prevent="handleClickNext">
      <h3 class="mb-4 text-center font-bold">
        {{
          route.query.inactive
            ? 'You have been logged out, please sign in to continue'
            : 'Member sign in'
        }}
      </h3>

      <button
        id="submit"
        class="font-bold mb-4 w-full mt-3 md:mt-0 hover:bg-purple hover:text-white border border-purple text-purple py-2 px-4 rounded focus:outline-none focus:shadow-outline whitespace-nowrap"
        @click="loginWithAuth0" :disabled="loading"
      >
        Sign-in with Auth0
      </button>

      <!-- <button
        id="submit"
        class="font-bold mb-4 w-full mt-3 md:mt-0 hover:bg-purple hover:text-white border border-purple text-purple py-2 px-4 rounded focus:outline-none focus:shadow-outline whitespace-nowrap"
        @click="loginWithAuth0" :disabled="loading"
      >
        Sign-in with Microsoft
      </button>

      <button
        id="submit"
        class="font-bold mb-4 w-full mt-3 md:mt-0 hover:bg-purple hover:text-white border border-purple text-purple py-2 px-4 rounded focus:outline-none focus:shadow-outline whitespace-nowrap"
        @click="loginWithAuth0" :disabled="loading"
      >
        Sign-in with LinkedIn
      </button> -->

      <p class="mt-3 text-center font-bold">Or sign in with email:</p>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          Email
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
          id="submit"
          class="w-full bg-psci hover:bg-gold text-white hover:text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Next...
        </button>
      </div>
    </form>
      <div class="flex items-center justify-between mt-3">
      </div>
      <p class="text-xs text-center text-gray-400 mt-3">
        Need help?
        <a
          class="underline hover:bold"
          href="mailto:support@procurementsciences.com"
          >Email support</a
        >
      </p>
    </div>
  </div>
</template>
