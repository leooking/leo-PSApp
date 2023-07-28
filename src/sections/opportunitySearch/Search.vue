<script setup>
import { ref, reactive, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import MultiSelect from 'primevue/multiselect'
import Dropdown from 'primevue/dropdown'
import Checkbox from 'primevue/checkbox';
import AutoComplete from 'primevue/autocomplete'
import toast from '../../lib/toast'
import api from '../../lib/axiosClient'

const props = defineProps({
  refresh: Function,
  setNaicCodeToTitle: Function,
})

const state = reactive({
  naicsLoading: false,
  options: [],
})

const keywords = ref('')
const includeExpired = ref(false)
const naics = ref([])
const setAsides = ref([])
const types = ref([])
const dateDue = ref('Any')
const dataSource = ref(['ALL', 'SAM.GOV'])

const naicOptions = ref([])

onMounted(async () => {
  try {
    const res = await api.get('data_sources/naics_codes')
    const naics = []
    let tempNaicCodeToTitle = {}
    res.forEach((naic) => {
      naics.push({
        label: `${naic.code} - ${naic.title}`,
        value: naic.code,
      })
      tempNaicCodeToTitle[naic.code] = `${naic.code} - ${naic.title}`
    })

    props.setNaicCodeToTitle(tempNaicCodeToTitle)
    naicOptions.value = naics
    state.options = naics
  } catch (err) {
    toast.error(err.message)
  }
})
// * label/value format needed for filtering
const setAsideOptions = ref([
  { label: 'SBA', value: 'SBA' },
  { label: 'SBP', value: 'SBP' },
  { label: '8A', value: '8A' },
  { label: '8AN', value: '8AN' },
  { label: 'HZC', value: 'HZC' },
  { label: 'HZS', value: 'HZS' },
  { label: 'SDVOSBC', value: 'SDVOSBC' },
  { label: 'SDVOSBS', value: 'SDVOSBS' },
  { label: 'WOSB', value: 'WOSB' },
  { label: 'WOSBSS', value: 'WOSBSS' },
  { label: 'EDWOSB', value: 'EDWOSB' },
  { label: 'EDWOSBSS', value: 'EDWOSBSS' },
  { label: 'LAS', value: 'LAS' },
  { label: 'IEE', value: 'IEE' },
  { label: 'ISBEE', value: 'ISBEE' },
  { label: 'BICiv', value: 'BICiv' },
  { label: 'VSA', value: 'VSA' },
  { label: 'VSS', value: 'VSS' },
  { label: 'ESB', value: 'ESB' },
  { label: 'VSB', value: 'VSB' },
])
const typeOptions = ref([
  { label: 'Solicitation', value: 'Solicitation' },
  { label: 'Award Notice', value: 'Award Notice' },
  {
    label: 'Combined Synopsis/Solicitation',
    value: 'Combined Synopsis/Solicitation',
  },
  { label: 'Presolicitation', value: 'Presolicitation' },
  { label: 'Special Notice', value: 'Special Notice' },
  { label: 'Sources Sought', value: 'Sources Sought' },
  { label: 'Justification', value: 'Justification' },
  { label: 'Sale of Surplus Property', value: 'Sale of Surplus Property' },
  {
    label: 'Consolidate/(Substantially) Bundle',
    value: 'Consolidate/(Substantially) Bundle',
  },
  {
    label: 'Justification and Approval (J&A)',
    value: 'Justification and Approval (J&A)',
  },
  {
    label: 'Fair Opportunity / Limited Sources Justification',
    value: 'Fair Opportunity / Limited Sources Justification',
  },
  {
    label: 'Modification/Amendment/Cancel',
    value: 'Modification/Amendment/Cancel',
  },
  {
    label: 'Foreign Government Standard',
    value: 'Foreign Government Standard',
  },
])
const dateOptions = ref(['Next 30 days', 'Next 60 days', 'Next 90 days'])
const dataSourceOptions = ref(['ALL', 'SAM.GOV'])

const clear = () => {
  keywords.value = ''
  includeExpired.value = false
  naics.value = []
  setAsides.value = []
  types.value = []
  dateDue.value = 'Any'
  dataSource.value = ['ALL', 'SAM.GOV']
}

const arrayToParam = (value) => {
  let string
  value.forEach((val) => {
    if (val.value !== 'Any') {
      if (!string) string = val.value
      else string += `,${val.value}`
    }
  })
  return string
}
const search = () => {
  let params = []

  let cleanNaics = Object.values(naics.value).map((naic) => naic.value)
  if (keywords.value) params.push(`keywords=${keywords.value}`)
  if (cleanNaics.length > 0) params.push(`naics=${cleanNaics}`)
  if (setAsides.value.length)
    params.push(`set_asides=${arrayToParam(setAsides.value)}`)
  if (types.value.length) params.push(`type=${arrayToParam(types.value)}`)
  if (dateDue.value !== 'Any') params.push(`due_date=${dateDue.value}`)
  params.push(`include_expired=${includeExpired.value}`)

  let temp = params.join('&')
  params = temp

  props.refresh(`?${params}`)
}

const fetchNaics = (e) => {
  try {
    const val = e.query

    let updatedOptions = state.options.filter(
      (option) =>
        option.label.toLowerCase().includes(val.toLowerCase()) ||
        `${option.value}`.includes(val)
    )
    naicOptions.value = updatedOptions
  } catch (err) {
    throw new Error(err)
  }
}
</script>
<style>
.p-autocomplete ul {
  width: 100% !important;
  border-radius: 0;
  overflow-y: hidden;
}

.p-autocomplete input {
  min-width: 100px !important;
}

.p-autocomplete-multiple-container {
  width: 100% !important;
  padding-right: 50px;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
}

.p-multiselect-close {
  display: none !important;
}
</style>
<template>
  <div class="flex justify-between w-full pb-6 pt-4">
    <form class="flex flex-col w-[1000px] mr-2" @submit.prevent="search">
      <h2 class="my-2">
        Opportunity Search : BETA
      </h2>
      <h5 class="font-bold">Keyword Search</h5>
      <p class="text-sm mb-4">
        Search across all active opportunities using keywords around Name,
        Solicitation #, Description, Set-Aside, NAICS codes, etc.
      </p>
      <div class="flex">
        <span class="w-full p-input-icon-right mr-2">
          <i class="pi pi-search" />
          <InputText v-model="keywords" placeholder="Search" class="w-full" />
        </span>
        <Button type="submit" label="Search" class="bg-purple" />
      </div>

      <div class="flex mt-4 space-x-2">
        <div class="flex flex-col w-full max-w-[250px]">
          <label class="text-gray-600 text-sm">NAICS Code: </label>
          <AutoComplete v-model="naics" option-label="label" :suggestions="naicOptions" @complete="fetchNaics"
            :loading="state.naicsLoading" multiple placeholder="Any" />
        </div>
        <div class="flex flex-col w-full max-w-[250px]">
          <label class="text-gray-600 text-sm">Set-Aside Code:</label>
          <MultiSelect v-model="setAsides" :options="setAsideOptions" option-label="label" placeholder="Any" filter />
        </div>
        <div class="flex flex-col w-full max-w-[250px]">
          <label class="text-gray-600 text-sm">Opportunity Type:</label>
          <MultiSelect v-model="types" :options="typeOptions" option-label="label" placeholder="Any" filter />
        </div>
        <div class="flex flex-col w-full max-w-[250px]">
          <label class="text-gray-600 text-sm">Bids due within:</label>
          <Dropdown v-model="dateDue" :options="dateOptions" placeholder="Any" />
        </div>
      </div>
    </form>

    <div class="flex flex-col space-y-4">
      <div class="flex">
        <Button label="Search" class="bg-purple" :style="{ borderRadius: '5px 0 0 5px', margin: 0 }" />
        <Button label="Saved" v-tooltip.bottom="'Coming Soon'" disabled class="bg-white text-black disabled:bg-white"
          :style="{ borderRadius: 0, margin: 0 }" />
        <Button label="Shared" v-tooltip.bottom="'Coming Soon'" disabled class="bg-white text-black disabled:bg-white"
          :style="{ borderRadius: '0 5px 5px 0', margin: 0 }" />
      </div>

      <div class="flex flex-col w-full">
        <label class="text-gray-600 text-sm">Opportunity Data Source: </label>
        <MultiSelect :modelValue="dataSource" update:modelValue="()=>{}" :options="dataSourceOptions" />
      </div>
      <div class="card flex justify-content-center my-auto">
        <label class="text-gray-600 text-sm">Include Expired</label>
        <Checkbox class="my-auto ml-4" v-model="includeExpired" :binary="true" />
      </div>
      <Button label="Clear" severity="danger" @click="clear" />
    </div>
  </div>
</template>
