<script setup>
import { defineProps } from 'vue'
import Tag from 'primevue/tag'

const props = defineProps({
  tag: String,
  onClick: Function,
  type: String,
})
</script>

<template class="h-screen">
  <div class="cursor-pointer">
    <Tag
      :icon="props.type === 'add' ? 'pi pi-plus' : 'pi pi-times'"
      @click="onClick"
      >{{ tag }}</Tag
    >
  </div>
</template>
