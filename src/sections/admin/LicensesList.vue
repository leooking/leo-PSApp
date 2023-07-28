<script setup>
import { reactive } from 'vue'

const props = defineProps({ licenses: Array })

const state = reactive({
  licenses: props.licenses,
})
</script>

<template>
  <table
    class="shadow w-full border border-separate border-slate-600 table-fixed"
  >
    <thead>
      <tr class="text-left bg-slate-100">
        <th>Acquired On</th>
        <th>Quantity Acquired</th>
        <th>Allocated Quantity</th>
        <th>Allocations Available</th>
        <th>Expire On</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="license in state.licenses"
        :key="license.pid"
        class="border even:bg-slate-100"
        id="project-list-item"
      >
        <td>{{ license.name }}</td>
        <td>{{ license.quantity }}</td>
        <td>{{ license.allocated }}</td>
        <td>{{ license.available }}</td>
        <td>{{ license.expire.toLocaleString() }}</td>
      </tr>
    </tbody>
  </table>
</template>
