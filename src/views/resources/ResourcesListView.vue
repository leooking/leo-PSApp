<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import ResourceList from '../../sections/resources/ResourceList.vue'
import ResourceSearch from '../../sections/resources/ResourceSearch.vue'
import fetchFolders, { formatData } from '../../lib/fetchFolders'
import ProgressSpinner from 'primevue/progressspinner'
import capitalize from '../../lib/capitalize'
import { useRoute } from 'vue-router'
import NewFolderBtn from '../../components/NewFolderBtn.vue'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

const state = reactive({
  resources: [],
  folders: [],
  shared_folders: [],
  private_folders: [],
  loading: false,
  available_tags: [],
  sortMethod: (a, b) => {
    const dateA = new Date(a.data.updated_at);
    const dateB = new Date(b.data.updated_at);
    return dateA - dateB;
  },
})

const rerender = ref(0)
const route = useRoute()

const refresh = async () => {
  const { privateFolders, sharedFolders, folders, resources, available_tags } =
    await fetchFolders('resources', 'resources', '')
  state.resources = resources
  state.folders = folders.sort(state.sortMethod)
  state.available_tags = available_tags
  state.shared_folders = sharedFolders.sort(state.sortMethod)
  state.private_folders = privateFolders.sort(state.sortMethod)
}

onMounted(async () => {
  state.loading = true
  await refresh()
  state.loading = false
})

const setResources = (resources) => (state.folders = formatData(resources).data)
const performRerender = async () => {
  await refresh()
  rerender.value = rerender.value + 1
}
const setLoading = (isLoading) => (state.loading = isLoading)
</script>
<template>
  <h2 class="my-2">Resources</h2>
  <div class="flex justify-between items-center my-4 flex-col md:flex-row">
    <NewFolderBtn type="resource" :updateList="performRerender" />

    <router-link to="resources/new">
      <button
        class="bg-psci hover:bg-gold text-white hover:text-black py-3 px-4 rounded focus:outline-none focus:shadow-outline whitespace-nowrap"
      >
        New Resource
      </button>
    </router-link>

    <ResourceSearch
      :setLoading="setLoading"
      :rerender="performRerender"
      :state="state"
      :setResources="setResources"
      :resources="state.resources"
    />
  </div>
  <div class="object-page w-full object-table" v-if="!state.loading">
    <TabView>
      <TabPanel header="All">
        <div class="w-full" :key="rerender">
          <ResourceList
            :resources="state.resources"
            :folders="state.folders"
            :refresh="refresh"
            scope=""
          />
        </div>
      </TabPanel>
      <TabPanel header="Private">
        <div class="w-full" :key="rerender">
          <ResourceList
            :resources="state.resources"
            :folders="state.private_folders"
            :refresh="refresh"
            scope=""
          />
        </div>
      </TabPanel>
      <TabPanel header="Shared">
        <div class="w-full" :key="rerender">
          <ResourceList
            :resources="state.resources"
            :folders="state.shared_folders"
            :refresh="refresh"
            scope=""
          />
        </div>
      </TabPanel>
    </TabView>
  </div>
  <div class="w-full min-h-[50vh] flex justify-center items-center" v-else>
    <ProgressSpinner />
  </div>
</template>
