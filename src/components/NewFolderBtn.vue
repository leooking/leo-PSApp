<script setup>
import Modal from './Modals/Modal.vue'
import NewFolderModal from './Modals/NewFolderModal.vue'
import { useModal } from 'vue-final-modal'
import api from '../lib/axiosClient'
import toast from '../lib/toast'
import Button from 'primevue/button'
import capitalize from '../lib/capitalize'

const props = defineProps({
  type: String,
  updateList: Function,
  classes: String,
})

const { open: openCreateFolder, close: closeCreateFolder } = useModal({
  component: Modal,
  attrs: {
    purpose: 'CreateNew',
    name: props.type,
    parentState: {},
    onClose() {
      closeCreateFolder()
    },
    async onConfirm(folder) {
      try {
        const res = await api.post(`folders`, {
          name: folder.name,
          scope: folder.scope,
          folder_type: props.type,
        })
        props.updateList()
        toast.success('Folder Created')
        closeCreateFolder()
      } catch (err) {
        toast.error(err.message)
      }
    },
  },
  slots: {
    default: NewFolderModal,
  },
})
</script>
<style>
.p-tooltip {
  min-width: max-content;
}
</style>
<template>
  <Button
    icon="pi pi-folder-open"
    class="bg-purple whitespace-nowrap !min-w-[50px] !mr-3"
    v-tooltip.right="
      `Create New ${props.type && capitalize(props.type)} Folder`
    "
    @click="openCreateFolder"
  />
</template>
