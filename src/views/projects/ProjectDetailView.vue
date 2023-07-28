<script setup>
import { useRoute, RouterLink } from 'vue-router'
import { onMounted, reactive } from 'vue'
import api from '../../lib/axiosClient'
import toast from '../../lib/toast'
import assetsBlock from '../../components/ProjectTabs/ProjectBlockAssets.vue'
import generatorsBlock from '../../components/ProjectTabs/ProjectBlockGenerators.vue'
import resourcesBlock from '../../components/ProjectTabs/ProjectBlockResources.vue'
import teamSlideIn from '../../components/Modals/ProjectTeamSlideIn.vue'
import notesSlideIn from '../../components/Modals/NotesSlideIn.vue'
import router from '../../router'

const state = reactive({
  project: {},
  loading: true,
  showNotes: false,
  showTeam: false,
})
const route = useRoute()

const toggleNotes = () => {
  state.showTeam = false
  state.showNotes = !state.showNotes
}
const toggleTeam = () => {
  state.showNotes = false
  state.showTeam = !state.showTeam
}

onMounted(async () => {
  try {
    const project = await api.get('projects/' + route.params.pid)
    if (!project.is_team_member) router.back()
    state.project = project
  } catch (err) {
    toast.error(err.message)
  } finally {
    state.loading = false
  }
})
</script>

<template>
  <div class="relative overflow-hidden min-h-[80vh]">
    <div v-if="state.showTeam && state.project.pid">
      <teamSlideIn :project="state.project" />
    </div>

    <div v-if="state.showNotes && state.project.pid">
      <notesSlideIn :data="state.project" type="projects" />
    </div>
    <div class="flex justify-between w-full mb-6">
      <RouterLink
        to="/projects"
        class="text-gray-500 flex gap-2 pt-2 whitespace-nowrap"
      >
        <span class="material-icons text-sm">arrow_back</span>
        Back to Projects
      </RouterLink>

      <nav>
        <ul
          class="nav nav-tabs pt-4 flex flex-col justify-end items-center md:flex-row flex-wrap list-none"
          id="tabs-tab"
          role="tablist"
        >
          <li class="nav-item" role="presentation">
            <a
              href="#tabs-assets"
              class="text-gray-500 hover:underline mr-3"
              id="tabs-assets-tab"
              data-bs-toggle="pill"
              data-bs-target="#tabs-assets"
              role="tab"
              aria-controls="tabs-assets"
              aria-selected="true"
              >Assets</a
            >
          </li>
          <li class="nav-item" role="presentation">
            <a
              href="#tabs-generators"
              class="text-gray-500 hover:underline mr-3"
              id="tabs-resources-tab"
              data-bs-toggle="pill"
              data-bs-target="#tabs-generators"
              role="tab"
              aria-controls="tabs-resources"
              aria-selected="false"
              >Generators</a
            >
          </li>
          <li class="nav-item" role="presentation">
            <a
              href="#tabs-resources"
              class="text-gray-500 hover:underline mr-3 cursor-pointer"
              id="tabs-resources-tab"
              data-bs-toggle="pill"
              data-bs-target="#tabs-resources"
              role="tab"
              aria-controls="tabs-profile"
              aria-selected="false"
              >Resources</a
            >
          </li>
          <li
            id="tabs-team-tab"
            class="nav-item text-gray-500 hover:underline mr-3 cursor-pointer"
            role="presentation"
            @click="toggleTeam()"
            v-if="state.project.scope === 'group'"
          >
            Team
          </li>
          <li
            id="tabs-notes-tab"
            class="nav-item text-gray-500 hover:underline mr-3 cursor-pointer"
            role="presentation"
            @click="toggleNotes()"
          >
            Notes
          </li>
          <li class="" role="presentation">
            <a
              class="nav-item text-gray-500 hover:underline mr-3 cursor-pointer"
              target="_blank"
              :href="`https://meet.jit.si/pscibis-project-${state.project.pid}`"
            >
              Meet
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <div>
      <h2 class="my-2">{{ state.project.name }}</h2>
      <p class="mb-2">{{ state.project.description }}</p>

      <div class="tab-content mt-12" id="tabs-tabContent">
        <div
          class="tab-pane fade show active"
          id="tabs-assets"
          role="tabpanel"
          aria-labelledby="tabs-assets-tab"
        >
          <div v-if="state?.project?.name">
            <assetsBlock :project="state.project" />
          </div>
        </div>
        <div
          class="tab-pane fade"
          id="tabs-generators"
          role="tabpanel"
          aria-labelledby="tabs-profile-tab"
        >
          <generatorsBlock :project="state.project" />
        </div>
        <div
          class="tab-pane fade"
          id="tabs-resources"
          role="tabpanel"
          aria-labelledby="tabs-resources-tab"
        >
          <div v-if="state?.project?.pid">
            <resourcesBlock :project="state.project" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
