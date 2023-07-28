<script setup>
import { onMounted, reactive } from 'vue'
import toast from '../../lib/toast'
import api from '../../lib/axiosClient'
import CASubNavbar from '@/sections/admin/CASubNavbar.vue'
import LicensesList from '@/sections/admin/LicensesList.vue'
import CALicensesSummary from '@/sections/admin/CALicensesSummary.vue'
import CABuyLicensesBtn from '@/sections/admin/CABuyLicensesBtn.vue'
import user from '../../lib/user'

const state = reactive({
  licenses: [],
  loading: true,
})

const buy10licenses = () => {
  alert('Clicked button: "Buy 10 licenses"')
}

onMounted(async () => {
  try {
    const { license } = await api.get('customers/dashboard')
    state.licenses = license.licenses
  } catch (err) {
    toast.error(err.message)
  } finally {
    state.loading = false
  }
})
</script>

<template>
  <div class="flex justify-between w-full">
    <h2 class="my-2">
      {{ user.profile.org.org_name }}&nbsp;PSciBIS&nbsp;Seat&nbsp;Licenses
    </h2>
    <CASubNavbar />
  </div>
  <div>
    <h3 class="my-2">Summary</h3>
    <CALicensesSummary />
  </div>
  <div v-if="!state.loading">
    <div class="flex w-full justify-between pb-4">
      <h3 class="my-2">Licenses</h3>
      <CABuyLicensesBtn />
    </div>
    <LicensesList :licenses="state.licenses" />
  </div>
</template>
