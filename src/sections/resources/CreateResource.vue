<script setup>
import { ref, onMounted, reactive, inject } from 'vue'
import toast from '../../lib/toast'
import api, { contentType } from '../../lib/axiosClient'
import { useRouter } from 'vue-router'
import Tag from '../../components/Tag.vue'
import formatName from '../../lib/formatName'
import UploadResource from '../../sections/resources/UploadResource.vue'
import Radio from '../../components/Radio.vue'
const props = defineProps({ isModal: Boolean })

const state = reactive({
  resource: [],
  loading: false,
  available_source_tags: [],
  source_tags: [],
  scope: 'group',
  crawl_max_pages: 'single',
})
const emit = inject('emit')

onMounted(async () => {
  const { resources_tag_list } = await api.get('resources/tag_list')
  state.available_source_tags = resources_tag_list.all_source_tags
})

const router = useRouter()

const resourceName = ref('')
const description = ref('')
const data_asset = ref([])
const source_url = ref('')

const removeTag = (e, available, used, tag, i) => {
  e.preventDefault()
  available.push(tag)
  used.splice(i, 1)
}

const addTag = (e, available, used, tag, i) => {
  e.preventDefault()
  used.push(tag)
  available.splice(i, 1)
}

const createTag = (e) => {
  let val = e.target.value.trim()
  if (val.length > 0) {
    if (e.target.id === 'source') {
      if (state.source_tags.includes(val)) return
      state.source_tags.push(val)
      e.target.value = ''
      console.log(state.source_tags)
    }
  }
}

const handleSubmit = async (e) => {
  e.preventDefault()
  state.loading = true
  const resourceNames = resourceName.value.split(',');
  const formData = new FormData();
  let payload = {}

  try {
    for (let i = 0; i < data_asset.value.length; i++) {
      payload = {
        name: resourceNames[i],
        description: description.value,
        source_list: state.source_tags.join(', '),
        data_asset: data_asset.value[i],
        source_url: source_url.value,
        scope: state.scope,
        crawl_max_pages: state.crawl_max_pages
      };
      formData.append("files[]", data_asset.value[i].file);
      formData.append('payload[]', JSON.stringify(payload));
    }

    const res = await api.post('resources/bulk_upload',formData)

    if (res) {
      resourceName.value = ''
      description.value = ''
      data_asset.value = []
      source_url.value = ''
      state.source_tags = []

      toast.success('Resource(s) created')
      if (props.isModal) emit('confirm', res.pid)
      else router.push({ name: 'resources' })
    }
  } catch (err) {
    toast.error(err.message)
  } finally {
    state.loading = false
  }
}

const setResourceName = (files) => {
  resourceName.value = files.map((asset) => formatName(asset.name)).join(", ");
}

const setDataAsset = (files) => {
  const newAssets = [];
  const fileNames = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileSize = file.size / 1024 / 1024; // in MB

    if (fileSize < 100) {
      const asset = {
        name: formatName(file.name),
        file_link: '',
        file: file
      };
      newAssets.push(asset);
      fileNames.push(formatName(file.name));
    } else {
      toast.error('File size is too large. Please upload a file less than 100MB');
    }
  }
  data_asset.value = newAssets;
  resourceName.value = resourceName.value ? resourceName.value + ', ' + fileNames.join(", ") : fileNames.join(", ");
};

const deleteAsset = (e) => {
  e.preventDefault()
  state.noFile = true
  data_asset.value = []
}

const goBack = () => router.back()
</script>
<template>
  <p class="ml-12 text-gray-600">Choose between an uploaded file or text extracted from one or many pages:</p>
  <form
    class="md:px-5 w-full"
    enctype="multipart/form-data"
    @submit.stop.prevent="handleSubmit"
  >
    <div class="md:px-6 mt-3" v-if="!state.loading">
      <UploadResource
        :data_asset="data_asset"
        :setDataAsset="setDataAsset"
        :setDataAssetName="
          (val) =>
            (data_asset = [{
              name: val,
              file_link: '',
            }])
        "
        :deleteAsset="deleteAsset"
        :source_url="source_url"
        :setSourceUrl="(val) => (source_url = val)"
        :resource="state.resource"
        :crawlMaxPages="state.crawl_max_pages"
        :setCrawlMaxPages="(val) => (state.crawl_max_pages = val)"
        :setResourceName="setResourceName"
      />

      <div class="form-row">
        <div class="w-full">
          <label
            class="block text-gray-700 text-sm font-bold mb-1"
            for="resource_name"
          >
            Name
          </label>
          <input
            v-model="resourceName"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            id="resourceName"
            type="text"
            placeholder="Short and memorable"
          />
          <p class="italic text-s text-gray-500">Let the system set the name when adding multiple files!</p>
        </div>
      </div>

      <div class="form-row">
        <div class="w-full">
          <label
            class="block text-gray-700 text-sm font-bold mb-1"
            for="source_tags"
          >
            Source Tags
          </label>
          <div class="shadow-lg pt-2 pb-4 px-4 bg-gray-100">
            <p class="text-sm text-gray-500">
              Keep track of Resource
              <span class="font-bold text-black">Sources</span>
              by applying tags
            </p>
            <div
              class="flex items-center bg-white border-2 border-gray-300 rounded shadow-md mb-1"
            >
              <div
                v-for="(source_tag, i) in state.source_tags"
                :key="source_tag"
                class="inline-block p-1"
              >
                <Tag
                  :tag="source_tag"
                  :onClick="
                    (e) =>
                      removeTag(
                        e,
                        state.available_source_tags,
                        state.source_tags,
                        source_tag,
                        i
                      )
                  "
                  type="remove"
                />
              </div>
              <input
                id="source"
                type="text"
                placeholder="Enter a Tag"
                class="border-none outline-none p-2 w-full"
                @keydown.enter="createTag"
                @keydown.tab="createTag"
                v-on:blur="createTag"
              />
            </div>
            <div class="flex items-center pt-2 flex-wrap">
              <div
                v-for="(available_source_tag, i) in state.available_source_tags"
                class="inline-block p-1"
                :key="available_source_tag"
              >
                <Tag
                  :tag="available_source_tag"
                  :onClick="
                    (e) =>
                      addTag(
                        e,
                        state.available_source_tags,
                        state.source_tags,
                        available_source_tag,
                        i
                      )
                  "
                  type="add"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="w-full">
          <label
            class="block text-gray-700 text-sm font-bold mb-1"
            for="resource_sharing"
          >
            Resource Sharing
          </label>
          <div class="shadow-lg pt-2 pb-4 px-4 bg-gray-100">
            <p class="text-sm text-gray-500 mb-2">
              How will this resource be shared?
            </p>
            <div class="flex w-full justify-around text-sm">
              <Radio
                :isRequired="true"
                name="I will keep it private"
                value="mine"
                :checked="state.scope === 'mine'"
                :toggle="(val) => (state.scope = val)"
              />
              <Radio
                :isRequired="true"
                name="I will share it"
                value="group"
                :checked="state.scope === 'group'"
                :toggle="(val) => (state.scope = val)"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 w-full">
        <div class="flex flex-row items-center gap-4 w-full mt-4">
          <button
            class="bg-psci hover:bg-gold text-white hover:text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create
          </button>

          <button
            class="bg-slate-200 hover:bg-gold text-dark hover:text-black font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
            type="button"
            :disabled="state.loading"
            v-if="!props.isModal"
            @click="goBack"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <div class="flex w-full justify-center items-center min-h-[500px]" v-else>
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
  </form>
</template>
