<script setup>
import { ref, onMounted, reactive } from 'vue'
import api from '../../lib/axiosClient'

const state = reactive({
  assets: [],
  loading: true,
})

onMounted(async () => {
  try {
    const res = await api.get('assetz')
    state.assets = res.assets
  } catch (err) {}
})
</script>
<template>
  <div>
    <h3>Recent Assets</h3>

    <div class="">
      <div class="flex" v-for="asset in state.assets">
        <p>{{ asset.name }}</p>
      </div>
    </div>
  </div>
</template>
