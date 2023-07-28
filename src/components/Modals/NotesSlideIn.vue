<script setup>
import { reactive, defineProps } from 'vue'
import api from '../../lib/axiosClient'
import toast from '../../lib/toast'
import DeletionModal from './DeletionModal.vue'
import { useModal } from 'vue-final-modal'
import Modal from './Modal.vue'
import AddNoteModal from './AddNoteModal.vue'

const state = reactive({ notePid: null })
const props = defineProps({ data: Object, type: String })

const addNote = async (newNote) => {
  if (newNote.length > 512) {
    toast.error('Note must be less than 512 characters')
    return
  }
  if (newNote.length < 1) {
    toast.error('Note must be at least 1 character')
    return
  }
  const note = {
    text: newNote,
    project: props.data._id,
    resource: props.data._id,
  }
  try {
    const res = await api.post(`${props.type}/${props.data.pid}/add_note`, note)

    props.data.notes.push(res)
    toast.success('Note added')
    closeCreateNote()
  } catch (err) {
    toast.error(err)
  }
}

const deleteNote = async () => {
  try {
    const res = await api.post(`${props.type}/${props.data.pid}/remove_note`, {
      note_pid: state.notePid,
    })
    props.data.notes = props.data.notes.filter(
      (note) => note.pid !== state.notePid
    )

    toast.success('Note deleted')
    close()
  } catch (err) {
    toast.error(err)
  }
}

const { open, close } = useModal({
  component: Modal,
  attrs: {
    name: 'Note',
    onConfirm() {
      deleteNote()
    },
    onClose() {
      close()
      state.notePid = null
    },
  },
  slots: {
    default: DeletionModal,
  },
})

const { open: openCreateNote, close: closeCreateNote } = useModal({
  component: Modal,
  attrs: {
    confirm: addNote,
    onClose() {
      closeCreateNote()
    },
  },
  slots: {
    default: AddNoteModal,
  },
})
</script>

<style lang="css">
.animate {
  animation: slideInFromRight 0.5s ease-in-out;
}

@keyframes slideInFromRight {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}
</style>

<template>
  <div
    class="w-80 h-auto shadow-md bg-white absolute top-0 right-0 mt-[50px] mr-[-15px] p-4 animate scroll-auto"
    :style="{ zIndex: 2 }"
  >
    <div class="flex justify-between font-bold mb-2">
      <h5>Notes ({{ props.data.notes.length }})</h5>
      <button
        @click="openCreateNote"
        class="text-gray-500 mb-2 pr-3 material-icons text-[30px]"
        id="open-create-note"
      >
        add
      </button>
    </div>
    <ul
      class="w-full ml-0 pr-4 max-h-[400px] overflow-auto"
      v-if="props.data.notes.length > 0"
    >
      <div class="flex flex-col" v-for="note in props.data.notes">
        <div class="flex justify-between align-start text-xs">
          <div class="flex text-gray-500">
            <h5 class="font-bold pr-2" v-if="note.author">
              {{ note?.author }}
            </h5>
            <p>{{ note?.created_at }}</p>
          </div>
          <button
            @click="
              () => {
                state.notePid = note.pid
                open()
              }
            "
            data-bs-toggle="modal"
            data-bs-target="#confirmNoteDeletion"
            class="text-gray-400 mb-2 material-icons md-10"
            :style="{ fontSize: '18px' }"
          >
            delete
          </button>
        </div>
        <li
          class="mb-4 mt-[-6px] relative text-gray-500 list-none flex justify-space-between w-full"
        >
          {{ note?.text }}
        </li>
      </div>
    </ul>
    <p class="text-center" v-else>No Notes!</p>
  </div>
</template>
