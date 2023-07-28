<script setup>
import 'tw-elements'
import { defineProps, onMounted, reactive, ref } from 'vue'
import ResourcesList from './ProjectResourcesList.vue'
import api from '../../lib/axiosClient'
import toast from '../../lib/toast'
import DetachConfirmation from '../Modals/DetachConfirmation.vue'

const props = defineProps({ project: Object })
const state = reactive({
  resources: { attached: [], available: [] },
  resource_pid: null,
})
const rerender = ref(0)

const fetchResources = async () => {
  try {
    const res = await api.get(`projects/${props.project.pid}/resources`)
    state.resources.attached = res.attached
    state.resources.available = res.available
  } catch (err) {
    toast.error(err)
  }
}

onMounted(() => {
  fetchResources()
})

const detachResource = async () => {
  try {
    await api.post(`projects/${props.project.pid}/detach_resource`, {
      resource_pid: state.resource_pid,
    })
    state.resources.attached = state.resources.attached.filter(
      (r) => r.pid !== state.resource_pid
    )
    state.resource_pid = null
    toast.success('Resource detached')
    document.querySelector('#closeDetachModal').click()
    fetchResources()
    rerender.value = rerender.value + 1
  } catch (err) {
    toast.error(err)
  }
}

const setResource = (pid) => (state.resource_pid = pid)
</script>
<template>
  <div>
    <RouterLink to="/resources/new">
      <button
        class="bg-psci hover:bg-gold text-white hover:text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        data-bs-toggle="modal"
        data-bs-target="#ResourceModalCreate"
      >
        New Resource
      </button>
    </RouterLink>

    <h3 class="mt-6">Attached Resources</h3>
    <p class="mb-3 italic text-sm text-gray-500">
      These Resources are attached to this Project
    </p>
    <div v-if="state.resources.attached.length > 0" :key="rerender">
      <ResourcesList
        :setResource="setResource"
        :project="props.project"
        :resources="state.resources"
        type="attached"
      />
    </div>
    <h5 class="text-center" v-else>No Resources in use on this project</h5>

    <DetachConfirmation name="Resource" :detachFunc="detachResource" />
  </div>
</template>
