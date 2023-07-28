<script setup>
import { defineProps, reactive, onMounted } from 'vue'
import handleSearch from '../../lib/handleSearch'
import TableLite from 'vue3-table-lite'

const props = defineProps({
  project: Object,
  resources: Object,
  type: String,
  resource_pid: String,
  setResource: Function,
})
const state = reactive({ resources: Object })

const refresh = () => {
  switch (props.type) {
    case 'attached':
      state.resources = props.resources.attached
      break
    default:
      state.resources = props.resources
      break
  }
}
onMounted(() => {
  refresh()
})

const table = {
  columns: [
    {
      label: 'Name',
      field: 'name',
      width: '3%',
      sortable: false,
      headerClasses: ['!bg-black'],
      columnClasses: ['!max-w-[100px]', '!overflow-hidden', '!text-ellipsis'],
    },

    {
      label: 'Objective',
      field: 'objective',
      width: '3%',
      sortable: false,
      headerClasses: ['!bg-black'],
    },
    {
      label: 'Source Url',
      field: 'source_url',
      width: '3%',
      sortable: false,
      headerClasses: ['!bg-black'],
    },
  ],
  rows: [],
  sortable: {
    order: 'id',
    sort: 'asc',
  },
}
</script>

<template lang="">
  <TableLite
    :is-slot-mode="true"
    :is-hide-paging="true"
    :columns="table.columns"
    :rows="state.resources"
    :total="table.totalRecordCount"
    :sortable="table.sortable"
    @do-search="(o, l, type, sort) => handleSearch(state.resources, type, sort)"
  >
    <template v-slot:name="data">
      <td class="px-2">
        <RouterLink
          :to="'/resources/' + data.value.pid"
          class="hover:cursor-pointer underline text-ellipsis overflow-hidden"
        >
          {{ data.value.name }}
        </RouterLink>
      </td>
    </template>
    <template v-slot:source_url="data">
      <td class="px-2 flex items-center justify-between">
        <a :href="data.value.source_url">
          {{ data.value.source_url }}
        </a>
        <div class="flex justify-end">
          <button
            v-if="props.type === 'attached'"
            @click="setResource(data.value.pid)"
            data-bs-toggle="modal"
            data-bs-target="#confirmResourceDetach"
            class="bg-psci hover:bg-gold text-white hover:text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Detach
          </button>
        </div>
      </td>
    </template>
  </TableLite>
</template>
