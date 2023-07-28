<script setup>
import AssetsList from '../../sections/assets/AssetsList.vue'

const props = defineProps({ project: Object })
</script>

<template>
  <h3 class="mt-6 mb-3">Insight Assets</h3>

  <AssetsList :projectPid="props.project.pid" />
</template>
