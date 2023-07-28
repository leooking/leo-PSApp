<script setup>
import { ref, computed } from 'vue'
import TableCell from './TableCell.vue'
import Dropdown from 'primevue/dropdown'

const props = defineProps({
  results: Array,
  naicCodeToTitle: Object,
})

const itemsPerPage = 10
const currentPage = ref(1)
const resultData = ref(props.results)
const selectedSortOrder = ref({ title: "Posted Date Newest", name: 'posted_date', order: 'desc' })
const sortOrders = ref([
  { title: 'Name A-Z', name: 'name', order: 'asc' },
  { title: 'Name Z-A', name: 'name', order: 'desc' },
  { title: 'Agency A-Z', name: 'sub_tier', order: 'asc' },
  { title: 'Agency Z-A', name: 'sub_tier', order: 'desc' },
  { title: 'Due Date Newest', name: 'due_date', order: 'desc' },
  { title: 'Due Date Oldest', name: 'due_date', order: 'asc' },
  { title: 'Posted Date Newest', name: 'posted_date', order: 'desc' },
  { title: 'Posted Date Oldest', name: 'posted_date', order: 'asc' },
])

// Compute the sliced data to display based on the currentPage and itemsPerPage
const slicedData = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return resultData.value.slice(startIndex, endIndex)
})

const toggleShowMore = (e) => {
  const actionButton = e.target
  const descElem = e.target.previousElementSibling
  descElem.classList.toggle('line-clamp-2')
  descElem.classList.contains('line-clamp-2')
    ? (actionButton.innerHTML = 'Show all')
    : (actionButton.innerHTML = 'Show less')
}

const isLongDesc = (text) => typeof text === 'string' ? text.length > 500 : false

const handleSortSelect = computed(() => {
  const currentSort = selectedSortOrder.value
  if (currentSort) {
    // Make a copy of the original data array
    const sortedArray = [...props.results]
    const sortBy = currentSort.name
    const sortOrder = currentSort.order
    const sortType = sortBy.split("_").pop();
    const dateTypeSort = sortType === "date" ? true : false

    // Sort the array based on the selected sort option
    sortedArray.sort((a, b) => {
      const aValue = dateTypeSort ? new Date(a[sortBy]) : a[sortBy]
      const bValue = dateTypeSort ? new Date(b[sortBy]) : b[sortBy]
      if (sortOrder === 'asc') {
        if (aValue < bValue) return -1
        if (aValue > bValue) return 1
      } else if (sortOrder === 'desc') {
        if (aValue > bValue) return -1
        if (aValue < bValue) return 1
      }
      return 0
    })
    resultData.value = sortedArray
  } else {
    resultData.value = props.results
  }
})
</script>

<template>
  <div
    :class="`max-w-[100%] md:mx-auto xs:px-4 md:px-0 pt-10 xs:pb-[69px] md:pb-[117px]`"
  >
    <div class="flex w-full justify-between items-end">
      <div class="p-float-label flex justify-start my-2 xs:w-full md:w-[250px]">
        <Dropdown
          v-on:change="handleSortSelect"
          v-model="selectedSortOrder"
          :options="sortOrders"
          optionLabel="title"
          placeholder="Sort By"
          class="w-full md:w-14rem"
          inputId="results-sort-by"
        />
        <label for="results-sort-by">Results Sort By:</label>
      </div>
      <p class="text-gray-600 text-sm pb-2 font-bold">
        {{ props.results.length }} Records Found
      </p>
    </div>
    <div v-for="(item, index) in slicedData" :key="index">
      <div :class="`shadow-lg bg-white flex flex-col mb-5`">
        <div :class="`flex flex-col md:flex-row`">
          <TableCell :cell-title="`Name`" :value="item.name" />
          <TableCell
            :cell-title="`Set Aside Code`"
            :value="item.set_aside_code"
          />
        </div>
        <div :class="`flex flex-col md:flex-row`">
          <TableCell :cell-title="`Sol#`" :value="item.sol_number" />
          <TableCell :cell-title="`Link`" :value="item.link" :isLink="true" />
        </div>
        <div :class="`flex flex-col md:flex-row`">
          <TableCell :cell-title="`Notice Type`" :value="item.notice_type" />
          <TableCell :cell-title="`Agency`" :value="item.sub_tier" />
        </div>
        <div :class="`flex flex-col md:flex-row`">
          <TableCell :cell-title="`office`" :value="item.office" />
          <TableCell :cell-title="`Posted Date`" :value="item.posted_date" />
        </div>
        <div :class="`flex flex-col md:flex-row`">
          <TableCell :cell-title="`Due Date`" :value="item.due_date" />
          <TableCell
            :cell-title="`NAICS`"
            :value="props.naicCodeToTitle[item.naics_code]"
          />
        </div>
        <div :class="`flex flex-col md:flex-row`">
          <div
            :class="`flex-1 flex flex-col border border-black p-2 flex-col gap-y-1`"
          >
            <div :class="`flex-1 font-bold text-sm mb-[-9px] text-gray-900`">
              Description
            </div>
            <div
              :id="`desc-${index}`"
              :class="{
                'flex-1 text-sm text-gray-700 pb-2': true,
                'line-clamp-2': isLongDesc(item.description),
              }"
            >
              {{ item.description?.replace(/�/g, '') }}
            </div>
            <div
              :class="`text-blue-500 text-sm hover:underline cursor-pointer`"
              @click="toggleShowMore"
              v-if="isLongDesc(item.description)"
            >
              Show more
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex w-full justify-center">
      <vue-awesome-paginate
        :total-items="resultData.length"
        :items-per-page="itemsPerPage"
        :max-pages-shown="5"
        v-model="currentPage"
        :on-click="(val) => (currentPage.value = page)"
      />
    </div>
  </div>
</template>
