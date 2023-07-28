<script setup>
const props = defineProps({
  cellTitle: String,
  value: String,
  class: {
    type: String,
    default: '',
  },
  isLink: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div
    :class="`w-full flex-1 flex flex-row border border-black p-1 ${props.class}`"
  >
    <div :class="`w-[20%] font-bold text-sm text-gray-900`">
      {{ props.cellTitle }}
    </div>
    <div :class="`w-[80%] flex-1 text-sm text-gray-700`" v-if="!props.isLink">
      {{ props.value?.replace(/�/g, "") }}
    </div>
    <div :class="`w-[80%] flex-1 text-sm text-gray-700`" v-else>
      <a
        :href="props.value"
        alt=""
        target="_blank"
        rel="noreferrer"
        class="underline text-blue-500 break-words whitespace-normal"
      >
        {{ props.value }}
      </a>
    </div>
  </div>
</template>
