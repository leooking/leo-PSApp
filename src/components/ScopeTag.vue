<script setup>
import Tag from 'primevue/tag'
import { reactive, onMounted } from 'vue'

const props = defineProps({ scope: String })

const state = reactive({
  value: '',
  color: '',
})

onMounted(() => {
  state.value = scopeToName()
  state.color = scopeToColor()
})

const scopeToColor = () => {
  switch (props.scope) {
    case 'group':
      return 'warning'
    case 'mine':
      return 'success'
  }
}

const scopeToName = () => {
  switch (props.scope) {
    case 'group':
      return 'Shared'
    case 'mine':
      return 'Private'
  }
}
</script>
<template>
  <Tag
    :style="{
      height: '26px',
      fontSize: '10px',
      position: 'absolute',
      top: 0,
      right: 0,
      borderRadius: '0 0 5px 5px',
    }"
    :severity="state.color"
    :value="state.value"
  ></Tag>
</template>
