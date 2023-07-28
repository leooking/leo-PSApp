<script setup>
import { reactive } from 'vue'
import Results from '../sections/opportunitySearch/Results.vue'
import Search from '../sections/opportunitySearch/Search.vue'
import api from '../lib/axiosClient'
import { onMounted } from 'vue'
import toast from '../lib/toast'
import ProgressSpinner from 'primevue/progressspinner'
import NothingFound from '../components/NothingFound.vue'

const state = reactive({
  opportunities: [],
  loading: false,
  performSearch: false,
  naicCodeToTitle: {},
})

const fetchOpportunities = async (params = '') => {
  try {
    state.performSearch = true
    state.loading = true
    const res = await api.get(`data_sources/opportunities${params}`)
    state.opportunities = res.search_result
    console.log(state.opportunities, '++')
  } catch (err) {
    toast.error(err.message)
  } finally {
    state.loading = false
  }
}
onMounted(async () => {
  // commented out to prevent results on first load of the page.
  // try {
  //   const res = await fetchOpportunities()
  // } catch (err) {
  //   toast.error(err.message)
  // }
})
</script>
<template>
  <div class="text-black">
    <Search
      :refresh="fetchOpportunities"
      :setNaicCodeToTitle="(val) => (state.naicCodeToTitle = val)"
    />
    <Results
      :results="state.opportunities"
      v-if="!state.loading && state.opportunities.length > 0"
      :naicCodeToTitle="state.naicCodeToTitle"
    />
    <NothingFound
      v-if="!state.loading && state.opportunities.length === 0"
      :altTitle="state.performSearch ? 'No Results, Search Again!' : 'No Data Requested'"
    />
    <div
      class="w-full min-h-[50vh] flex justify-center items-center"
      v-else-if="state.loading"
    >
      <ProgressSpinner />
    </div>
  </div>
</template>
