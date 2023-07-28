<script setup>
import { reactive, onMounted, ref, inject } from 'vue'
import 'tw-elements'
import ExternalResourceList from '../../sections/resources/ExternalResourceList.vue'
import toast from '../../lib/toast'

import fetchFolders from '../../lib/fetchFolders'

const emit = inject('emit')

const state = reactive({
  resources: [],
  loading: true,
  resource_pid: null,
  available_tags: {
    source_tags: [],
    type_tags: [],
  },
})

const rerender = ref(0)

onMounted(async () => {
  try {
    const { shared_resources } = await fetchFolders('resources', 'resources')
    state.resources = shared_resources
  } catch (err) {
    toast.error(err.message)
  } finally {
    state.loading = false
  }
})

const setResources = (resources) => (state.resources = resources)
const performRerender = () => (rerender.value = rerender.value + 1)
const setLoading = (isLoading) => (state.loading = isLoading)
</script>
<template>
  <div class="" v-if="!state.loading">
    <!-- <ResourceSearch
      :inModal="true"
      :setLoading="setLoading"
      :rerender="performRerender"
      :state="state"
      :setResources="setResources"
      :noTagSearch="true"
      searchPlaceholder="Search By Name"
    />
-->
    <div
      v-if="state.resources?.length > 0"
      :key="rerender"
      class="mt-4 max-h-[400px] overflow-auto"
    >
      <ExternalResourceList
        :resources="state.resources"
        :selectable="true"
        :noControls="true"
        :tagLimit="1"
        type="external"
      />
    </div>

    <div class="flex justify-end mt-4">
      <div class="flex">
        <button
          @click="emit('confirm')"
          class="bg-purple hover:bg-gold text-white hover:text-black py-2 px-12 rounded focus:outline-none focus:shadow-outline mr-4"
          type="submit"
        >
          Select
        </button>
        <button
          @click="emit('close')"
          class="bg-psci hover:bg-gold text-white hover:text-black py-3 px-12 rounded focus:outline-none focus:shadow-outline whitespace-nowrapSelect"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
  <div
    class="modal-body p-4 flex flex-col items-center justify-center min-h-[500px]"
    v-else
  >
    <div
      class="inline-block h-16 w-16 text-purple animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1s_linear_infinite]"
      role="status"
    >
      <span
        class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
        >Loading...</span
      >
    </div>
  </div>
</template>
