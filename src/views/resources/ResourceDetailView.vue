<script setup>
import { useRoute } from 'vue-router'
import { onMounted, reactive } from 'vue'
import api from '../../lib/axiosClient'
import toast from '../../lib/toast'
import notesSlideIn from '../../components/Modals/NotesSlideIn.vue'

const state = reactive({resource: {}, loading: true, showNotes: false,})

const toggleNotes = () => (state.showNotes = !state.showNotes)

const route = useRoute()



onMounted(async () => {
  try {
    const resource = await api.get('resources/' + route.params.pid)
    state.resource = resource
  } catch (err) {
    toast.error(err.message)
  } finally {
    state.loading = false
  }
})

const getGoogleDocsViewerUrl = (fileUrl) => {
  return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
};

</script>


<template>
  <div class="relative overflow-hidden min-h-[80vh]">
    <div v-if="state.showNotes && state.resource.pid">
      <notesSlideIn :data="state.resource" type="resources" />
    </div>

    <div class="flex justify-between w-full mb-6">
      <RouterLink 
        to="/resources" 
        class="text-gray-500 flex gap-2 pt-4 whitespace-nowrap">
        
        <span class="material-icons text-sm">arrow_back</span>
        Back to Resources
      </RouterLink>
      <nav>
        <ul class="nav nav-tabs flex flex-col justify-end items-center md:flex-row flex-wrap list-none"
        >
          <li 
            class="nav-item text-gray-500 hover:underline mr-3 cursor-pointer" 
            role="presentation"
            @click="toggleNotes()"
            >
              Notes
          </li>
        </ul>
      </nav>
    </div>

    <div class="flex flex-col md:flex-row justify-between">
      <div class="flex flex-col">
        <h2 class="my-2">{{ state.resource.name }}</h2>
        <p class="mb-2">{{ state.resource.description }}</p>
        <p class="mb-2">{{ state.resource.objective }}</p>

        <ul class="ml-4">
          <li>
            <span class="font-bold">Last Modified: </span>
            {{ state.resource.created_at }}
          </li>
          <li>
            <span class="font-bold">State: </span> {{ state.resource.state }}
          </li>
          <li>
            <span class="font-bold">Uploaded data asset: </span>
            <a 
              class="hover:underline" 
              target="_blank" 
              :href="state.resource.file_link"
              >{{ state.resource.data_asset_name}}</a>
          </li>
          <li>
            <span class="font-bold">Parsed URL: </span>
            <a 
              class="hover:underline" 
              target="_blank" 
              :href="state.resource.source_url"
              >{{ state.resource.source_url}}</a>
          </li>
        </ul>
      </div>
      <div class="md:w-[50vw]" :style="{ zIndex: 1 }">
        <iframe :src="getGoogleDocsViewerUrl(state.resource.file_link)" frameborder="0" width="100%"
          height="1000"></iframe>
      </div>
    </div>
  </div>
</template>
