<script setup>
import { reactive } from 'vue'
import api from '@/lib/axiosClient'
import toast from '@/lib/toast'

const props = defineProps({
  onSuccess: {
    type: Function,
    required: true,
  },
})

const state = reactive({
  bulk_csv: null,
})

const onChangeBulkCSV = async (csv_file) => {
  state.bulk_csv = csv_file
}

const upload_csv = async () => {
  if (!state.bulk_csv) return
  try {
    const formData = new FormData()
    formData.append('csv', state.bulk_csv)
    const { message, total_cnt } = await api.post(
      'customers/add_bulk_user',
      formData
    )
    toast.info(message)
    props.onSuccess(total_cnt)
  } catch (err) {
    toast.error(err.message)
  }
}
</script>

<template>
  <form @submit.stop.prevent="upload_csv">
    <div class="relative">
      <input
        v-on:change="(event) => onChangeBulkCSV(event.target.files[0])"
        class="absolute opacity-0 w-[120px] h-[40px] my-3 cursor-pointer"
        type="file"
        id="bulk-user-csv-file"
        accept=".csv"
      />
      <button
        class="bg-psci hover:bg-gold text-white hover:text-black w-[240px] h-[40px] rounded focus:outline-none focus:shadow-outline my-3"
        type="button"
        id="add-user"
        @click="openAddUserModal"
      >
        Add users via CSV upload
      </button>
    </div>
    <button
      v-if="state.bulk_csv"
      class="bg-psci hover:bg-gold text-white hover:text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline my-3"
    >
      Upload
    </button>
  </form>
</template>
