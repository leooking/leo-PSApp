<script setup>
import { reactive, onMounted, ref, inject } from 'vue'
import 'tw-elements'
import ResourceSearch from '../../sections/resources/ResourceSearch.vue'
import ResourceList from '../../sections/resources/ResourceList.vue'
import toast from '../../lib/toast'
import fetchFolders, { formatData } from '../../lib/fetchFolders'
import ProgressSpinner from 'primevue/progressspinner'

const emit = inject('emit')
const props = inject('props')

const state = reactive({
  resources: [],
  folders: [],
  loading: true,
  available_tags: [],
})

const rerender = ref(0)
const refresh = async () => {
  try {
    console.log(props.parentState.asset.generator_type, '++__+')
    if (props.parentState.asset.generator_type === 'ask_shipley') {
      state.folders = [
        {
          key: 'shipley_capture_guide',
          data: {
            pid: 'shipley_capture_guide',
            name: 'Shipley Capture Guide',
          },
          children: [],
        },
        {
          key: 'shipley_proposal_guide',
          data: {
            pid: 'shipley_proposal_guide',
            name: 'Shipley Proposal Guide',
          },
          children: [],
        },
      ]
    } else if (props.parentState.asset.generator_type === 'ask_lohfeld') {
      state.folders = [
        {
          key: 'ten_steps',
          data: {
            pid: 'ten_steps',
            name: 'Lohfeld 10 Steps to High Scoring Proposals',
          },
          children: [],
        },
        {
          key: 'insights_4',
          data: {
            pid: 'insights_4',
            name: 'Lohfeld Insights 4',
          },
          children: [],
        },
      ]
    } else if (props.type === 'select') {
      const { resources, folders, available_tags } = await fetchFolders(
        'resources?pdf_only=true',
        'resources'
      )

      state.resources = resources
      state.folders = folders
      state.available_tags = available_tags
      console.log(state.resources, state.folders, state.available_tags)
    } else {
      const { resources, folders, available_tags } = await fetchFolders(
        'resources',
        'resources'
      )
      state.resources = resources
      state.folders = folders
      state.available_tags = available_tags
    }
  } catch (err) {
    toast.error(err.message)
  } finally {
    state.loading = false
  }
}
onMounted(async () => {
  refresh()
})

const setResources = (resources) => (state.folders = formatData(resources).data)
const performRerender = () => (rerender.value = rerender.value + 1)
const setLoading = (isLoading) => (state.loading = isLoading)
</script>
<template>
  <div class="" v-if="!state.loading">
    <ResourceSearch
      :inModal="true"
      :setLoading="setLoading"
      :rerender="performRerender"
      :state="state"
      :setResources="setResources"
      :resources="state.folders"
      v-if="props.purpose !== 'ask_shipley'"
    />

    <div :key="rerender" class="object-table mt-4 max-h-[400px] overflow-auto">
      <ResourceList
        :resources="state.resources"
        :folders="state.folders"
        :selectable="true"
        :noControls="true"
        :tagLimit="1"
        :refresh="refresh"
        :purpose="props.purpose"
      />
    </div>

    <div class="flex justify-between mt-4">
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
      <button
        @click="emit('changeModal')"
        class="bg-psci hover:bg-gold text-white hover:text-black py-3 px-12 rounded focus:outline-none focus:shadow-outline whitespace-nowrapSelect"
        v-if="props.type !== 'select'"
      >
        Upload New
      </button>
    </div>
  </div>
  <div
    class="modal-body p-4 flex flex-col items-center justify-center min-h-[500px]"
    v-else
  >
    <ProgressSpinner />
  </div>
</template>
