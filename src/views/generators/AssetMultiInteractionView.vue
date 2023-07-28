<script setup>
import { ref } from 'vue'
import Generate from '../../sections/Multi/Generate.vue'
import Response from '../../sections/Multi/Response.vue'
import InteractionWrapper from '../../components/InteractionWrapper.vue'

const active = ref(0)

const next = () => (active.value = 1)
const back = () => (active.value = 0)

const enabled = {
  userGuide: true,
  dataSources: true,
}
</script>
<template>
  <InteractionWrapper :enabled="enabled">
    <div v-if="active === 0" class="w-full">
      <Generate :next="next" :back="back" />
    </div>
    <div v-else-if="active === 1" class="w-full">
      <Response :back="back" />
    </div>
  </InteractionWrapper>
</template>
