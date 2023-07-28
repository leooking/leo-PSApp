<script setup>
import { reactive, inject } from 'vue'
import api, { contentType } from '../../lib/axiosClient'
import formatName from '../../lib/formatName'
import Modal from '../../components/Modals/Modal.vue'
import ResourcePickerModal from '../../components/Modals/ResourcePickerModal.vue'
import { useModal } from 'vue-final-modal'
import VuePdfApp from 'vue3-pdf-app'
import 'vue3-pdf-app/dist/icons/main.css'
import toast from '../../lib/toast'
import pdfConfig from '../../lib/pdfConfig'
import Button from 'primevue/button'
import formatChecked from '../../lib/formatChecked'

const state = reactive({
  isLoading: false,
  file: null,
  pdf: null,
  pages: [],
  file_link: '',
  selected: '',
})

const interactionState = inject('interactionState')

const getHighlighted = (e) => {
  const selection = window.getSelection()
  const range = selection.getRangeAt(0)
  const text = range.toString()
  interactionState.current = text
}

const setDataAsset = async (e, file) => {
  e.preventDefault()
  console.log(file, '____')
  try {
    const fileSize = file.size / 1024 / 1024 // in MB
    if (fileSize < 100) {
      state.isLoading = true
      state.file = file
      contentType('multipart/form-data')
      const res = await api.post('resources/', {
        data_asset: file,
        name: formatName(file.name),
      })
      state.file_link = res.file_link
    } else
      toast.error(
        'File size is too large. Please upload a file less than 100MB'
      )
  } finally {
    state.isLoading = false
  }
}

const { open: openAttach, close: closeAttach } = useModal({
  component: Modal,
  attrs: {
    isLarge: true,
    noCloseBtn: true,
    type: 'select',
    parentState: interactionState,
    onOpen() {
      interactionState.limit = 1
    },
    onClose() {
      interactionState.limit = null
      closeAttach()
    },
    onSetCurrent(file_link) {
      const formatted = formatChecked(file_link)

      if (formatted[0]) state.selected = formatted[0]
    },
    async onConfirm() {
      try {
        const res = await api.get(`resources/${state.selected}`)
        state.file_link = res.file_link
        closeAttach()
      } catch (err) {
        closeAttach()
        toast.error('Error loading resource')
      }
    },
    onChangeModal() {
      closeAttach()
      openCreateResource()
    },
  },
  slots: {
    default: ResourcePickerModal,
  },
})
</script>
<style>
#vuePdfApp .toolbar {
  z-index: 1;
}
</style>
<template>
  <div
    class="relative md:max-w-[45%] !max-h-[85vh] pt-6 md:pt-0 overflow-x-hidden h-auto w-full z-1"
  >
    <div class="flex justify-end px-6 items-center">
      <div class="flex">
        <Button
          icon="pi pi-times"
          class="bg-purple absolute bottom-[5%] right-[5%] z-[1000]"
          rounded
          @click="() => (state.file_link = null)"
          v-if="!state.isLoading && state.file_link"
        />
      </div>
    </div>

    <div
      class="relative flex flex-col w-full"
      v-if="!state.isLoading && state.file_link"
    >
      <div class="relative max-h-[85vh] overflow-y-scroll">
        <div
          class="relative z-1 max-w-[98%] overflow-x-hidden"
          v-on:mouseup="getHighlighted"
        >
          <vue-pdf-app
            :pdf="state.file_link"
            :config="pdfConfig"
            style="height: 85vh"
          ></vue-pdf-app>
        </div>
      </div>
    </div>
    <div class="w-full h-full p-4" v-if="!state.isLoading && !state.file_link">
      <div
        class="w-full h-full flex flex-col justify-around border-2 border border-dashed border-gray-400"
      >
        <input
          v-on:change="(event) => setDataAsset(event, event.target.files[0])"
          class="border z-[1] border-red-400 absolute h-full w-full opacity-0"
          id="data_asset"
          type="file"
          placeholder=""
          accept=".pdf"
          @drop="setDataAsset($event, $event.dataTransfer.files[0])"
          @dragover.prevent
          @drop.prevent
        />
        <div class="flex flex-col">
          <div
            class="h-full text-center text-2xl flex justify-center items-center pt-2"
          >
            <label for="data_asset">
              Upload new PDF via <br />
              drag and drop <br />
              or
              <span
                class="text-blue-500 cursor-pointer underline relative z-[2]"
                >browse</span
              >
            </label>
          </div>
          <p class="mt-6 text-center">
            Your PDF will be previewed in this panel <br />
            for use in preparing your bid response.
            <!-- Accepts PDF, DOCX, and XLXS file formats -->
          </p>
        </div>

        <div class="flex items-center w-full justify-center">
          <div class="h-1 w-1/4 bg-gray-400 opacity-60" />
          <p class="px-6">OR</p>
          <div class="h-1 w-1/4 bg-gray-400 opacity-60" />
        </div>

        <div class="flex flex-col items-center">
          <label class="text-2xl text-gray-600 text-center"
            >Open previous resource</label
          >
          <button
            @click="openAttach"
            class="mt-8 w-3/4 bg-psci relative z-[2] hover:bg-gold text-white hover:text-black py-2 px-3 rounded focus:outline-none focus:shadow-outline"
          >
            Open Resource
          </button>
        </div>
      </div>
    </div>
    <div class="w-full h-full" v-if="state.isLoading">
      <div class="flex w-full h-full !min-h-full justify-center items-center">
        <div
          class="inline-block h-24 w-24 text-purple animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1s_linear_infinite]"
          role="status"
        >
          <span
            class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >Loading...</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
