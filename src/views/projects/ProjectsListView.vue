<script setup>
import { ref } from 'vue'
import { useModal } from 'vue-final-modal'
import Modal from '../../components/Modals/Modal.vue'
import ProjectFormModal from '../../components/Modals/ProjectFormModal.vue'
import ProjectsList from '../../components/ProjectsList.vue'
import { useRoute } from 'vue-router'
import NewFolderBtn from '../../components/NewFolderBtn.vue'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

const props = defineProps({ project: Object })
const route = useRoute()
const rerender = ref(0)

const { open, close } = useModal({
  component: Modal,
  attrs: {
    purpose: 'Create',
    clearCurrent: () => {},
    onClose() {
      close()
    },
    onConfirm() {
      rerender.value = rerender.value + 1
      close()
    },
  },
  slots: {
    default: ProjectFormModal,
  },
})
</script>

<template>
  <div class="object-page">
    <div class="flex justify-between items-center mb-4 mt-2">
      <h2>Projects</h2>
      <div class="flex items-center">
        <NewFolderBtn
          type="project"
          :updateList="() => (rerender = rerender + 1)"
        />
        <button
          class="h-[48px] bg-psci hover:bg-gold text-white hover:text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          @click="open"
          type="button"
          id="create-project"
        >
          New Project
        </button>
      </div>
    </div>

    <TabView>
      <TabPanel header="All">
        <div :key="rerender">
          <ProjectsList scope="" />
        </div>
      </TabPanel>
      <TabPanel header="Private">
        <div :key="rerender">
          <ProjectsList scope="private" />
        </div>
      </TabPanel>
      <TabPanel header="Shared">
        <div :key="rerender">
          <ProjectsList scope="shared" />
        </div>
      </TabPanel>
    </TabView>
  </div>
</template>
