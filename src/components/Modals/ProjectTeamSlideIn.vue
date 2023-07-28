<script setup>
import { ref, reactive, defineProps, onMounted } from 'vue'
import api from '../../lib/axiosClient'
import toast from '../../lib/toast'
import DeletionModal from './DeletionModal.vue'
import { useModal } from 'vue-final-modal'
import Modal from './Modal.vue'
import AddTeamMemberModal from './AddTeamMemberModal.vue'

const newUser = ref('')
const state = reactive({ userPid: null, availableUsers: [] })
const props = defineProps({ project: Object })

const fetchAvailableUsers = async () => {
  try {
    const res = await api.get(`projects/${props.project.pid}/available_users`)
    state.availableUsers = res.available_users
  } catch (err) {
    toast.error(err)
  }
}

const addUser = async (user) => {
  if (user.pid) {
    try {
      const res = await api.post(
        `projects/${props.project.pid}/add_team_member`,
        { user_pid: user.pid }
      )
      props.project.team.push({ ...user, user_pid: user.pid })
      newUser.value = ''
      toast.success('User added')
      await fetchAvailableUsers()
    } catch (err) {
      toast.error(err)
    }
  }
}

const deleteUser = async () => {
  try {
    const res = await api.post(
      `projects/${props.project.pid}/remove_team_member`,
      { user_pid: state.userPid }
    )
    props.project.team = props.project.team.filter(
      (user) => user.user_pid !== state.userPid
    )
    toast.success('User deleted')
    close()
    await fetchAvailableUsers()
  } catch (err) {
    toast.error(err)
  }
}

onMounted(async () => {
  await fetchAvailableUsers()
  console.log(state.availableUsers)
})

const { open, close } = useModal({
  component: Modal,
  attrs: {
    name: 'User',
    onConfirm() {
      deleteUser()
    },
    onClose() {
      close()
      state.userPid = null
    },
  },
  slots: {
    default: DeletionModal,
  },
})

const { open: openAddUser, close: closeAddUser } = useModal({
  component: Modal,
  attrs: {
    parentState: state,
    confirm: (e, user) => addUser(e, user),
    onClose() {
      closeAddUser()
    },
    onConfirm(user) {
      addUser(user)
      closeAddUser()
    },
  },
  slots: {
    default: AddTeamMemberModal,
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
    class="w-80 h-auto shadow-md bg-white absolute top-0 right-0 mt-[50px] mr-[-15px] p-4 animate"
  >
    <div class="flex font-bold justify-between pr-4 mb-2">
      <h5>Team ({{ props.project.team.length }})</h5>
      <button
        @click="openAddUser"
        class="text-gray-500 mb-2 material-icons text-[30px]"
        v-if="state.availableUsers"
      >
        add
      </button>
    </div>
    <ul
      class="w-full ml-0 pr-4 max-h-[300px] overflow-auto"
      v-if="props.project.team.length > 0"
    >
      <div class="flex items-start" v-for="member in props.project.team">
        <li
          class="relative text-sm list-none flex justify-space-between w-full"
        >
          <span class="text-gray-400 text-xs material-icons md-20">email</span>
          &nbsp;
          <a class="underline" :href="'mailto:' + member.email"
            >{{ member.fname }} {{ member.lname }}</a
          >
        </li>
        <button
          @click="
            () => {
              state.userPid = member.user_pid
              open()
            }
          "
          class="text-gray-400 mb-2 material-icons md-20"
        >
          delete
        </button>
      </div>
    </ul>
    <p class="text-center text-lg" v-else>No Team Members Found</p>
  </div>
</template>
