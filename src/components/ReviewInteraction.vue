<script setup>
import api from '../lib/axiosClient'
import toast from '../lib/toast'
import { debounce } from 'vue-debounce'

const props = defineProps({
  thumbs: Boolean || null,
  pid: String,
  interactions: Array,
  disabled: Boolean,
})

const updateInteraction = (newThumb) => {
  const interaction = props.interactions.find((i) => i.pid === props.pid)
  interaction.thumbs = newThumb
}

const like = debounce(async () => {
  try {
    await api.put(`asset_interactions/${props.pid}`, {
      thumbs: true,
    })
    updateInteraction(true)
  } catch (err) {
    toast.error(err.message)
  }
}, '500ms')

const dislike = debounce(async () => {
  try {
    await api.put(`asset_interactions/${props.pid}`, {
      thumbs: false,
    })
    updateInteraction(false)
  } catch (err) {
    toast.error(err.message)
  }
}, '500ms')

const nullify = debounce(async () => {
  try {
    await api.put(`asset_interactions/${props.pid}`, {
      thumbs: null,
    })
    updateInteraction(null)
  } catch (err) {
    toast.error(err.message)
  }
}, '500ms')
</script>
<template>
  <div class="flex flex-col align-center">
    <img
      alt="SA logomark"
      src="@/assets/mark_grey_120x.png"
      class="mb-3 max-w-[45px]"
    />
    <div class="flex">
      <button
        @click="props.thumbs === true ? nullify() : like()"
        :class="`mb-2 mr-2 material-icons md-20 disabled:bg-transparent ${
          props.thumbs === true ? 'text-gray-600 ' : 'text-gray-400'
        } ${props.disabled ? 'opacity-25' : ''}`"
        :disabled="props.disabled"
      >
        thumb_up
      </button>
      <button
        @click="props.thumbs === true ? nullify() : dislike()"
        :class="`mb-2 mr-2 material-icons md-20 disabled:bg-transparent ${
          props.thumbs === false ? 'text-gray-600 ' : 'text-gray-400'
        } ${props.disabled ? 'opacity-25' : ''}`"
        :disabled="props.disabled"
      >
        thumb_down
      </button>
    </div>
  </div>
</template>
