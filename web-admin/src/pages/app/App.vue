<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth';
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const router = useRouter();
const store = useAuthStore();
const { user } = storeToRefs(store)
const leftDrawerOpen = ref(false)
const toggleLeftDrawer = () => leftDrawerOpen.value = !leftDrawerOpen.value

onMounted(() => {
    store.getMe()
})


const handleToMenu = (menu: number) => {
    switch (menu) {
        case 1:
            router.push({ path: '/user-request' })
            break;

        default:
            break;
    }
}

</script>

<template>
    <q-layout view="hHh lpR fFf">
        <q-header elevated class="bg-primary text-white">
            <q-toolbar>
                <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

                <q-toolbar-title>
                    <q-avatar>
                        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
                    </q-avatar>
                    ADMIN APP
                </q-toolbar-title>
            </q-toolbar>
        </q-header>
        <q-drawer :width="250" show-if-above v-model="leftDrawerOpen" side="left" bordered>
            <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
                <q-list padding>
                    <q-item clickable v-ripple>
                        <q-item-section avatar>
                            <q-icon name="inbox" />
                        </q-item-section>

                        <q-item-section @click="handleToMenu(1)">
                            User Request
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-scroll-area>

            <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
                <div class="absolute-bottom bg-transparent">
                    <q-avatar size="56px" class="q-mb-sm">
                        <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                    </q-avatar>
                    <div class="text-weight-bold"> {{ user?.profile?.firstName }} {{ user?.profile?.lastName }}</div>
                    <div>@{{ user?.phone }}</div>
                </div>
            </q-img>
        </q-drawer>

        <q-page-container>
            <div class="p-8">
                <router-view />
            </div>
        </q-page-container>

        <q-inner-loading :showing="store.isLoading" label="Please wait..." label-class="text-teal"
            label-style="font-size: 1.1em" />
    </q-layout>
</template>

<style lang="css"></style>