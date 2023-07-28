<script setup>
import { ref, onMounted } from 'vue'
import AutoComplete from 'primevue/autocomplete'

const suggestionsRef = ref(null)
const value = ref('')

const props = defineProps({
  placeholder: String,
  availableTags: Array,
  addSourceTag: Function,
  getFiltered: Function,
  inModal: Boolean,
})

const adjustPosition = () => {
  const { top, left, width } = document
    .querySelector('#tagInputWrapper')
    .getBoundingClientRect()
  if (suggestionsRef?.value) {
    suggestionsRef.value.style.width = `${width}px`
    suggestionsRef.value.style.top = props.inModal ? `60px` : `${top + 40}px`
    suggestionsRef.value.style.left = props.inModal ? `23px` : `${left}px`
  }
}
onMounted(() => {
  console.log(props.availableTags.source)
  adjustPosition()
})

</script>
<style scoped>
.focused {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
<!-- @keydown="handleKeyDown" -->
<template>
  <AutoComplete
    v-model="value"
    :suggestions="props.availableTags"
    @complete="() => {}"
    :placeholder="placeholder"
    selectionEnd="27"
    class="!w-full"
  />
</template>