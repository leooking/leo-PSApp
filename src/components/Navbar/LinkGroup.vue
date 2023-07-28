<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useModal } from 'vue-final-modal'
import Modal from '../Modals/Modal.vue'
import GeneratorModal from '../Modals/generatorModal.vue'
import { useRoute } from 'vue-router'

const generator = ref(null)
const route = useRoute()

const props = defineProps({
  name: String,
  links: Array,
  isGenerator: Boolean,
  projects: Array,
  link: String,
  icon: String,
  isExpanded: Boolean,
})

const state = reactive({
  isOpen: false,
})

const { open, close } = useModal({
  component: Modal,
  attrs: {
    generator: generator,
    projectsList: props.projects,
    onClose() {
      close()
    },
  },
  slots: {
    default: GeneratorModal,
  },
})

const setGenerator = (link) => {
  generator.value = link
  open()
}

let timeoutId

const handleMouseLeave = (state) => {
  timeoutId = setTimeout(() => {
    state.isOpen = false
  }, 600)
}

const handleMouseEnter = (state) => {
  emit('cancel-sidebar-close') // For sidebar
  state.isOpen = true
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
}

const router = useRouter()
</script>

<template>
  <div
    class="flex flex-col items-start py-2 w-full"
    @mouseleave="state.isOpen = false"
  >
    <div
      class="flex items-center cursor-pointer justify-start w-full ml-[-10px] w-full item"
    >
      <i
        :class="`${props.icon} mr-2 ml-6 text-xl`"
        v-if="props.icon"
        @click="() => router.push(props.link)"
      ></i>
      <RouterLink :to="props.link" v-if="props.link">
        <h5
          class="text-lg font-bold text-left text-gray-500 w-full item"
          v-if="isExpanded"
        >
          {{ name }}
        </h5>
      </RouterLink>
      <div
        class="flex w-full items-center justify-between"
        @mouseover="state.isOpen = true"
        v-else
      >
        <h5
          class="text-gray-500 text-lg font-bold text-left w-full item"
          v-if="isExpanded"
        >
          {{ name }}
        </h5>

        <div v-if="props.links && isExpanded">
          <i class="pi pi-angle-double-right" v-if="state.isOpen"></i>
          <i class="pi pi-angle-right" v-else></i>
        </div>
      </div>
    </div>
    <div
      class="flex flex-col w-full popup"
      v-if="props?.links && state.isOpen && props.isExpanded"
    >
      <RouterLink
        :class="`flex items-center ml-3 py-1 text-left  ${
          route.fullPath === link.link
            ? 'text-purple font-bold justify-between'
            : 'text-gray-400 hover:text-purple'
        }`"
        :to="link.link"
        :id="link.name"
        v-for="link in props.links"
        v-if="!props.isGenerator"
        >{{ link.name }}
      </RouterLink>
      <div
        class="flex w-full justify-between items-start"
        @click="() => setGenerator(link)"
        v-for="link in props.links"
        v-else
      >
        <p
          :class="`ml-3 py-2 text-left hover:text-purple cursor-pointer ${
            link.scope === 'private' ? 'text-purple' : 'text-gray-400'
          }`"
        >
          {{ link.name }}
        </p>
        <span
          class="material-symbols-outlined text-purple mt-2"
          v-if="link.scope === 'private'"
          >shield_lock</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.popup {
  position: fixed;
  width: auto;
  left: 282px;
  background-color: #fff;
  border: 1px solid lightgray; /* Added border property */
  border-radius: 6px;
  padding: 14px 26px 14px 14px;
}

.item:hover,
.item:hover h5 {
  color: #6366f1;
}
</style>
