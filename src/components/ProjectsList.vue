<script setup>
import { reactive, watch, ref, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import DeletionModal from './Modals/DeletionModal.vue'
import ProjectFormModal from './Modals/ProjectFormModal.vue'
import toast from '../lib/toast'
import { useModal } from 'vue-final-modal'
import Modal from './Modals/Modal.vue'
import { getItem } from '../lib/storage'
import TreeTable from 'primevue/treetable'
import Column from 'primevue/column'
import NewFolderModal from './Modals/NewFolderModal.vue'
import fetchFolders from '../lib/fetchFolders'
import ProgressSpinner from 'primevue/progressspinner'
import ScopeTag from './ScopeTag.vue'
import handleFolder from '../lib/handleFolder'
import handleDelete from '../lib/handleDelete'
import NothingFound from './NothingFound.vue'
import Button from 'primevue/button'
import depthToColor from '../lib/depthToColor'
import api from '@/lib/axiosClient'
import RequestProjectAccessModal from '@/components/Modals/RequestProjectAccessModal.vue'
import { TableDateFormat } from '../lib/formatDate'

const props = defineProps({ projects: Array, folders: Array, scope: String })

const state = reactive({
  project_pid: null,
  project: null,
  projects: props.projects,
  loading: false,
})

const currentUser = getItem('currentUser')
const project_pid = ref(null)
const route = useRoute()

const refresh = async () => {
  const { folders, projects } = await fetchFolders(
    'projects',
    'projects',
    props.scope
  )
  state.projects = projects
  state.folders = folders
  state.folders.sort((a, b) => {
    const dateA = new Date(a.data.updated_at);
    const dateB = new Date(b.data.updated_at);
    return dateA - dateB;
  });
}

const request_access = async (pid) => {
  const data = await api.post('projects/' + pid + '/request_access', {})
  console.log(data)
}

onMounted(async () => {
  state.loading = true
  await refresh()
  state.loading = false
})

const { open: openEdit, close: closeEdit } = useModal({
  component: Modal,
  attrs: {
    parentState: state,
    purpose: 'Edit',
    onClose() {
      state.project = null
      closeEdit()
    },
    async onConfirm() {
      await refresh()
      closeEdit()
    },
  },
  slots: {
    default: ProjectFormModal,
  },
})

const { open: openRequest, close: closeRequest } = useModal({
  component: Modal,
  attrs: {
    parentState: state,
    purpose: 'Request',
    onClose() {
      closeRequest()
    },
    onConfirm() {
      request_access(state.project.pid)
      closeRequest()
    },
  },
  slots: {
    default: RequestProjectAccessModal,
  },
})

const { open: openDelete, close: closeDelete } = useModal({
  component: Modal,
  attrs: {
    name: 'Item',
    onClose() {
      state.project = null
      closeDelete()
    },
    async onConfirm() {
      try {
        await handleDelete(state.project, 'project')
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

const { open: openCreateFolder, close: closeCreateFolder } = useModal({
  component: Modal,
  attrs: {
    purpose: 'Create',
    name: 'project',
    parentState: state,
    type: state.project?.scope,
    onClose() {
      state.project = null
      closeCreateFolder()
    },
    async onConfirm(folder) {
      try {
        await handleFolder(folder, state.project, 'project', props.scope)
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

const EDTTime = (date) => {
  const dt = DateTime.fromISO(date).setZone('America/New_York')
  return dt.toFormat('MM/dd/yyyy HH:mm:ss a') + ' EDT';
}

</script>
<style>
.p-button {
  margin-right: -5px;
  margin-left: -5px;
}
</style>
<template>
  <div class="max-w-[96vw] xl:max-w-[100vw] object-table" v-if="!state.loading">
    <TreeTable :value="state.folders" :resizable-columns="true" column-resize-mode="expand" responsive-layout="scroll"
      :paginator="true" :rows="10" v-if="state.folders?.length > 0">
      <Column field="name" header="Name" expander sortable>
        <template #body="slotProps">
          <div :class="`w-full flex justify-between items-center !h-[65px] ${depthToColor(
            slotProps?.node?.depth
          )}`">
            <RouterLink :to="'/projects/' + slotProps.node.data?.pid" v-if="!slotProps.node.data?.folder_type"
              class="hover:cursor-pointer underline text-ellipsis overflow-hidden">
              <i class="pi pi-briefcase pr-2"></i>
              {{ slotProps.node.data?.name }}
            </RouterLink>
            <div v-else class="text-ellipsis overflow-hidden cursor-not-allowed">
              <i class="pi pi-folder" v-if="slotProps.node.data.folder_type"></i>
              {{ slotProps.node.data?.name }}
            </div>

            <ScopeTag :scope="slotProps.node.data?.scope" />
          </div>
        </template>
      </Column>
      <Column field="updated_at" header="Last Modified" sortable>
        <template #body="slotProps">
          {{ slotProps.node.data?.updated_at && TableDateFormat(slotProps.node.data?.updated_at) }}
        </template>
      </Column>
      <Column field="deadline" header="Deadline" sortable>
        <template #body="slotProps">
          <div class="pl-2 flex justify-between">
            {{
              slotProps.node.data?.deadline
              ? slotProps.node.data?.deadline
              : 'N/A'
            }}
            <div class="flex justify-self-end" v-if="slotProps.node.data?.is_team_member ||
                slotProps.node.data?.folder_type
                ">
              <Button icon="pi pi-file-export" :severity="state.project?.pid === slotProps.node.data.pid
                ? 'warning'
                : 'secondary'
                " rounded text v-tooltip.bottom="slotProps.node.data.folder_type
    ? 'Edit Or Move Folder'
    : 'Move Project Or Create Folder'
    " @click="() => {
    state.project = slotProps.node.data
    openCreateFolder()
  }
    " />

              <Button v-tooltip.bottom="'Edit Project'" icon="pi pi-pencil" text rounded :severity="state.project?.pid === slotProps.node.data.pid
                ? 'warning'
                : 'secondary'
                " @click="() => {
    state.project = slotProps.node.data
    openEdit()
  }
    " v-if="!slotProps.node.data.folder_type" />

              <Button icon="pi pi-trash" :severity="state.project?.pid === slotProps.node.data.pid
                ? 'warning'
                : 'secondary'
                " rounded text v-tooltip.bottom="slotProps.node.data?.folder_type
    ? 'Delete Folder'
    : 'Delete Project'
    " @click="() => {
    state.project = slotProps.node.data
    openDelete()
  }
    " v-if="!slotProps.node.data?.folder_type ||
    slotProps.node?.children?.length === 0
    " />
            </div>
            <a @click="() => {
              state.project = slotProps.node.data
              openRequest()
            }
              " v-else>
              <button class="text-right text-sm font-bold text-gray-500">
                Request Access
              </button>
            </a>
          </div>
        </template>
      </Column>
    </TreeTable>
    <NothingFound name="project" v-else />
  </div>
  <div class="w-full min-h-[50vh] flex justify-center items-center" v-else>
    <ProgressSpinner />
  </div>
</template>
