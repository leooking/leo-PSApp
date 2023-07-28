<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import toast from '../../lib/toast'
import { errors } from '../../lib/messages'
import api from '../../lib/axiosClient'

const route = useRoute()
const router = useRouter()
const token = ref(route.query.token)

onMounted(async () => {
  try {
    const payload = {
      confirmation_token: token.value,
    }
    console.log('payload', payload)
    const res = await api.put('users/verify_email', payload)
  } catch (err) {
    router.push('/')
    toast.error(errors.confirm?.[err?.response?.status] ?? err.message)
  }
})
</script>

<template>
  <div class="flex justify-center align-center pt-12">
    <div class="w-1/3 bg-white shadow-lg rounded m-12 px-12 py-8">
      <h3 class="text-center">Thank you, your email has been verified</h3>
      <button
        class="mt-3 w-full bg-psci hover:bg-gold text-white hover:text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
      >
        <RouterLink to="/session/email">Please sign in</RouterLink>
      </button>
    </div>
  </div>
</template>
