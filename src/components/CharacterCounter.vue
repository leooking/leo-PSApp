<script setup>
const props = defineProps({ content: String, limit: Number, hasBtn: Boolean })
</script>
<template>
  <div class="relative w-full z-1">
    <slot />
    <div
      :class="`absolute bottom-2 flex items-center text-xs text-gray-500 right-5`"
      v-if="limit"
    >
      <span>{{ content?.length }}</span>
      <span>/</span>
      <span>{{ limit }}</span>
    </div>
  </div>
</template>
