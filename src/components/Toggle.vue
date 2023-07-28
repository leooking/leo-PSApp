<script setup>
const props = defineProps({
  checked: Boolean,
  isDisabled: Boolean,
  toggle: Function,
  classes: String,
  for: String,
  tooltip: String,
})
</script>
<template>
  <div
    class="form-check form-switch flex items-center"
    v-tooltip="props.tooltip"
  >
    <input
      :class="`form-check-input appearance-none mr-2 w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm disabled:opacity-100 disabled:cursor-not-allowed ${props.classes} `"
      type="checkbox"
      role="switch"
      :id="props.for ? props.for : 'toggle'"
      @change="toggle"
      :disabled="props.isDisabled"
      :checked="props.checked"
    />
    <label
      class="form-check-label inline-block text-gray-800"
      :for="props.for ? props.for : 'toggle'"
    >
      <slot />
    </label>
  </div>
</template>
