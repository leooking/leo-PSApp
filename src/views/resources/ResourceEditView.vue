<script setup>
import { onMounted, reactive, ref } from 'vue'
import toast from '../../lib/toast'
import api, { contentType } from '../../lib/axiosClient'
import { useRouter, useRoute } from 'vue-router'
import Tag from '../../components/Tag.vue'
import UploadResource from '../../sections/resources/UploadResource.vue'
import Radio from '../../components/Radio.vue'

const state = reactive({
  resource: {},
  loading: true,
  available_source_tags: [],
  available_type_tags: [],
  source_tags: [],
  type_tags: [],
  noFile: false,
})

const router = useRouter()
const route = useRoute()

const resourceName = ref('')
const description = ref('')
const data_asset_name = ref('')
const data_asset = ref(null)
const source_url = ref('')
const scope = ref('')

onMounted(async () => {
  try {
    const resource = await api.get('resources/' + route.params.pid)

    state.resource = resource

    resourceName.value = resource.name
    description.value = resource.description
    state.source_tags = resource.source_tags
    state.available_source_tags = resource.available_source_tags
    source_url.value = resource.source_url
    scope.value = resource.scope
    data_asset.value = {
      name: resource.data_asset_name,
      file_link: resource.file_link,
    }
    console.log(scope.value, '+++')
  } catch (err) {
    toast.error(err.message)
  } finally {
    state.loading = false
  }
})

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
      else if (state.available_source_tags.includes(val)) {
        state.source_tags.push(val)
        state.available_source_tags.splice(
          state.available_source_tags.indexOf(val),
          1
        )
        e.target.value = ''
      } else {
        state.source_tags.push(val)
        e.target.value = ''
      }
    }
  }
}

const handleSubmit = async () => {
  state.loading = true
  try {
    const payload = {
      name: resourceName.value,
      description: description.value,
      // TODO talk to JK about replacing this join hack
      source_list: state.source_tags.join(', '),
      data_asset: data_asset.value,
      source_url: source_url.value,
      scope: state.scope,
      // do not return data_asset_name
    }

    if (!data_asset?.value?.size && !state.noFile) {
      delete payload.data_asset
    }
    if (source_url.value) payload.source_url = source_url.value

    console.log(data_asset.value, payload.source_ur)
    if (!data_asset.value && !payload.source_url) {
      toast.error('Please upload a file or provide a source URL')
      return
    }

    if (data_asset.value || state.noFile) contentType('multipart/form-data')
    const res = await api.put('resources/' + route.params.pid, payload)
    if (res) {
      toast.success('Resource edited')
      router.push('/resources')
    }
  } catch (err) {
    toast.error(err.message)
  } finally {
    state.loading = false
  }
}

const setDataAsset = (file) => {
  const fileSize = file.size / 1024 / 1024 // in MB
  if (fileSize < 100) {
    data_asset.value = file
    if (!resourceName.value) resourceName.value = formatName(file.name)
  } else
    toast.error('File size is too large. Please upload a file less than 100MB')
}

const deleteAsset = (e) => {
  e.preventDefault()
  state.noFile = true
  data_asset.value = null
  data_asset_name.value = ''
}
</script>
<style>
.dot {
  height: 10px;
  width: 10px;
  background-color: #bbb;
  border-radius: 50%;
}
</style>
<template>
  <div class="mb-6 flex flex-row">
    <div class="mr-4 flex items-center md:ml-12">
      <h2>Edit Resource</h2>
    </div>
  </div>

  <form class="md:px-5 w-full" @submit.stop.prevent="handleSubmit">
    <div class="md:px-6 mt-3" v-if="!state.loading">
      <UploadResource
        :data_asset="data_asset"
        :setDataAsset="setDataAsset"
        :setDataAssetName="
          (val) =>
            (data_asset = {
              name: val,
              file_link: '',
            })
        "
        :deleteAsset="deleteAsset"
        :source_url="source_url"
        :setSourceUrl="(val) => (source_url = val)"
        :resource="state.resource"
      />
      <div class="form-row">
        <div class="w-full">
          <label class="block text-gray-700 text-sm font-bold mb-1" for="name">
            Name
          </label>
          <input
            v-model="resourceName"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            id="resourceName"
            type="text"
            placeholder="Short and memorable"
            @keydown.enter="(e) => e.preventDefault()"
          />
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
            <div class="flex items-center pt-2">
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
              <!-- <div class="ml-2 flex justify-between w-[50px] items-center">
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                </div> -->
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
                :checked="scope === 'mine'"
                :toggle="(val) => (state.scope = val)"
              />
              <Radio
                :isRequired="true"
                name="I will share it"
                value="group"
                :checked="scope === 'group'"
                :toggle="(val) => (state.scope = val)"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-2 w-full">
        <div class="flex flex-row items-center gap-4 w-full mt-4">
          <button
            class="bg-psci hover:bg-gold text-white hover:text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            :disabled="state.loading"
          >
            Submit Changes
          </button>

          <button
            class="bg-slate-200 hover:bg-gold text-dark hover:text-black font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            <RouterLink to="/resources">Cancel</RouterLink>
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
