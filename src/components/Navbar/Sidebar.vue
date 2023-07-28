<script setup>
import { onMounted, reactive, ref } from 'vue'
import api from '../../lib/axiosClient'
import LinkGroup from './LinkGroup.vue'
import Button from 'primevue/button'

const props = defineProps({ isOpen: Boolean, isLocked: Boolean })

const state = reactive({
  generators: [],
})

let isOpen = ref(props.isOpen)
let isLocked = ref(props.isLocked)

onMounted(async () => {
  try {
    const res = await api.get('generators')
    state.generators = res.private_generators
      ? [...res.private_generators, ...res.generators]
      : res.generators
  } catch (error) {
    console.log(error)
  }
})

let timeoutId
let timeoutId2

const delayedClose = () => {
  if (timeoutId2) clearTimeout(timeoutId2)

  if (!isLocked.value) {
    timeoutId = setTimeout(() => {
      isOpen.value = false
    }, 600)
  }
}

const handleMouseEnter = () => {
  timeoutId2 = setTimeout(() => {
    isOpen.value = true
  }, 1000)
}

const cancelDelayedClose = () => {
  if (timeoutId) clearTimeout(timeoutId)
}
</script>
<style>
.animate {
  animation: slideToRight 0.5s ease-out;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s ease-out;
}

.slide-right-enter,
.slide-right-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-to,
.slide-right-leave {
  transform: translateX(0);
}

@keyframes slideToRight {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

.transition-width {
  transition: width 0.5s ease-out;
}
</style>
<template>
  <Transition name="slide-right">
    <nav
      @mouseenter="isOpen = true"
      @mouseleave="isOpen = false"
      :class="[
        'scrollable-nav absolute text-gray-400 flex flex-col items-start px-4 pt-4 pb-20 left-0 top-0 bg-white h-[100vh] border-r-2 border-b-2 border-gray-400 transition-width',
        isOpen ? 'w-[304px]' : 'w-[74px]',
      ]"
    >
      <RouterLink to="/" class="w-full !no-underline">
        <div
          class="flex cursor-pointer justify-start items-center w-full ml-[-10px] mb-2 item"
        >
          <i class="pi pi-home mr-2 ml-[24px] text-xl"></i>
          <h5 class="text-gray-500 text-lg font-bold text-left" v-if="isOpen">
            Dashboard
          </h5>
        </div>
      </RouterLink>

      <LinkGroup
        name="Generators"
        :links="state.generators"
        :isGenerator="true"
        :isExpanded="isOpen"
        icon="pi pi-bolt"
      />
      <LinkGroup
        name="Files"
        :links="[
          {
            link: '/assets',
            name: 'Assets',
          },
          {
            link: '/resources',
            name: 'Resources',
          },
          {
            link: '/resources/new',
            name: 'Upload Resources',
          },
        ]"
        :isExpanded="isOpen"
        icon="pi pi-file"
        @cancel-sidebar-close="cancelDelayedClose"
      />
      <LinkGroup
        name="Projects"
        link="/projects"
        icon="pi pi-briefcase"
        :isExpanded="isOpen"
        @iconClicked="isOpen = true"
      />
      <LinkGroup
        name="Opportunity Search (BETA)"
        icon="pi pi-search"
        link="/opportunity-search"
        :isExpanded="isOpen"
      />
      <LinkGroup
        name="Agency Insights (BETA)"
        icon="pi pi-book"
        link="/agencies"
        :isExpanded="isOpen"
      />
      <RouterLink to="/settings" class="mt-auto pt-4 w-full !no-underline">
        <div
          class="flex cursor-pointer justify-start items-center w-full ml-[-10px] mb-2 item"
        >
          <i class="pi pi-cog mr-2 ml-[24px] text-xl"></i>
          <h5 class="text-gray-500 text-lg font-bold text-left" v-if="isOpen">
            Settings
          </h5>
        </div>
      </RouterLink>
    </nav>
  </Transition>
</template>

<style scoped>
.scrollable-nav {
  position: fixed;
  overflow: hidden;
  scrollbar-width: none; /* For Firefox */
  -ms-overflow-style: none; /* For Internet Explorer and Edge */
}

.scrollable-nav::-webkit-scrollbar {
  display: none; /* For Chrome, Safari and Opera */
}

.transition-width {
  transition: width 0.1s ease-out;
}

.item:hover,
.item:hover h5 {
  color: #6366f1;
}
</style>
