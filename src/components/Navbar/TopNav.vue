<script setup>
import { ref, onMounted, watch, reactive, toRef } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import user, { userEvent } from '../../lib/user'
import { getItem } from '../../lib/storage'
import { auth0Logout } from '../../lib/authService'
import Notification from '../Notification.vue'
import Modal from '../Modals/Modal.vue'
import { useModal } from 'vue-final-modal'
import Sidebar from './Sidebar.vue'
import UserNotifications from './UserNotifications.vue'
import api from '../../lib/axiosClient'
import {assetNameEvent} from "@/lib/assetNameEvent";
import UserSettings from './UserSettings.vue'

const props = defineProps({
  headerRef: Object,
})

const state = reactive({
  isOpen: false,
  viewUserNotifications: false,
  search: '',
  generators: [],
  projects: [],
  notifications: [],
})

const headerRef = toRef(props, 'headerRef')
const notification = ref(null)
let signedIn = ref(user.signedIn)
const assetName = ref(null)

userEvent.on('signIn', () => (signedIn.value = true))
userEvent.on('signOut', () => (signedIn.value = false))

assetNameEvent.on('assetName', (newAssetName) => {
  assetName.value = newAssetName
})

assetNameEvent.on('removeAssetName', () => (assetName.value = null))

const router = useRouter()

router.beforeEach(() => {
  state.isOpen = false
})

async function logout () {
  if (getItem('auth0Idtok')) {
    await auth0Logout()
  }
  await user.signOut()
  if (window.location.pathname === '/') router.go()
}

const { open: openNotification, close: closeNotification } = useModal({
  component: Modal,
  attrs: {
    parentState: notification,
    onClose() {
      closeNotification()
    },
  },
  slots: {
    default: Notification,
  },
})

const handleNotification = () => {
  const currentUser = getItem('currentUser')
  if (currentUser?.notification) {
    notification.value = currentUser.notification
    notification.value?.modal && openNotification()
  }
}
watch(signedIn, (oldVal, newVal) => {
  if (signedIn.value) handleNotification()
})

onMounted(async () => {
  if (signedIn.value) {
    handleNotification()
    state.notifications = await api.get('user_notifications')
  }

  window.addEventListener('scroll', () => {
    state.isOpen = false
  })
})
</script>
<style>
.p-tooltip {
  font-size: 15px !important;
}
</style>
<template class="relative h-screen bg-white">
  <header
    :ref="headerRef"
    class="flex flex-col w-full !w-full mt-[-20px] mb-[-20px] px-0 h-min-content bg-transparent"
    :style="{ zIndex: 1000 }"
  >
    <Notification
      v-if="notification?.top_bar && signedIn"
      :notification="notification"
      :isTopBar="true"
    />
    <div
      class="relative w-full flex items-center px-4 flex-row bg-white text-black border-b-2 border-gray-400 h-[66px]"
    >
      <RouterLink to="/">
        <img
          class="mt-[6px] !ml-20"
          alt="SA logomark"
          src="@/assets/mark2_blk_120x.png"
          width="90"
        />
      </RouterLink>
      <Sidebar :isOpen="state.isOpen" :isLocked="state.isOpen" v-if="signedIn" />

      <h3 class="w-full flex justify-end" v-if="assetName">Asset Name: {{ assetName }}</h3>

      <nav class="w-full flex justify-end items-center" v-if="signedIn">
        <!-- v-on:keydown="(e) => e.key === 'Enter' && getResources()"-->
        <!-- <div class="flex items-center mr-4">
        <input
          v-model="state.search"
          class="shadow appearance-none border border-gray-300 rounded-md pl-2 h-[32px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          scope="text"
        />
        <button
          class="text-gray-400 material-icons md-40 ml-[-30px] md:mr-[20px]"
        >
          search
        </button>
      </div>-->
        <!-- <Button
          icon="pi pi-bell"
          v-tooltip.bottom="'Notifications'"
          text
          severity="secondary"
          v-if="signedIn"
          size="large"
          class="!mr-4"
          :style="{ maxHeight: '35px' }"
          @click="
            () => (state.viewUserNotifications = !state.viewUserNotifications)
          "
        /> -->
        <UserNotifications
          :notifications="state.notifications"
          v-if="user.signedIn"
        />
        <UserSettings v-if="user.signedIn"/>
        <!-- <RouterLink
          class="text-gray-400 hover:text-gray-500 underline"
          @click.native="logout"
          id="logout"
          to="/"
          >Sign Out</RouterLink
        > -->
      </nav>
      <nav v-if="!signedIn">
        <!-- <a class="text-gray-400 hover:text-gray-500 underline" href="https://startupalliance.com/memberships">Apply</a>
      | -->
        <RouterLink
          class="text-gray-400 hover:text-gray-500 underline"
          to="/session/email"
          >Sign-in</RouterLink
        >
      </nav>
    </div>
  </header>
</template>
