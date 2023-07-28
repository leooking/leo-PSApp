<script setup>
import { RouterView } from 'vue-router'
import Toast from './components/Toast.vue'
import TopNav from './components/Navbar/TopNav.vue'
import router from './router'
import 'vue-final-modal/style.css'
import { ModalsContainer } from 'vue-final-modal'
import saveLastPage from './lib/saveLastPage'
import user, { userEvent } from '@/lib/user'
import { ref } from 'vue'

router.afterEach(() => {
  window.Intercom('update', {
    last_request_at: parseInt(new Date().getTime() / 1000),
    page: window.location.pathname === '/' ? 'home' : window.location.pathname,
  })

  // saveLastPage()
})

let signedIn = ref(user?.signedIn)

userEvent.on('signIn', () => (signedIn.value = true))
userEvent.on('signOut', () => (signedIn.value = false))
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
<style src="primevue/resources/themes/lara-light-indigo/theme.css"></style>
<style src="primevue/resources/primevue.min.css"></style>
<style src="primeicons/primeicons.css"></style>
<style global>
body,
html {
  scrollbar-width: none !important;
}
html::-webkit-scrollbar {
  display: none !important;
}

.dot {
  height: 5px;
  width: 5px;
  border-radius: 50%;
  background-color: #000;
  animation: blink 1s linear infinite;
  margin-left: 5px;
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.p-sortable-column-icon {
  color: #fff !important;
}

.p-progress-spinner-circle {
  stroke: #6557f5 !important;
}
th {
  background: black !important;
  color: white !important;
}
tr td:first-child {
  width: 100% !important;
  display: flex !important;
  align-items: center !important;
}

table td,
table th {
  min-width: 250px !important;
}

td {
  position: relative !important;
}

.p-tooltip * {
  text-align: center !important;
  max-width: 400px !important;
}

.object-table tr,
.object-table td {
  height: 65px !important;
  max-height: 65px !important;
}
.object-table td {
  padding: 0 0.5rem !important;
  height: 65px !important;
  max-height: 65px !important;
}

.p-treetable .p-treetable-tbody > tr:focus {
  outline: none !important;
}

.object-page .p-tabview-header,
.object-page .p-tabview-nav-link {
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
}
.object-page .p-tabview-panels {
  padding: 0;
}
</style>
<template>
  <content class="flex flex-col min-h-screen max-w-screen overflow-hidden">
    <TopNav />

    <main
      :class="{
        'bg-slate-200 p-4 flex-1 overflow-hidden w-[calc(100vw-74px)] ml-[74px]':
          signedIn,
        'bg-slate-200 p-4 flex-1 overflow-hidden': !signedIn,
      }"
    >
      <!-- Comment this out for maintenance mode -->
      <RouterView />

      <!-- See also refreshToken.js -->
      <!-- Remove comment on this for maintenance mode -->
      <!-- <div class="p4 mt-12 text-center">
        <h1>Planned maintenance is underway.</h1>
        <p>The service will return soon.</p>
      </div> -->
    </main>

    <footer
      :class="{
        'flex justify-between items-center ml-[74px]': signedIn,
        'flex justify-between items-center': !signedIn,
      }"
    >
      <h4 class="text-gray-600 text-base">Copyright 2023 ©</h4>
      <h4 class="text-center">Procurement Sciences, Inc.</h4>
      <h4 class="text-gray-600 text-base">Official Use Only</h4>
    </footer>

    <Toast />
    <ModalsContainer />
  </content>
</template>

<style>
@import '@/assets/main.css';
@import 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0';
@import 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';

header {
  display: flex;
  align-items: center;
  background-color: #000000;
  padding: 1rem;
}

nav {
  width: 100%;
  text-align: right;
  color: #ffffff;
}

/* main {
    background-color: #f1f1f1;
    padding: 1rem;
    padding-bottom: 2rem;
    flex: 1;
  } */

footer {
  flex-shrink: 0;
  padding: 1rem;
  background-color: #c1c1c1;
}
</style>
