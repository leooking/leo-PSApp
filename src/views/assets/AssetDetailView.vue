<script setup>
import { useRoute, RouterLink } from 'vue-router'
import { onMounted, reactive } from 'vue'
import { DateTime } from 'luxon'
import api from '../../lib/axiosClient'
import * as marked from 'marked'
import retainLineBreaks from '../../lib/retainLineBreaks'
import NothingFound from '../../components/NothingFound.vue'
import toast from '../../lib/toast'
import { exportPDF } from '../../lib/exportPDF'
import { getItem } from '../../lib/storage'
import { EDTTime, TableDateFormat } from '../../lib/formatDate'

const state = reactive({ asset: {}, selectedRevision: null, loading: true })
const route = useRoute()
const user = getItem('currentUser')

onMounted(async () => {
  try {
    const asset = await api.get('assetz/' + route.params.pid)
    state.asset = asset
    state.selectedRevision = asset.revision_pid;
  } catch (err) {
    toast.error(err.message)
  } finally {
    state.loading = false
  }
})

const handleRevisionChange = (e) => {
  if (e.target.value == "") {
    state.selectedRevision = null
  }
  state.selectedRevision = e.target.value
}

const navigateTo = async () => {
  const generatorType = state.asset.generator_type;
  const assetPid = state.asset.pid;

  try {
    
    const res = await api.post('assetz/' + assetPid + '/create_revision', {
      user_pid: state.asset.user_pid,
      generator_pid: state.asset.generator_pid,
      parent_revision: state.selectedRevision
    })

    if (res.success) {
      window.location = `/assets/${assetPid}/${generatorType}`;
    }

  } catch (err) {
    toast.error(err.message)
  }
}
const parsePrompt = (prompt) => {
  let newPrompt = ''

  const pattern =
    /The proposal requirement is "(.*?)".*?The proposal response is "(.*?)"/s
  const res = prompt.match(pattern)
  let requirement = res && res[1]
  let response = res && res[2]
  if (res && requirement && response) {
    newPrompt = `
      <span class="underline font-bold">Requirement: </span> <br />
      ${requirement}
      <br /> <br />
      <span class="underline font-bold">Response: </span> <br />
      ${response} 
    `
  } else {
    newPrompt = marked.parse(retainLineBreaks(prompt))
  }

  return newPrompt
}

const filteredData = (revision_pid) => {
  const rids = state.asset.revisions.find((item) => item.revision_pid == revision_pid)
  const filteredData = state.asset.interactions.filter((item) => rids.rvs_ids.includes(item.revision_pid) || item.revision_pid == null)
  return filteredData
}

</script>
<style scoped>
th {
  background-color: transparent !important;
  color: black !important;
}

td {
  max-width: 50vw !important;
}
</style>
<template>
  <div>
    <RouterLink :to="`/assets`" class="text-gray-500 flex gap-2 pt-2 whitespace-nowrap">
      <span class="material-icons text-sm">arrow_back</span>
      Back to Assets
    </RouterLink>

    <div class="w-full flex justify-between">
      <h2 class="my-2">Asset name: {{ state.asset.name }}</h2>
      <select v-if="state.asset.revisions?.length > 0"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2 py-3 rounded-md my-auto"
        @change="handleRevisionChange">
        <option v-if="state.asset.revisions.length == 0" value="">{{ TableDateFormat(state.asset.created_at) }} : {{ state.asset.user_name }} - Revision 1</option>
        <option v-for="(revision, index) in state.asset.revisions" :value="revision.revision_pid"
          :selected="revision.revision_pid === state.selectedRevision">
          {{ EDTTime(revision.created_at) }} : {{ revision.user }} - Revision {{ index + 1 }}
        </option>
      </select>
      <div>
        <button @click="exportPDF(state, user)"
          class="bg-purple hover:bg-gold text-white hover:text-black px-8 py-3 rounded-md focus:outline-none focus:shadow-outline mx-2">
          Export PDF
        </button>
        <button
          class="bg-purple hover:bg-gold text-white hover:text-black px-8 py-3 rounded-md focus:outline-none focus:shadow-outline"
          @click="navigateTo">
          Resume
        </button>
      </div>
    </div>
    <p class="mb-2">Asset generator used: {{ state.asset.generator_name }}</p>
    <p class="mb-2">Created on: {{ state.asset.created_at }}</p>
    <div class="flex justify-between mt-4" v-if="state.asset.interactions?.length > 0">
      <h3 class="w-[50vw]">Prompts</h3>
      <h3 class="w-[50vw]">Responses</h3>
    </div>

    <div class="flex justify-between mt-4 border even:bg-slate-300" v-if="state.asset.interactions?.length > 0"
      v-for="interaction in state.selectedRevision ? filteredData(state.selectedRevision) : state.asset.interactions"
      :key="interaction.pid">
      <p class="w-[50vw]" v-html="interaction?.prompt && parsePrompt(interaction.prompt)"></p>
      <p class="w-[50vw]" v-html="interaction?.response && marked.parse(retainLineBreaks(interaction.response))"></p>
    </div>
    <NothingFound subTitle="Get started by creating new interactions" v-else />
  </div>
</template>