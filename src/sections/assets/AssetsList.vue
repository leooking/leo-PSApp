<script setup>
import { reactive, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import toast from '../../lib/toast'
import { useModal } from 'vue-final-modal'
import Modal from '../../components/Modals/Modal.vue'
import { getItem } from '../../lib/storage'
import TreeTable from 'primevue/treetable'
import Column from 'primevue/column'
import NewFolderModal from '../../components/Modals/NewFolderModal.vue'
import fetchFolders from '../../lib/fetchFolders'
import ProgressSpinner from 'primevue/progressspinner'
import ScopeTag from '../../components/ScopeTag.vue'
import handleFolder from '../../lib/handleFolder'
import AttachObjectModal from '../../components/Modals/AttachObjectModal.vue'
import NothingFound from '../../components/NothingFound.vue'
import Button from 'primevue/button'
import DeletionModal from '../../components/Modals/DeletionModal.vue'
import handleDelete from '../../lib/handleDelete'
import depthToColor from '../../lib/depthToColor'
import { TableDateFormat } from '../../lib/formatDate'

const props = defineProps({
  projectPid: String,
  scope: String,
  search: String
})

const state = reactive({
  asset_pid: null,
  asset: null,
  assets: [],
  folders: [],
  loading: false,
  scope: props.scope ? props.scope : '',
})

const currentUser = getItem('currentUser')

const refresh = async () => {
  let url 
  if(props.projectPid) url = `assetz?project_pid=${props.projectPid}`
  else if(props.search) url = `assetz?search=${props.search}`
  else url = 'assetz'

  console.log(url, props.search)
  const { folders, assets } = await fetchFolders(url,
    'assets',
    state.scope
  )
  state.assets = assets
  state.folders = folders

  state.folders.sort((a, b) => {
    const dateA = new Date(a.data.last_interaction_at);
    const dateB = new Date(b.data.last_interaction_at);
    return dateA - dateB;
  });

  // console.log(folders, state.scope)
}

onMounted(async () => {
  state.loading = true
  await refresh()
  state.loading = false
})

const { open: openCreateFolder, close: closeCreateFolder } = useModal({
  component: Modal,
  attrs: {
    purpose: 'Create',
    name: 'asset',
    parentState: state,
    type: state.scope,
    onClose() {
      state.asset = null
      closeCreateFolder()
    },
    async onConfirm(folder) {
      try {
        await handleFolder(folder, state.asset, 'asset', state.scope)
        await refresh()
        closeCreateFolder()
      } catch (err) {
        toast.error(err.message)
      }
    },
    async onRefresh() {
      await refresh()
    },
  },
  slots: {
    default: NewFolderModal,
  },
})

const { open: openDelete, close: closeDelete } = useModal({
  component: Modal,
  attrs: {
    name: 'Item',
    onClose() {
      state.asset = null
      closeDelete()
    },
    async onConfirm() {
      try {
        await handleDelete(state.asset, 'asset')
        await refresh()
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

const { open: openAttach, close: closeAttach } = useModal({
  component: Modal,
  attrs: {
    parentState: state,
    name: 'asset',
    onClose() {
      state.asset = null
      closeAttach()
    },
    onConfirm() {
      closeAttach()
      refresh()
    },
  },
  slots: {
    default: AttachObjectModal,
  },
})
</script>
<style>
.p-button {
  margin-right: -5px;
  margin-left: -5px;
}
</style>
<template>
  <div class="object-table" v-if="!state.loading">
    <TreeTable
      :value="state.folders"
      :resizable-columns="true"
      :loading="state.loading"
      responsive-layout="scroll"
      :paginator="true"
      :rows="25"
      v-if="state.folders.length > 0"
    >
      <Column field="name" header="Name" expander sortable>
        <template #body="slotProps">
          <div
            :class="`w-full flex justify-between items-center !h-[65px] ${depthToColor(
              slotProps?.node?.depth
            )}`"
          >
            <RouterLink
              :to="'/assets/' + slotProps.node.data?.pid"
              v-if="!slotProps.node.data?.folder_type"
              class="hover:cursor-pointer underline text-ellipsis overflow-hidden"
            >
              <i class="pi pi-box pr-2"></i>
              {{ slotProps.node.data?.name }}
            </RouterLink>
            <div
              v-else
              class="text-ellipsis overflow-hidden cursor-not-allowed"
            >
              <i
                class="pi pi-folder text-xl"
                v-if="slotProps.node.data.folder_type"
              ></i>
              {{ slotProps.node.data?.name }}
            </div>

            <ScopeTag :scope="slotProps.node.data?.scope" />
          </div>
        </template>
      </Column>
      <Column field="last_interaction_at" header="Last Updated" sortable>
        <template #body="slotProps">
          {{ slotProps.node.data?.last_interaction_at && TableDateFormat(slotProps.node.data?.last_interaction_at) }}
        </template>
      </Column>
      <Column field="generator_name" header="Generator" sortable />
      <Column field="interactions_count" header="Interactions" sortable>
        <template #body="slotProps">
          <div class="px-2 flex w-full justify-between">
            {{ slotProps.node.data?.interactions_count }}
            <div />
            <div
              class="flex justify-self-end"
              v-if="slotProps.node.data?.user_pid === currentUser.pid"
            >
              <Button
                :severity="
                  state.asset?.pid === slotProps.node.data.pid
                    ? 'warning'
                    : 'secondary'
                "
                rounded
                text
                v-tooltip.bottom="'Manage Attached Projects'"
                @click="
                  () => {
                    state.asset = slotProps.node.data
                    openAttach()
                  }
                "
                v-if="slotProps.node.data.projects"
                :style="{ paddingRight: '0.5rem', paddingLeft: '0.5rem' }"
              >
                <i class="pi pi-paperclip"></i>
                <span class="text-sm"
                  >({{ slotProps.node.data.projects.length }})</span
                >
              </Button>

              <Button
                icon="pi pi-file-export"
                :severity="
                  state.asset?.pid === slotProps.node.data.pid
                    ? 'warning'
                    : 'secondary'
                "
                rounded
                text
                v-tooltip.bottom="
                  slotProps.node.data.folder_type
                    ? 'Edit Or Move Folder'
                    : 'Move Asset Or Create Folder'
                "
                @click="
                  () => {
                    state.asset = slotProps.node.data
                    openCreateFolder()
                  }
                "
              />

              <Button
                icon="pi pi-trash"
                :severity="
                  state.asset?.pid === slotProps.node.data.pid
                    ? 'warning'
                    : 'secondary'
                "
                rounded
                text
                v-tooltip.bottom="'Delete Folder'"
                @click="
                  () => {
                    state.asset = slotProps.node.data
                    openDelete()
                  }
                "
                v-if="
                  slotProps.node.data?.folder_type &&
                  slotProps.node?.children?.length === 0
                "
              />
            </div>
          </div>
        </template>
      </Column>
    </TreeTable>
    <NothingFound name="asset" v-else />
  </div>
  <div class="w-full min-h-[50vh] flex justify-center items-center" v-else>
    <ProgressSpinner />
  </div>
</template>
