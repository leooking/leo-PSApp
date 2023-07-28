<script setup>
import { onMounted, reactive } from 'vue'
import { useModal } from 'vue-final-modal'
import toast from '@/lib/toast'
import api from '@/lib/axiosClient'
import CASubNavbar from '@/sections/admin/CASubNavbar.vue'
import CALicensesSummary from '@/sections/admin/CALicensesSummary.vue'
import CAUsersList from '@/sections/admin/CAUsersList.vue'
import CABulkUser from '@/sections/admin/CABulkUser.vue'
import Modal from '@/components/Modals/Modal.vue'
import AddUserModal from '@/components/Modals/AddUserModal.vue'
import user from '../../lib/user'

const state = reactive({
  summary: {
    resources: 0,
    projects: 0,
    assets: 0,
  },
  licenses: {},
  users: [],
  users_reloader: null,
  loading: true,
})

const { open: openAddUserModal, close } = useModal({
  component: Modal,
  attrs: {
    onClose: () => {
      close && typeof close === 'function' && close()
    },
    onSuccess: () => {
      reload_user(1)
      close()
    },
  },
  slots: {
    default: AddUserModal,
  },
})

const reload_user = async (total_cnt) => {
  state.users_reloader(total_cnt)
}

const register_reloader = async (reloader) => {
  state.users_reloader = reloader
}

onMounted(async () => {
  try {
    const {
      summary: dashboard_summary,
      license: licenses_summary,
      users: users,
    } = await api.get('customers/dashboard')
    state.summary = dashboard_summary
    state.licenses = licenses_summary.summary
    state.users = users
  } catch (err) {
    toast.error(err.message)
  } finally {
    state.loading = false
  }
})
</script>

<template>
  <div class="flex justify-between w-full">
    <h2 class="my-2">
      {{ user.profile.org.org_name }}&nbsp;PSciBIS&nbsp;Admin
    </h2>
    <CASubNavbar />
  </div>
  <div v-if="!state.loading" class="my-3 text-lg">
    <ul>
      <li>
        Resources: <span class="font-bold">{{ state.summary.resources }}</span>
      </li>
      <li>
        Projects: <span class="font-bold">{{ state.summary.projects }}</span>
      </li>
      <li>
        Assets: <span class="font-bold">{{ state.summary.assets }}</span>
      </li>
    </ul>
  </div>
  <div class="my-6">
    <CALicensesSummary buy_able />
  </div>
  <div class="my-6">
    <h3 class="my-3">Users</h3>
    <div v-if="!state.loading">
      <CAUsersList
        :register-reloader="register_reloader"
        :users="state.users"
      />
      <div class="flex w-full justify-end items-center">
        <CABulkUser :onSuccess="reload_user" />
        <button
          class="ml-4 bg-psci hover:bg-gold text-white hover:text-black py-2 px-6 rounded focus:outline-none focus:shadow-outline my-3"
          type="button"
          id="add-user"
          @click="openAddUserModal"
        >
          Add a user
        </button>
      </div>
    </div>
  </div>
</template>
