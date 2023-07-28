<script setup>
import { ref } from 'vue'
import Menu from 'primevue/menu'
import Avatar from 'primevue/avatar'

import user from '../../lib/user'
import { auth0Logout } from '../../lib/authService'
import { getItem } from '../../lib/storage'


const items = ref([
    {
        label: 'Settings',
        icon: 'pi pi-cog',
        url: '/settings'
    },
    {
        label: 'Log out',
        icon: 'pi pi-sign-out',
        command: () => {
            logout()
        }
    }
])

const menuRef = ref(null)
const fileInput = ref(null)

async function logout() {
    if (getItem('auth0Idtok')) {
        await auth0Logout()
    }
    await user.signOut()
    if (window.location.pathname === '/') router.go()
}

const uploadAction = () => {
    fileInput.value.click();
};


const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        // Perform upload logic with selected image file
        console.log("Selected image file:", file);
    } else {
        console.log("Please select a valid image file.");
    }
}

const toggle = (e) => menuRef.value.toggle(e)

</script>

<template>
    <div class="user-settings cursor-pointer">
        <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none" />
        <Avatar class="cursor-pointer bg-gray-400" icon="pi pi-user" size="small" shape="circle" @click="uploadAction"
            @mouseenter="toggle" />
        <Menu ref="menuRef" class="user-settings" :model="items" :activeItem="null" :popup="true" :style="{
            border: 'none',
            paddingTop: 0,
            paddingBottom: 0,
            overflow: 'auto',
        }">
        </Menu>
    </div>
</template>
