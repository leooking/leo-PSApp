<script setup>
import { ref, reactive, onMounted } from 'vue'
import toast from '../../lib/toast'
import api from '../../lib/axiosClient'
import Multiselect from '@vueform/multiselect'
import { getItem } from '../../lib/storage'
import { useRoute } from 'vue-router'
import fetchFolders from '../../lib/fetchFolders'
import AutoComplete from 'primevue/autocomplete'
import Button from 'primevue/button'

const props = defineProps({
  rerender: Function,
  state: Object,
  setResources: Function,
  setLoading: Function,
  inModal: Boolean,
  noTagSearch: Boolean,
  noTextSearch: Boolean,
  searchPlaceholder: String,
  resources: Array,
})

const route = useRoute()

const state = reactive({
  scope: 'All',
  raw_resources: [], //* Original, pre-filtered resources
  tagsValue: [],
})

const search = ref('')
const currentUser = getItem('currentUser')
const value = ref([])
const tags = ref(['one'])

onMounted(() => {
  state.raw_resources = props.folders
  tags.value = props.state.available_tags.filter(Boolean)

  props.rerender()
})

const getResources = async (fetchAll = false) => {
  try {
    props.setLoading(true)
    const { resources, available_tags } = await fetchFolders(
      `resources?q=${fetchAll ? '' : search.value}`,
      'resources',
      route.query.scope
    )
    props.setResources([])
    props.setResources(resources)
    tags.value = available_tags

    if (!fetchAll) search.value = ''

    // props.rerender()
  } catch (err) {
    toast.error(err.message)
  } finally {
    props.setLoading(false)
  }
}

const getFiltered = async (value) => {
  try {
    props.setLoading(true)
    if (!value) {
      value = ''
      return getResources()
    } else {
      const payload = {
        source_tags: value,
      }

      const { resources } = await api.post(
        `resources/filtered_results`,
        payload
      )
      props.setResources(resources)
    }
  } catch (err) {
    toast.error(err.message)
  } finally {
    props.setLoading(false)
  }
}

const options = ref(['All', 'Personal', 'Shared'])

const updateScope = (val) => {
  state.scope = val
  if (val === 'Personal')
    props.setResources(
      state.raw_resources.filter(
        (r) => r.scope === 'mine' && r.user_pid === currentUser.pid
      )
    )
  else if (val === 'Shared')
    props.setResources(state.raw_resources.filter((r) => r.scope === 'group'))
  else
    props.setResources(
      state.raw_resources.filter(
        (r) =>
          (r.scope === 'mine' && r.user_pid === currentUser.pid) ||
          r.scope === 'group'
      )
    )

  props.rerender()
}

const filter = (event) => {
  tags.value = props.state?.available_tags
    ?.filter(Boolean)
    ?.filter((el) => el && el.includes(event.query))
}
</script>
<style>
.p-autocomplete {
  width: 100% !important;
  border-radius: 0;
  border: none !important;
  overflow-y: hidden;
}

.p-autocomplete ul {
  width: 100% !important;
  border-radius: 0;
  overflow-y: hidden;
}

.p-autocomplete-multiple-container {
  width: 100% !important;
  padding-right: 50px;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
}

.p-autocomplete,
.p-autocomplete *:focus,
.p-autocomplete *:active,
.p-autocomplete *:hover {
  outline: none !important;
  border: none !important;
}

.p-autocomplete-input {
  width: 100%;
  border-radius: 0;
}
</style>
<template>
  <div class="flex w-full flex-col md:flex-row items-center">
    <div class="flex w-full justify-between flex-col md:flex-row">
      <div
        id="tagInputWrapper"
        class="md:max-w-[50%] flex items-center justify-between my-2 md:my-0 md:mx-2 max-h-12 w-full bg-white shadow appearance-none border border-gray-400 rounded py-2 text-gray-700 leading-tight focus:border-none overflow-hidden"
      >
        <AutoComplete
          v-model="value"
          :suggestions="tags"
          placeholder="Select a list of tags"
          selectionEnd="27"
          multiple
          @complete="filter"
          v-if="!noTagSearch"
        />
        <Button
          icon="pi pi-filter"
          severity="secondary"
          text
          v-tooltip="'Filter Resources By Tags'"
          class="!max-w-[40px] border-radius-none"
          @click="() => getFiltered(value)"
        />
      </div>

      <div class="flex items-center w-full" v-if="!noTextSearch">
        <input
          v-model="search"
          class="my-2 md:my-0 md:mx-2 w-full shadow appearance-none border border-gray-400 rounded py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          :placeholder="searchPlaceholder || 'Search by name and text contents'"
          v-on:keydown="(e) => e.key === 'Enter' && getResources()"
        />
        <button
          class="text-gray-400 material-icons md-40 ml-[-40px] md:mr-[20px]"
          :onClick="() => getResources()"
        >
          search
        </button>
      </div>
    </div>
    <!--<Multiselect
      :value="state.scope"
      @input="updateScope"
      required
      placeholder=""
      :options="options"
      class="!text-sm !min-h-[45px] mt-2 md:mt-0 max-w-[150px] shadow-md !rounded-none cursor-pointer !border-[#26c08e]"
      v-if="type !== 'private' && type !== 'shared'"
    />-->
    <div class="flex md:ml-4">
      <button
        @click="
          () => {
            getResources(true)
            value = []
          }
        "
        class="mt-4 md:mt-0 hover:bg-purple hover:text-white border border-purple text-purple py-2 px-4 rounded focus:outline-none focus:shadow-outline whitespace-nowrap"
      >
        Show all
      </button>
    </div>
  </div>
</template>
