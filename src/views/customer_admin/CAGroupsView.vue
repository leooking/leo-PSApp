<script setup>
import { onMounted, reactive } from 'vue'
import { useModal } from 'vue-final-modal'
import toast from '@/lib/toast'
import api from '@/lib/axiosClient'
import CASubNavbar from '@/sections/admin/CASubNavbar.vue'
import GroupsList from '@/sections/admin/GroupsList.vue'
import Modal from '@/components/Modals/Modal.vue'
import NewGroupModal from '@/components/Modals/NewGroupModal.vue'

const state = reactive({ groups: [], loading: true })

const onCreateNewGroup = async (groupName) => {}

onMounted(async () => {
  try {
    const { groups } = await api.get('customers/groups')
    state.groups = groups
  } catch (err) {
    toast.error(err.message)
  } finally {
    state.loading = false
  }
})

const { open, close } = useModal({
  component: Modal,
  attrs: {
    confirm: onCreateNewGroup,
    close() {
      close()
    },
  },
  slots: {
    default: NewGroupModal,
  },
})
</script>

<template>
  <div class="flex justify-between w-full">
    <h2 class="my-2">OrgNameGroups</h2>
    <CASubNavbar />
  </div>

  <div class="my-4">
    <button
      class="bg-psci hover:bg-gold text-white hover:text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      type="button"
      id="create-group"
      @click="open"
    >
      New Group
    </button>
  </div>

  <div v-if="!state.loading">
    <h3 class="my-2">Groups</h3>
    <GroupsList :groups="state.groups" />
  </div>
</template>

<style scoped></style>
