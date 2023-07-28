<script setup>
import { ref, onMounted, reactive } from 'vue'
import user from '../lib/user'
import { RouterLink } from 'vue-router'
import AssetConvoInteractionView from './generators/AssetConvoInteractionView.vue'
import api from '../lib/axiosClient'
import ProjectGeneratorCard from '../components/ProjectGeneratorCard.vue'
import ProjectsList from '../components/ProjectsList.vue'
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import * as marked from 'marked'
import fetchFolders from '../lib/fetchFolders'
import NewFolderBtn from '../components/NewFolderBtn.vue'
import RecentAssets from '@/sections/assets/RecentAssets.vue'

let signedIn = ref(user.signedIn)
const rerender = ref(0)

const state = reactive({
  generators: [],
  message: '',
  projects: [],
  folders: [],
  projectsList: [],
  loading: true,
  generator: null,
})

const refresh = async () => {
  state.loading = true
  const { folders, projects } = await fetchFolders('projects', 'projects')
  state.projects = projects
  state.folders = folders
  state.loading = false
}

onMounted(async () => {
  if (signedIn.value) {
    try {
      if (signedIn) await refresh()

      const res = await api.get('dashboard')
      state.generators = res.private_generators
        ? [...res.private_generators, ...res.generators]
        : res.generators
      state.message = res.dashboard_message || ''
      res.projects.forEach((project) =>
        state.projectsList.push({
          ...project,
          value: project.pid,
          label: project.name,
        })
      )
    } catch (error) {
      console.log(error)
    } finally {
      state.loading = false
    }
  }
})

const breakpoints = {
  0: {
    itemsToShow: 1,
  },
  750: {
    itemsToShow: 1.5,
  },
  950: {
    itemsToShow: 2.2,
  },
  1300: {
    itemsToShow: 3,
  },
}
</script>

<template>
  <div v-if="signedIn" class="grid grid-rows-1">
    <div v-if="!user.dashboard_home && user.generator_type === 'convo'">
      <AssetConvoInteractionView
        :generator_pid="user.generator_pid"
        :isHomePage="true"
      />
    </div>
    <div v-else>
      <div class="flex w-full justify-between mt-6 pr-4">
        <div>
          <h3>Welcome Back {{ user.profile.fname }}!</h3>

          <p class="mt-4" v-html="marked.parse(state.message)"></p>
        </div>

        <!-- <RecentAssets /> -->
      </div>

      <h3 class="mt-6 mb-4">Recommended Generators:</h3>

      <div
        v-if="state.generators.length < 4"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2"
      >
        <div
          v-for="generator in state.generators"
          :key="generator"
          class="!px-2"
        >
          <ProjectGeneratorCard
            :generator="generator"
            :projectsList="state.projectsList"
            :key="generator.pid"
          />
        </div>
      </div>
      <div class="!max-w-[calc(98vw-74px)] !overflow-hidden" v-else>
        <Carousel :breakpoints="breakpoints">
          <Slide
            v-for="generator in state.generators"
            :key="generator"
            class="!px-2"
          >
            <ProjectGeneratorCard
              :generator="generator"
              :projectsList="state.projectsList"
              :key="generator.pid"
            />
          </Slide>

          <template #addons>
            <Navigation />
            <Pagination />
          </template>
        </Carousel>
      </div>

      <div class="w-full !max-w-[1920px] flex justify-between items-center">
        <h3 class="mt-8 mb-3">Recent projects</h3>
        <NewFolderBtn
          type="project"
          :updateList="() => (rerender = rerender + 1)"
          classes="ml-0"
        />
      </div>
      <div :key="rerender">
        <ProjectsList :folders="state.folders" />
      </div>
    </div>
  </div>
  <div v-else class="grid grid-rows-1 justify-center">
    <div class="grid grid-cols-1 gap-4 my-8">
      <div class="mt-8 place-self-center">
        <img alt="SA logotype" src="@/assets/mark2_blk_250x.png" width="140" />
      </div>

      <h1 class="my-4 px-2 text-center">
        Procurement&nbsp;Sciences<br />Bidding&nbsp;Intelligence&nbsp;System
      </h1>

      <p class="max-w-lg b-4 px-2 text-center font-bold">
        Actionable insight that wins more bids
      </p>
      <RouterLink
        to="/session/email"
        id="sign-in"
        class="bg-psci hover:bg-gold text-white hover:text-black font-bold py-3 px-1 rounded shadow-lg text-center"
      >
        Sign-in
      </RouterLink>
      <p class="max-w-lg b-4 px-2 text-center text-gray-500 text-sm italic">
        By logging in you agree with our
        <a
          class="underline"
          target="_blank"
          href="https://www.procurementsciences.com/terms-of-use/"
          >Terms of Use</a
        >
        and
        <a
          class="underline"
          target="_blank"
          href="https://www.procurementsciences.com/privacy-policy/"
          >Privacy Policy</a
        >
      </p>
      <p class="max-w-lg b-4 px-2 text-center text-gray-500 text-sm italic">
        Contact your manager for access.
      </p>
    </div>
  </div>
</template>
