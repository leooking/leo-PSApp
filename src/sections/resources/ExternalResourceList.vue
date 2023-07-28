<script setup>
import 'tw-elements'
import { defineProps, reactive, onMounted, inject } from 'vue'
import api from '../../lib/axiosClient'
import Radio from '../../components/Radio.vue'
import handleSearch from '../../lib/handleSearch'
import TableLite from 'vue3-table-lite'

const props = defineProps({
  project: Object,
  resources: Object,
  selectable: Boolean,
  noControls: Boolean,
  tagLimit: Number,
})
const state = reactive({
  resources: Object,
  resource_pid: null,
  resource: null,
})
const parentProps = inject('props')
const emit = inject('emit')

onMounted(() => {
  console.log(parentProps, '+++++++')
  state.resources = props.resources
})

const refresh = async () => {
  const res = await api.get('resources')
  state.resources = res.shared_resources
}

const truncate = (str) => (str?.length > 24 ? str.slice(0, 24) + '...' : str)

const table = {
  columns: [
    {
      label: '',
      field: 'selector',
      width: '1%',
      sortable: false,
      headerClasses: ['!bg-black'],
      columnClasses: ['!max-w-[100px]', '!overflow-hidden', '!text-ellipsis'],
    },
    {
      label: 'Name',
      field: 'display_name',
      width: '98%',
      sortable: false,
      headerClasses: ['!bg-black'],
      columnClasses: ['!max-w-[100px]', '!overflow-hidden', '!text-ellipsis'],
    },
  ],
  rows: [],
  sortable: {
    order: 'id',
    sort: 'asc',
  },
}
</script>

<template>
  <TableLite
    :is-slot-mode="true"
    :is-hide-paging="true"
    :columns="table.columns"
    :rows="state.resources"
    :total="table.totalRecordCount"
    :sortable="table.sortable"
    @do-search="(o, l, type, sort) => handleSearch(state.resources, type, sort)"
    class="pb-4"
  >
    <template v-slot:selector="data">
      <td class="px-2" rowspan="2" v-if="props.selectable">
        <div class="mb-[0.125rem] block min-h-[1.5rem] pl-[.5rem]">
          <Radio
            :checked="
              parentProps.parentState.checked[0] === data.value.payload_value
            "
            :toggle="() => emit('setCurrent', data.value.payload_value)"
          />
        </div>
      </td>
    </template>
    <template v-slot:name="data">
      <td class="px-2">
        <p class="text-ellipsis overflow-hidden">
          {{ data.value.display_name }}
        </p>
      </td>
    </template>
  </TableLite>
</template>
