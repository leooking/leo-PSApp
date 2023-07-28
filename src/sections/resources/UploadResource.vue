<script setup>
import { reactive } from 'vue'
import toast from '../../lib/toast'
import Toggle from '../../components/Toggle.vue'
import RadioButton from 'primevue/radiobutton'

const props = defineProps({
  data_asset: Array,
  setDataAsset: Function,
  setDataAssetName: Function,
  deleteAsset: Function,
  source_url: String,
  setSourceUrl: Function,
  resource: Object,
  crawlMaxPages: String,
  setCrawlMaxPages: Function,
  setResourceName: Function
})

const state = reactive({
  useExternal: props.resource.source_url ? !!props.resource.source_url : false,
  fileCount: 0,
})

const toggle = () => {
  state.useExternal = !state.useExternal
  state.fileCount = 0
  if (state.useExternal) {
    props.setDataAsset([])
    props.setSourceUrl(props.resource.source_url)
  } else {
    props.setSourceUrl('')
    props.setDataAssetName(props.resource.data_asset_name)
  }
}

const removeFile = (index) => {
  props.data_asset?.splice(index, 1)
  state.fileCount--

  props.setResourceName(props.data_asset)
}

</script>
<template>
  <div
    class="shadow-lg w-full flex flex-col items-center md:flex-row justify-between pt-2 pb-4 px-4 bg-gray-100"
  >
    <div class="flex w-full h-full md:w-5/12">
      <div
        class="w-full border-2 border-dashed min-h-[100px] border-gray-400"
        @drop="!state.useExternal && setDataAsset($event.dataTransfer.files)"
        @dragover.prevent
        @drop.prevent
        :style="{ opacity: !state.useExternal ? 1 : 0.5 }"
      >
        <input
          v-on:change="
            (event) => {
              if (!state.useExternal) {
                state.fileCount =
                  event.target.files.length <= 5 ? event.target.files.length : 5
                if (event.target.files.length <= 5) {
                  setDataAsset(event.target.files)
                } else {
                  toast.error('You can only select a maximum of 5 files.')
                  setDataAsset([])
                  props.setResourceName([])
                }
              }
            }
          "
          class="hidden bg-white shadow appearance-none border rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="data_asset"
          type="file"
          placeholder=""
          accept=".pdf,.docx,.txt,.pptx,.xlsx"
          :disabled="state.useExternal"
          multiple="true"
        />
        <div class="flex flex-col justify-center h-[75%]">
          <div class="h-full flex justify-center items-center pt-2">
            <label for="data_asset" v-if="!data_asset?.length">
              Drop up to 5 files here or
              <span class="text-blue-500 cursor-pointer underline">Browse</span>
            </label>
            <template v-else>
              <div v-for="(asset, index) in data_asset" :key="index">
                <a
                  :href="asset.file_link"
                  target="_blank"
                  class="text-blue-500 cursor-pointer"
                  style="text-decoration: none"
                >
                  {{
                    asset.name.length > 20
                      ? asset.name.slice(0, 20) + '...'
                      : asset.name
                  }}
                </a>
                <sup
                  class="text-red-500 text-sm"
                  v-if="index < state.fileCount"
                >
                  <span @click="removeFile(index)">&times;</span>
                </sup>
                <span v-if="index < state.fileCount - 1">,</span>
              </div>
            </template>
          </div>
          <p class="text-xs text-center">
            Accepts .pdf, .docx, .txt, .pptx, and .xlsx file formats
          </p>
        </div>
      </div>
      <div class="flex flex-col">
        <button
          type="button"
          class="text-gray-400 mb-2 material-icons md-20"
          @mousedown="deleteAsset"
        >
          delete
        </button>
      </div>
    </div>

    <div
      class="w-1/12 py-3 md:py-0 flex flex-col justify-center items-center font-bold text-xl"
    >
      <Toggle
        :checked="state.useExternal"
        :toggle="toggle"
        classes="checked:bg-green-500 w-12 h-6"
      />
    </div>

    <div class="md:w-5/12" :style="{ opacity: state.useExternal ? 1 : 0.5 }">
      <label
        class="block text-gray-700 text-sm font-bold mb-1"
        for="source_url"
      >
        Enter an https:// URL
      </label>
      <input
        :value="source_url"
        :onInput="
          ($event) => state.useExternal && setSourceUrl($event.target.value)
        "
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="source_url"
        type="url"
        placeholder="Must be a publicly accessible URL"
        :disabled="!state.useExternal"
      />
      <div class="flex justify-between pt-2">
        <p class="text-xs text-gray-400 mt-1 mr-2">
          The web page text will be extracted
        </p>
        <div class="flex">
          <div
            class="flex align-items-center"
            v-tooltip.bottom="'Single page text extraction'"
          >
            <RadioButton
              :modelValue="props.crawlMaxPages"
              @update:modelValue="setCrawlMaxPages"
              inputId="single"
              name="single"
              value="single"
            />
            <label for="single" class="ml-2">Crawl one page</label>
          </div>
          <div
            class="flex align-items-center ml-3"
            v-tooltip.bottom="'Extract many pages of text'"
          >
            <RadioButton
              :modelValue="props.crawlMaxPages"
              @update:modelValue="setCrawlMaxPages"
              inputId="multi"
              name="multi"
              value="multi"
            />
            <label for="multi" class="ml-2">Crawl maximum pages</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
