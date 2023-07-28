<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { provide, reactive } from 'vue'

const props = defineProps({
  generator: Object,
  projectsList: Array,
  project: Object,
  name: String,
  availableUsers: Array,
  confirm: Function,
  parentState: Object,
  purpose: String,
  isLarge: Boolean,
  noCloseBtn: Boolean,
  type: String,
  blockCloseOnOverlayClick: Boolean,
})

const emit = defineEmits([
  'close',
  'confirm',
  'setCurrent',
  'changeModal',
  'refresh',
  'open',
])
const reactiveProps = reactive(props)
provide('props', reactiveProps)
provide('emit', emit)
</script>
<style>
.confirm-modal {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.confirm-modal-content {
  width: 100%;
  max-height: 600px;
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: 10px;
}
</style>
<template>
  <VueFinalModal
    class="confirm-modal"
    :content-class="`confirm-modal-content ${
      props?.isLarge ? 'max-w-[900px]' : 'max-w-[600px]'
    } `"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :clickToClose="props?.blockCloseOnOverlayClick ? false : true"
    @opened="emit('open')"
  >
    <div
      class="modal-content border-none relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current"
    >
      <div
        class="modal-header flex flex-shrink-0 items-center justify-between p-4"
      >
        <button
          type="button"
          class="relative z-[100] btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-skiba hover:opacity-75 hover:no-underline"
          @click="emit('close')"
          v-if="!props?.noCloseBtn"
        ></button>
      </div>
      <div class="relative z-[0] mt-[-35px] pb-[20px] modal-body p-4">
        <slot />
      </div>
    </div>
  </VueFinalModal>
</template>
