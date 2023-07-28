<script setup>
import { ref, reactive, onMounted } from 'vue'
import toast from '../../lib/toast'
import api from '../../lib/axiosClient'
import { getItem } from '../../lib/storage'
import { useRoute } from 'vue-router'
import Button from 'primevue/button'

const props = defineProps({
  rerender: Function,
  state: Object,
  setAgencies: Function,
  setLoading: Function,
  inModal: Boolean,
  noTextSearch: Boolean,
  searchPlaceholder: String,
  agencies: Array,
})

const route = useRoute()

const state = reactive({
  scope: 'All',
  raw_agencies: [], //* Original, pre-filtered resources
  tagsValue: [],
})

const search = ref('')
const currentUser = getItem('currentUser')
const value = ref([])

onMounted(() => {
  state.raw_agencies = props.agencies
  props.rerender()
})

const getAgencies = async (fetchAll = false) => {
  try {
    props.setLoading(true)
    const agencies = await api.get(`agencies?q=${fetchAll ? '' : search.value}`);
    props.setAgencies([])
    props.setAgencies(agencies)
    console.log(agencies)
    if (!fetchAll) search.value = ''

    // props.rerender()
  } catch (err) {
    toast.error(err.message)
  } finally {
    props.setLoading(false)
  }
}

</script>

<style>

.p-autocomplete ul {
  width: 100% !important;
  border-radius: 0;
  overflow-y: hidden;
}

</style>

<template>
  <div class="flex w-full flex-col md:flex-row items-center">
    <div class="flex w-full justify-between flex-col md:flex-row">
      <div class="flex items-center w-full" v-if="!noTextSearch">
        <input
          v-model="search"
          class="my-2 md:my-0 md:mx-2 w-full shadow appearance-none border border-gray-400 rounded py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          :placeholder="searchPlaceholder || 'Search by name and text contents'"
          v-on:keydown="(e) => e.key === 'Enter' && getAgencies()"
        />
        <button
          class="text-gray-400 material-icons md-40 ml-[-40px] md:mr-[20px]"
          :onClick="() => getAgencies()"
        >
          search
        </button>
      </div>
    </div>
    <div class="flex md:ml-4">
      <button
        @click="
          () => {
            getAgencies(true)
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
