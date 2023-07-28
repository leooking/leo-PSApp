<script setup>
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import toast from '../../lib/toast'
import api from '../../lib/axiosClient'
import TheGeneratorCard from '../ProjectGeneratorCard.vue'

const state = reactive({ generators: [], loading: true, project: null })
const route = useRoute()

onMounted(async () => {
  try {
    const res = await api.get('generators')
    const project = await api.get('projects/' + route.params.pid)
    state.project = project
    // * To avoid an error if private_generators is null
    state.generators = res.private_generators
      ? [...res.private_generators, ...res.generators]
      : res.generators
  } catch (err) {
    toast.error(err.message)
  } finally {
    state.loading = false
  }
})
</script>

<template>
  <h3 class="mt-6 mb-3">Insight Asset Generators</h3>
  <p class="mb-4">These Generators produce Insight Assets</p>
  <span v-if="!state.generators.length && state.loading">Loading...</span>
  <div
    v-if="state.generators.length > 0"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
  >
    <TheGeneratorCard
      :generator="generator"
      :project="state.project"
      v-for="generator in state.generators"
      :key="generator.pid"
    />
  </div>
</template>
