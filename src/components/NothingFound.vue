<script setup>
const props = defineProps({ name: String, subTitle: String, altTitle: String })
</script>
<template>
  <div
    class="flex flex-col justify-center items-center min-h-[500px] text-gray-600"
  >
    <img
      alt="No results"
      src="@/assets/no-results.png"
      class="w-[100px] h-[100px]"
    />

    <h2 class="mt-6 mb-4">
      {{ props.altTitle ? props.altTitle : 'No Data Found' }}
    </h2>
    <h4 v-if="props.name">
      Create a new folder or {{ props.name }} to get started
    </h4>
    <h4 v-else-if="props.subTitle">{{ props.subTitle }}</h4>
  </div>
</template>
