<script setup>
import { reactive, ref, watch } from 'vue'
import api from '../../lib/axiosClient'
import Button from 'primevue/button'
import toast from '@/lib/toast'
import Menu from 'primevue/menu'
import Avatar from 'primevue/avatar'

const props = defineProps({ notifications: Array })

const state = reactive({
  notifications: [],
  notification: null,
  showRead: false,
})

const menuRef = ref(null)

const items = ref([])
const readItems = ref([])

watch(
  () => props.notifications,
  (newVal) => {
    let temp = newVal.map((notif) => {
      return {
        label: notif.message,
        message: notif.message,
        pid: notif.pid,
        read: notif.read,
        icon: notif.read ? 'pi pi-trash' : 'pi pi-times',
        command: () => {
          if (notif.read) delete_notification(notif.pid)
          else mark_as_read(notif)
        },
      }
    })

    items.value = temp.filter((obj) => obj.read === false)
    readItems.value = temp.filter((obj) => obj.read === true)

    if (items.value.length === 0) state.showRead = true
  }
)
const delete_notification = async (pid, isAll) => {
  await api.delete('user_notifications/' + pid, {})
  readItems.value = readItems.value.filter((obj) => obj.pid !== pid)
  toast.success(
    isAll ? 'All read notifications deleted' : 'Notification deleted'
  )

  if (readItems.value.length === 0) {
    state.showRead = false
    menuRef.value.hide()
  } else state.showRead = true
}

const mark_as_read = async (notification) => {
  try {
    await api.post(
      'user_notifications/' + notification.pid + '/mark_as_read/',
      {}
    )
    items.value = items.value.filter((obj) => obj.pid !== notification.pid)

    readItems.value.push({
      label: notification.message,
      pid: notification.pid,
      read: true,
      icon: 'pi pi-trash',
      command: () => delete_notification(notification.pid),
    })

    if (items.value.length === 0) state.showRead = true
  } catch (err) {
    console.log(err)
  }
}

const toggle = (e) =>
  items.value.length > 0 || readItems.value.length > 0
    ? menuRef.value.toggle(e)
    : null

const toggleRead = () => (state.showRead = !state.showRead)
const showRead = () => (state.showRead = true)
const showUnread = () => (state.showRead = false)
const deleteAll = (e) => {
  readItems.value.forEach((obj) => delete_notification(obj.pid, true, e))
  readItems.value = []

  menuRef.value.hide(e)
  if (items.value.length > 0) state.showRead = false
}
const readAll = () => {
  items.value.forEach((obj) => mark_as_read(obj))
  items.value = []

  state.showRead = true
}
const showShowReadBtn = () => {
  if (state.showRead && items.value.length > 0) return true
  else if (!state.showRead && readItems.value.length > 0) return true
  else return false
}
</script>
<style>
.user-notifications .p-menu {
  min-width: 450px !important;
}

.user-notifications .p-menuitem-link {
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse !important;
  align-items: flex-start;
  padding-right: 5px !important;
}

.user-notifications .p-menuitem-text {
  font-size: 14px !important;
  padding-right: 15px;
}
</style>
<template>
  <div class="user-notifications cursor-pointer">
    <Avatar v-badge.danger="items.length" :class="`${items.length > 0 && 'bg-purple'} !mr-12 cursor-pointer`"
      icon="pi pi-bell" size="small" v-if="items.length > 0" @click="toggle" />
    <Avatar :class="`${readItems.length > 0 && 'bg-purple'} !mr-3 cursor-pointer`" icon="pi pi-bell" size="small"
      @click="toggle" v-else />
    <Menu ref="menuRef" class="user-notifications" :model="state.showRead ? readItems : items" :popup="true" :style="{
      border: 'none',
      paddingTop: 0,
      paddingBottom: 0,
      minWidth: '300px',
      maxHeight: '300px',
      overflow: 'auto',
    }">
      <template #end>
        <div class="flex font-bold">
          <button class="w-1/2 text-xs bg-purple text-white" :style="{ borderRadius: '0 0 0 5px' }" @click="toggleRead"
            v-if="showShowReadBtn()">
            {{ state.showRead ? 'Show Unread' : 'Show Read' }}
          </button>
          <button :class="`bg-red-600 ${showShowReadBtn() ? 'w-1/2' : 'w-full'
            }  h-[25px] text-white text-xs`" :style="{ borderRadius: '0 0 5px 0' }"
            @click="!state.showRead ? readAll() : deleteAll($event)">
            {{ state.showRead ? 'CLEAR ALL' : 'MARK AS READ' }}
          </button>
        </div>
      </template>
    </Menu>
  </div>
</template>
