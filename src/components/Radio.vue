<script setup>
const props = defineProps({
  isDisabled: Boolean,
  name: String,
  value: String,
  toggle: Function,
  isRequired: Boolean,
  checked: Boolean,
})
</script>
<template>
  <div class="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
    <input
      class="relative float-left mt-0.5 mr-1 -ml-[1.5rem] h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-3 before:w-3 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-3 after:w-3 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:bg-blue-500"
      type="radio"
      name="scopeLabel"
      :id="props.name"
      :onChange="($event) => toggle(props.value)"
      :required="props.isRequired"
      :checked="props.checked"
      :disabled="props.isDisabled"
    />
    <label
      class="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
      :for="props.name"
    >
      {{ props.name }}
    </label>
  </div>
</template>
