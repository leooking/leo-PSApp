<script setup>
import 'tw-elements'
import { defineProps, reactive, inject, ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import toast from '../../lib/toast'
import DeletionModal from '../../components/Modals/DeletionModal.vue'
import AttachObjectModal from '../../components/Modals/AttachObjectModal.vue'
import { useModal } from 'vue-final-modal'
import Modal from '../../components/Modals/Modal.vue'
import { getItem } from '../../lib/storage'
import NewFolderModal from '../../components/Modals/NewFolderModal.vue'
import TreeTable from 'primevue/treetable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import ScopeTag from '../../components/ScopeTag.vue'
import handleFolder from '../../lib/handleFolder'
import handleDelete from '../../lib/handleDelete'
import NothingFound from '../../components/NothingFound.vue'
import Button from 'primevue/button'
import formatChecked from '../../lib/formatChecked'
import depthToColor from '../../lib/depthToColor'
import { TableDateFormat } from '../../lib/formatDate'

const props = defineProps({
  project: Object,
  resources: Array,
  folders: Array,
  selectable: Boolean,
  noControls: Boolean,
  tagLimit: Number,
  type: String,
  refresh: Function,
  purpose: String,
  scope: String,
})

const state = reactive({
  resources: [],
  resource_pid: null,
  resource: null,
  checked: [],
  checkedVals: {},
  atLimit: false,
})

const resource_pid = ref(null)
const route = useRoute()
const currentUser = getItem('currentUser')
const modalProps = inject('props')
const emit = inject('emit')

const tagLimit = props.tagLimit ? props.tagLimit : 3

const { open: openAttach, close: closeAttach } = useModal({
  component: Modal,
  attrs: {
    parentState: state,
    name: 'resource',
    onClose() {
      state.resource = null
      closeAttach()
    },
    onConfirm() {
      closeAttach()
      props.refresh()
    },
  },
  slots: {
    default: AttachObjectModal,
  },
})

const { open: openDelete, close: closeDelete } = useModal({
  component: Modal,
  attrs: {
    name: 'Item',
    onClose() {
      state.resource = null
      closeDelete()
    },
    async onConfirm() {
      try {
        await handleDelete(state.resource, 'resource')

        await props.refresh()
      } catch (err) {
        toast.error(err.message)
      }

      closeDelete()
    },
  },
  slots: {
    default: DeletionModal,
  },
})

const { open: openCreateFolder, close: closeCreateFolder } = useModal({
  component: Modal,
  attrs: {
    purpose: state.resource ? 'Update' : 'Create',
    name: 'resource',
    parentState: state,
    type: props.scope,
    onClose() {
      state.resource = null
      closeCreateFolder()
    },
    async onConfirm(folder) {
      try {
        await handleFolder(folder, state.resource, 'resource', props.scope)
        await props.refresh()
        closeCreateFolder()
      } catch (err) {
        toast.error(err.message)
      }
    },
    async onRefresh() {
      await props.refresh()
    },
  },
  slots: {
    default: NewFolderModal,
  },
})

watch(props.folders, (newVal) => {
  state.resources = newVal
})

onMounted(() => {
  if (modalProps?.parentState?.checked && modalProps.parentState?.limit !== 1) {
    state.checked = modalProps.parentState.checkedCache

    if (
      modalProps.parentState.limit &&
      Object.keys(state.checked).length >= modalProps.parentState.limit
    )
      state.atLimit = true
    else state.atLimit = false
  }
})

const getIcon = (item) => {
  let name = item.data_asset_name?.toLowerCase() //* Ensure both png and PNG are handled
  let source_url = item.source_url
  if (item.name) {
    if (name) {
      if (name.includes('.pdf')) return 'pi pi-file-pdf'
      if (name.includes('.doc')) return 'pi pi-file-word'
      if (name.includes('.xls')) return 'pi pi-file-excel'
      if (name.includes('.zip')) return 'pi pi-file-zip'
      if (
        name.includes('.png') ||
        name.includes('.jpg') ||
        name.includes('.jpeg') ||
        name.includes('.gif')
      )
        return 'pi pi-image'
      else return 'pi pi-file'
    } else if (typeof source_url === 'string') return 'pi pi-link'
  }
}

const handleChange = (checked) => {
  const formatted = formatChecked(checked)
  if (
    modalProps.parentState.limit &&
    Object.keys(formatted).length > modalProps.parentState.limit
  ) {
    state.atLimit = true
  } else {
    state.atLimit = false
  }

  if (!state.atLimit) {
    state.checked = checked
    emit('setCurrent', state.checked)
  }
}
</script>
<style>
.p-button {
  margin-right: -5px;
  margin-left: -5px;
}
</style>
<template>
  <div class="w-full" v-if="props.folders?.length > 0">
    <Button icon="pi pi-refresh" :class="`bg-purple absolute bottom-[20%] right-[5%] z-[1000] ${Object.keys(state.checked).length > 0 ? 'opacity-100' : 'opacity-60'
      } transition-all duration-300`" rounded @click="() => {
      modalProps.parentState.checkedCache = {}
      modalProps.parentState.checked = {}
      state.checked = {}
    }
    " v-if="props.selectable" />
    <TreeTable :selectionKeys="state.checked" @update:selection-keys="handleChange" :value="props.folders"
      :resizable-columns="true" :selectionMode="props.selectable && 'checkbox'" responsive-layout="scroll" class="!w-full"
      :paginator="true" :rows="25">
      <Column field="name" header="Name" expander sortable>
        <template class="flex" #body="slotProps">
          <div :class="`w-full flex justify-between items-center !h-[65px] ${depthToColor(
            slotProps?.node?.depth
          )}`">
            <RouterLink :to="'/resources/' + slotProps.node.data.pid" v-if="!slotProps.node.data?.folder_type && props.purpose !== 'premium'
              " class="flex items-center hover:cursor-pointer underline text-ellipsis overflow-hidden"
              :target="props.selectable && '_blank'">
              <span class="!no-underline mr-2">
                <i class="material-icons !text-[22px]" v-if="slotProps.node.data?.data_asset_name
                    ?.toLowerCase()
                    ?.includes('.pptx')
                  ">slideshow</i>
                <i :class="`${getIcon(slotProps.node.data)} `" v-else></i>
              </span>
              {{ slotProps.node.data.name }}
            </RouterLink>
            <div v-else-if="slotProps.node.data.user_pid === currentUser.pid"
              class="text-ellipsis overflow-hidden cursor-not-allowed">
              <i class="pi pi-folder text-xl" v-if="slotProps.node.data?.folder_type"></i>
              {{ slotProps.node.data.name }}
            </div>
            <div v-else class="text-ellipsis overflow-hidden cursor-not-allowed">
              <i class="pi pi-folder text-xl" v-if="slotProps.node.data?.folder_type"></i>
              {{ slotProps.node.data.name }}
            </div>

            <ScopeTag :scope="slotProps.node.data?.scope" v-if="slotProps.node.data?.scope" />
          </div>
        </template>
      </Column>
      <Column field="updated_at" header="Last Modified" sortable v-if="props.purpose !== 'premium'">
        <template #body="slotProps">
          {{ slotProps.node.data?.updated_at && TableDateFormat(slotProps.node.data?.updated_at) }}
        </template>
      </Column>
      <Column field="source_tags" header="Source tags" v-if="props.purpose !== 'premium'">
        <template #body="slotProps">
          <td class="px-2 flex justify-between" v-if="type !== 'external'">
            <div class="flex justify-between items-center">
              <div class="flex inline-flex flex-nowrap overflow-clip">
                <div class="mr-2" v-for="tag in slotProps.node.data.source_tags?.slice(
                  0,
                  tagLimit
                )">
                  <Tag value="New">{{ tag }}</Tag>
                </div>
              </div>
              <i class="text-blue-400 mb-2 material-icons cursor-default md-20"
                v-tooltip.bottom="slotProps.node.data.source_tags.join(', ')"
                v-if="slotProps.node.data.source_tags?.length > tagLimit">
                info
              </i>
            </div>
            <div class="flex justify-between" v-if="!props.noControls &&
              slotProps.node.data.user_pid === currentUser.pid
              ">
              <div class="flex items-end">
                <Button :severity="state.resource?.pid === slotProps.node.data.pid
                    ? 'warning'
                    : 'secondary'
                  " rounded text v-tooltip.bottom="'Manage Attached Projects'" @click="() => {
      state.resource = slotProps.node.data
      openAttach()
    }
    " v-if="slotProps.node.data.projects" :style="{ paddingRight: '0.5rem', paddingLeft: '0.5rem' }">
                  <i class="pi pi-paperclip"></i>
                  <span class="text-sm">({{ slotProps.node.data.projects.length }})</span>
                </Button>

                <Button icon="pi pi-file-export" :severity="state.resource?.pid === slotProps.node.data.pid
                    ? 'warning'
                    : 'secondary'
                  " rounded text v-tooltip.bottom="slotProps.node.data.folder_type
      ? 'Edit Or Move Folder'
      : 'Move Resource Or Create Folder'
    " @click="() => {
      resource_pid = slotProps.node.data.pid
      state.resource = slotProps.node.data
      openCreateFolder()
    }
    " />

                <router-link :to="`/resources/${slotProps.node.data.pid}/edit`" v-if="slotProps.node.data.projects">
                  <Button v-tooltip.bottom="'Edit Resource'" icon="pi pi-pencil" text rounded :severity="state.resource?.pid === slotProps.node.data.pid
                      ? 'warning'
                      : 'secondary'
                    " />
                </router-link>
                <Button icon="pi pi-trash" :severity="state.resource?.pid === slotProps.node.data.pid
                    ? 'warning'
                    : 'secondary'
                  " rounded text v-tooltip.bottom="slotProps.node.data.folder_type
      ? 'Delete Folder'
      : 'Delete Resource'
    " @click="() => {
      state.resource = slotProps.node.data
      openDelete()
    }
    " v-if="!slotProps.node.data?.folder_type ||
    slotProps.node?.children?.length === 0
    " />
              </div>
            </div>
          </td>
        </template>
      </Column>
    </TreeTable>
  </div>
  <NothingFound name="resource" v-else />
</template>
