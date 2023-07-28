<script setup>
import { onMounted } from 'vue';
import api, { setupRequestHeaders } from '../../lib/axiosClient'
import { handleCallback } from '../../lib/authService';
import router from '../../router'
import { setItem } from '../../lib/storage'
import user from '../../lib/user'
import toast from '../../lib/toast'
import ProgressSpinner from 'primevue/progressspinner'

onMounted(async () => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const authResult = await handleCallback();
    const payload = {
        access_token: params.get("access_token"),
        id_token: params.get("id_token")
    }
    try {
        const res = await api.post('auth0/verify', payload)
        if (res) {
            setItem('apiKey', res.api_key)
            setupRequestHeaders()
            user.signIn(res)
            router.push('/')
        }
    } catch (err) {
        toast.error(err?.response?.data?.error)
        router.push('/session/email')
    }
});
</script>

<template>
    <div class="w-full min-h-[50vh] flex justify-center items-center">
        <ProgressSpinner />
    </div>
    <div class="w-full text-center">
        Finalizing authentication...
    </div>
</template>
