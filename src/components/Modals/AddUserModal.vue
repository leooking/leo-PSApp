<script setup>
import { inject, onMounted, reactive, ref } from 'vue'
import Multiselect from '@vueform/multiselect'
import toast from '@/lib/toast'
import api from '@/lib/axiosClient'

const state = reactive({
  options: ref(['default']),
  fname: ref(''),
  lname: ref(''),
  email: ref(''),
  group: 'default',
  groups: [],
  loading: true,
})

const emit = inject('emit')

const onAddUser = async () => {
  const group_id = state.groups.find((group) => group.name === state.group)[
    'pid'
  ]
  const userData = {
    fname: state.fname,
    lname: state.lname,
    email: state.email,
    group: group_id,
  }
  try {
    const { message } = await api.post('customers/add_user', userData)
    toast.info(message)
    emit('success')
  } catch (err) {
    toast.error(err.message)
  }
}

const onCancel = () => {
  emit('close')
}

const updateGroup = (val) => {
  state.group = val
}

onMounted(async () => {
  try {
    const { groups } = await api.get('customers/groups')
    state.groups = groups
    state.options = ref(groups.map((group) => group.name))
  } catch (err) {
    toast.error(err.message)
  } finally {
    state.loading = false
  }
})
</script>

<template>
  <h2 class="my-2">Add User</h2>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <label class="mb-2 inline-block" for="first-name"> First Name </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        v-model="state.fname"
        id="first-name"
      />
    </div>
    <div>
      <label class="mb-2 inline-block" for="last-name"> Last Name </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        v-model="state.lname"
        id="last-name"
        type="email"
      />
    </div>
    <div>
      <label class="mb-2 inline-block" for="email"> Email </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        v-model="state.email"
        id="email"
        type="email"
      />
    </div>
    <div>
      <label class="mb-2 inline-block" for="group"> Group </label>
      <Multiselect
        :value="state.group"
        @input="updateGroup"
        required
        placeholder=""
        :options="state.options"
        classes="!text-sm !min-h-[45px] mt-2 md:mt-0 max-w-[150px] shadow-md !rounded-none cursor-pointer !border-[#26c08e]"
        open-direction="top"
      />
    </div>
    <div v-if="!state.loading">
      <button
        class="bg-psci hover:bg-gold text-white hover:text-black py-2 px-12 rounded focus:outline-none focus:shadow-outline mr-4"
        @click="onAddUser"
      >
        Add User
      </button>
      <button
        class="bg-slate-200 hover:bg-gold text-dark hover:text-black font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
        @click="onCancel"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
