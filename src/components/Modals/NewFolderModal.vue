<script setup>
import { inject, reactive, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import Radio from '../Radio.vue'
import api from '../../lib/axiosClient'
import toast from '../../lib/toast'
import Dropdown from 'primevue/dropdown'
import handleDefolder from '../../lib/handleDefolder'

const props = inject('props')
const emit = inject('emit')
const route = useRoute()

const state = reactive({
  isLoading: false,
  name: '',
  scope: props.parentState[props.name]?.scope || 'group',
  folder: null,
  options: [],
  isEdit: false,
})

const defolder = async () => {
  await handleDefolder(props.parentState[props.name], props.name)
  emit('refresh')
  emit('close')
}

onMounted(async () => {
  state.isLoading = true

  if (props.parentState[props.name]?.folder_type) {
    state.name = props.parentState[props.name].name
    state.scope = props.parentState[props.name].scope
    state.isEdit = true
  }
  try {
    const { folders } = await api.get(`folders`)

    state.options = folders
      .map((folder) => {
        console.log(folder, state.scope)
        if (
          folder.folder_type === props.name &&
          folder.scope === state.scope &&
          folder.pid !== props.parentState[props.name]?.pid
        )
          return {
            name: folder.name,
            value: folder.pid,
          }
      })
      .filter((folder) => !!folder)
  } catch (err) {
    toast.error(err)
  } finally {
    state.isLoading = false
  }
})

const getNameCopy = () => {
  if (state.isEdit) return 'Edit Folder Name'
  else if (props.purpose === 'CreateNew') return 'Create New Folder'
  else return 'Move to New Folder'
}
onUnmounted(() => {
  state.name = ''
  state.scope = ''
  state.folder = null
})
</script>
<template>
  <div class="modal-body p-2">
    <p
      class="ml-[-9px] mt-[-18px] mb-4 text-sm font-bold"
      v-if="props.purpose !== 'CreateNew'"
    >
      Organize this {{ state.isEdit ? 'folder' : props.name.toLowerCase() }} by
      moving it to a folder
    </p>
    <form class="md:px-5 w-full" @submit.stop.prevent="emit('confirm', state)">
      <div class="form-row">
        <div class="w-full" v-if="props.purpose !== 'CreateNew'">
          <label class="block text-gray-500 text-sm font-bold mb-1" for="name">
            Move to existing folder
          </label>
          <Dropdown
            v-model="state.folder"
            :options="state.options"
            optionLabel="name"
            :loading="state.isLoading"
            placeholder="Select a folder"
            class="w-full"
            :showClear="true"
            :disabled="!!state.name && !state.isEdit"
            :style="{
              height: '40px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }"
          />
        </div>
        <div class="w-full">
          <label class="block text-gray-500 text-sm font-bold mb-1" for="name">
            {{ getNameCopy() }}
          </label>
          <input
            v-model="state.name"
            class="disabled:opacity-50 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            :required="!state.folder"
            id="name"
            type="text"
            placeholder="Give it a name"
            :disabled="state.folder"
          />
        </div>
      </div>

      <div
        class="form-row mt-8"
        v-if="!props.type && !props.parentState[props.name]?.scope"
      >
        <div class="w-full">
          <label
            class="block text-gray-500 text-sm font-bold mb-1"
            for="resource_sharing"
          >
            How will this
            {{ state.isEdit ? 'folder' : props.name.toLowerCase() }} be shared?
          </label>
          <div class="pt-2 pb-4 px-4">
            <div
              class="flex w-full justify-around text-sm"
              :style="{ opacity: state.folder && 0.5 }"
            >
              <Radio
                :isRequired="true"
                name="I will keep it private"
                value="mine"
                :checked="scope === 'mine'"
                :toggle="(val) => (state.scope = val)"
                :isDisabled="state.folder"
              />
              <Radio
                :isRequired="true"
                name="I will share it"
                value="group"
                :checked="scope === 'group'"
                :toggle="(val) => (state.scope = val)"
                :isDisabled="state.folder"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-2 w-full flex justify-between items-end">
        <div class="flex flex-row items-center gap-4 w-full mt-4">
          <button
            class="bg-psci hover:bg-gold text-white hover:text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            id="submit"
            :disabled="state.isLoading"
          >
            {{
              state.folder || props.parentState[props.name]
                ? 'Update'
                : 'Create'
            }}
          </button>

          <button
            class="bg-slate-200 hover:bg-gold text-dark hover:text-black font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
            type="button"
            @click="emit('close')"
          >
            Cancel
          </button>
        </div>
        <p
          v-tooltip.bottom="
            `Remove this ${props.name} from all folders. This will not delete the ${props.name}`
          "
          class="max-h-[40px] cursor-pointer underline whitespace-nowrap text-xs hover:text-red-600 text-grey-300 font-bold rounded focus:outline-none focus:shadow-outline"
          @click="defolder"
          v-if="!!props.parentState[props.name]?.folder?.pid"
        >
          Detach from folders
        </p>
      </div>
    </form>
  </div>
</template>
