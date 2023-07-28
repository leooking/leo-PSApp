<script setup>
import { onMounted, reactive } from 'vue'
import api from '@/lib/axiosClient'
import toast from '@/lib/toast'
import CABuyLicensesBtn from './CABuyLicensesBtn.vue'

const props = defineProps({
  summary: {
    available_licenses: Number,
    allocated_licenses: Number,
    licenses_expiry: Date,
  },
  buy_able: Boolean,
})

const state = reactive({
  summary: props.summary || {},
  buy_able: props.buy_able,
  loading: false,
})

onMounted(async () => {
  if (!props.summary) {
    try {
      const { license } = await api.get('customers/dashboard')
      state.summary = license.summary
      state.summary.licenses_expiry = new Date(state.summary.licenses_expiry)
    } catch (err) {
      toast.error(err.message)
    } finally {
      state.loading = false
    }
  } else {
    state.loading = false
  }
})
</script>

<template>
  <div>
    <div class="flex w-full justify-between">
      <h3 class="my-3">Licenses Summary</h3>
      <div v-if="state.buy_able">
        <CABuyLicensesBtn />
      </div>
    </div>
    <ul v-if="!state.loading">
      <li class="my-2">
        Available Licenses:
        <span class="font-bold">{{ state.summary.available_licenses }}</span>
      </li>
      <li class="my-2">
        Allocated Licenses:
        <span class="font-bold">{{ state.summary.allocated_licenses }}</span>
      </li>
      <li class="my-2">
        License Expiry:
        <span class="font-bold">{{
          state.summary.licenses_expiry
            ? state.summary.licenses_expiry.toLocaleString()
            : 'N/A'
        }}</span>
      </li>
    </ul>
  </div>
</template>
