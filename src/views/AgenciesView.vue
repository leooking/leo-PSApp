<script setup>
import { reactive, watch, ref, onMounted, toRaw } from 'vue'
import {  useRoute } from 'vue-router'
import { getItem } from '../lib/storage'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import api from "@/lib/axiosClient";
import NothingFound from '../components/NothingFound.vue'
import ProgressSpinner from 'primevue/progressspinner'
import AgencySearch from "@/sections/agencies/Search.vue";
import StatesSearch from "@/sections/states/Search.vue";
import Dropdown from "primevue/dropdown";
import TreeTable from 'primevue/treetable'
import depthToColor from '../lib/depthToColor'

const props = defineProps({ agencies: Array, states: Array})

const state = reactive({
  agencies: props.agencies,
  loading: false,
  states: props.states,
  selectedOption: "Federal",
})

const rerender = ref(0)
const route = useRoute()

const refresh = async () => {
  if (state.selectedOption === "Federal"){
    const data = await api.get('agencies')
    state.agencies = data
  }
  else {
    const states_data = await api.get('states')
    const { formatted } = formatData(states_data)
    state.states = formatted
  }
}

const formatData = (items, depth = 0) => {
  let data = items.map((item, i) => {
    let parent_pid = item.pid

    const children = item.children?.map((child) => ({
      key: child.pid,
      data: child,
      parent_pid,
    }))

    item.children = []

    return {
      key: !!children ? i : item.pid,
      data: item,
      children: children,
      depth,
    }
  })
  return {formatted: data}
}


watch(
    () => route.query.scope,
    async () => {
      state.loading = true
      await refresh()
      state.loading = false
    }
)

onMounted(async () => {
  state.loading = true
  await refresh()
  state.loading = false
})

const setAgencies = (agencies) => {
  state.agencies = agencies
}

const setStates = (states) => {
  const { formatted } = formatData(states)
  state.states = formatted
}

const setAsideOptions = ref([ "Federal", "State"])

const performRerender = async () => {
  await refresh()
  rerender.value = rerender.value + 1
}
const setLoading = (isLoading) => (state.loading = isLoading)

</script>
<style>
a:hover {
  text-decoration: underline;
}
</style>
<template>
  <div class="flex justify-between items-center mt-2">
    <h2 class="my-2">
      Agency Insights : BETA
    </h2>
  </div>
  <div class="flex justify-between items-center my-4 flex-col md:flex-row">
    <div class="flex flex-col w-full max-w-[250px]">
      <label class="text-gray-600 text-sm">View Federal or State Agencies</label>
      <Dropdown
          v-model="state.selectedOption"
          :options="setAsideOptions"
          placeholder="Select an Option"
          v-on:change="performRerender"
      />
    </div>
    <AgencySearch
        :setLoading="setLoading"
        :rerender="performRerender"
        :state="state"
        :setAgencies="setAgencies"
        :agencies="state.agencies"
        style="padding-top: 20px;"
        v-if="state.selectedOption === 'Federal'"
    />
    <StatesSearch
        :setLoading="setLoading"
        :rerender="performRerender"
        :state="state"
        :setStates="setStates"
        :states="state.states"
        style="padding-top: 20px;"
        v-if="state.selectedOption === 'State'"
    />
  </div>
  <div class="max-w-[96vw] xl:max-w-[100vw]" v-if="!state.loading">
    <DataTable
        :value="state.agencies"
        :resizable-columns="false"
        column-resize-mode="expand"
        responsive-layout="scroll"
        :paginator="true"
        :rows="25"
        v-if='state.agencies?.length > 0 && state.selectedOption === "Federal"'
    >
      <Column field="agency_name" header="Agency" sortable style="min-width: 300px !important;"/>
      <Column field="agency_code" header="Code" sortable style="min-width: 100px !important;"/>
      <Column field="sub_department" header="Sub Department" sortable style="min-width: 350px !important;">
        <template #body="slotProps">
          <div v-tooltip.bottom="slotProps.data.sub_department">
            {{ slotProps.data.sub_department.length > 30 ? slotProps.data.sub_department.slice(0,30) + "..." : slotProps.data.sub_department }}
          </div>
        </template>
      </Column>
      <Column field="acronym" header="Acronym" sortable style="min-width: 100px !important;"/>
      <Column field="employment" header="Employment" sortable style="min-width: 100px !important;"/>
      <Column field="website_url" header="Website URL" style="min-width: 180px !important" >
        <template #body="slotProps">
          <a v-bind:href="slotProps.data.website_url" target="_blank">Website Homepage</a>
        </template>
      </Column>
      <Column field="strategic_plan_url" header="Strategic Plan" style="min-width: 180px !important" >
        <template #body="slotProps">
          <a v-bind:href="slotProps.data.strategic_plan_url" target="_blank" v-if="slotProps.data.strategic_plan_url?.length > 0">Strategic Plan</a>
        </template>
      </Column>
    </DataTable>

    <TreeTable
        :value="state.states"
        :resizable-columns="true"
        column-resize-mode="expand"
        responsive-layout="scroll"
        :paginator="true"
        :rows="25"
        v-if="state.states?.length > 0 && state.selectedOption === 'State'"
      >
        <Column field="state_name" header="State" expander sortable>
          <template #body="slotProps">
            <div
            :class="`w-full flex justify-between items-center !h-[65px] ${depthToColor(
              slotProps.node.data.depth
            )}`"
          >
            <a 
              v-bind:href="slotProps.node.data.url" 
              target="_blank"
              v-if="!slotProps.node.data.state_name"
              class="hover:cursor-pointer underline text-ellipsis overflow-hidden"
            >
              {{ slotProps.node.data.agency_name }}
            </a>
            <div
              v-else
              class="text-ellipsis overflow-hidden cursor-not-allowed"
            >
            <a 
              v-bind:href="slotProps.node.data.homepage" 
              target="_blank"
              class="hover:cursor-pointer text-ellipsis overflow-hidden"
            >
              {{ slotProps.node.data.state_name }}, {{ slotProps.node.data.abbreviation }}
            </a>
            </div>
          </div>
          </template>
        </Column>
        <Column field="procurement" header="Procurement URL" >
          <template #body="slotProps">
            <a v-bind:href="slotProps.node.data.procurement" target="_blank" v-if="slotProps.node.data.state_name">Procurement URL</a>
          </template>
        </Column>
        
    </TreeTable>

    <NothingFound name="agency" v-else />
  </div>
  <div class="w-full min-h-[50vh] flex justify-center items-center" v-else>
    <ProgressSpinner />
  </div>
</template>
