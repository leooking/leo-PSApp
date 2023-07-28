<script setup>
import { onMounted, reactive } from 'vue'
import toast from '@/lib/toast'
import api from '@/lib/axiosClient'

const props = defineProps({
  registerReloader: {
    type: Function,
    required: true,
  },
  users: {
    default: [],
    type: Array,
  },
})

const state = reactive({
  users: props.users,
  loading: false,
})

const reloader = async () => {
  try {
    const { users } = await api.get('customers/dashboard')
    state.users = users
  } catch (err) {
    toast.error(err.message)
  } finally {
    state.loading = false
  }
}

const refresh = (userPid) => {
  console.log(userPid)
}

onMounted(() => {
  props.registerReloader(reloader)
  state.users = props.users
})
</script>

<template>
  <table
    v-if="!state.loading && state.users.length"
    class="shadow w-full border border-separate border-slate-600 table-fixed"
  >
    <thead>
      <tr class="text-left bg-slate-100">
        <th class="pl-2">Name</th>
        <th class="pl-2">Email</th>
        <th class="pl-2">Joined On</th>
        <th class="pl-2">Expires On</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="user in state.users"
        :key="user.pid"
        class="border even:bg-slate-100"
      >
        <td class="pl-2">{{ user.name }}</td>
        <td class="pl-2">{{ user.email }}</td>
        <td class="pl-2">{{ user.joined_on.toLocaleString() }}</td>
        <td class="pl-2 flex justify-between">
          {{ user.expire ? user.expire.toLocaleString() : 'N/A' }}
          <div v-if="!user.expire">
            <button
              class="text-gray-400 text-sm mb-2 material-icons md-20 mr-2"
              @click="
                () => {
                  refresh(user.pid)
                }
              "
            >
              refresh
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
