<script setup>
import { ref } from 'vue'
import AssetsList from '../../sections/assets/AssetsList.vue'
import NewFolderBtn from '../../components/NewFolderBtn.vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

const rerender = ref(0)

// * tempSearch for local storage while search is being watched by fetchFolders in AssetsList.vue
const search = ref('')
const tempSearch = ref('')

const refresh = () => (rerender.value = rerender.value + 1)

const handleSearch = () => {
  search.value = tempSearch.value
  refresh()
}
</script>

<template>
  <div class="object-page">
    <div class="flex justify-between items-center mt-2">
      <h2 class="my-2">
        Assets
        <span class="ml-1 text-gray-500 font-normal italic text-xs"
          >Create Assets by using a Generator</span
        >
      </h2>
    </div>

    <div class="flex w-full flex-row md:flex-row justify-between mb-4">
      <NewFolderBtn type="asset" :updateList="refresh" />

      <form @submit.stop.prevent="handleSearch" class="flex items-center w-full max-w-[80%] md:max-w-[50%]">
        <InputText
          type="text"
          v-model="tempSearch"
          placeholder="Search by name and text contents"
          class="!min-h-[45px] w-full my-2 md:my-0 md:mx-2 w-full shadow appearance-none border border-gray-400 rounded py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          class="text-gray-400 material-icons md-40 ml-[-40px] mr-[25px]"
          type="submit"
        >
          search
        </button>

        <Button
          @click="()=> {
            search = ''
            refresh()
          }"
          label="Show all"
          class="!min-h-[45px] min-w-[120px] md:mt-0 hover:bg-purple hover:text-white border border-purple text-purple py-2 rounded focus:outline-none focus:shadow-outline whitespace-nowrap"
        />
      </form>
    </div>

    <TabView>
      <TabPanel header="All">
        <div :key="rerender">
          <AssetsList scope="" :search="search"/>
        </div>
      </TabPanel>
      <TabPanel header="Private">
        <div :key="rerender">
          <AssetsList scope="private" :search="search"/>
        </div>
      </TabPanel>
      <TabPanel header="Shared">
        <div :key="rerender">
          <AssetsList scope="shared" :search="search"/>
        </div>
      </TabPanel>
    </TabView>
  </div>
</template>
