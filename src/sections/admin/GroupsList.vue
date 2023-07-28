<script setup>
import { reactive } from 'vue'

const props = defineProps({ groups: Array })

const state = reactive({
  groups: props.groups,
})
</script>

<template>
  <table
    class="shadow w-full border border-separate border-slate-600 table-fixed"
  >
    <thead>
      <tr class="text-left bg-slate-100">
        <th class="pl-2">Name</th>
        <th class="pl-2">Description</th>
        <th class="pl-2">Created At</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="group in state.groups"
        :key="group.pid"
        class="border even:bg-slate-100"
        id="project-list-item"
      >
        <td class="px-2">{{ group.name }}</td>
        <td class="px-2">{{ group.description }}</td>
        <td class="px-2 w-full flex justify-between">
          {{ group.created_at?.toLocaleString() }}
          <div class="flex items-center">
            <button class="text-gray-400 mb-2 material-icons md-20 mr-2">
              edit
            </button>
            <button class="text-gray-400 mb-2 material-icons md-20 mr-2">
              delete
            </button>
          </div>
        </td>
        <td class="px-2 flex justify-end"></td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped></style>
