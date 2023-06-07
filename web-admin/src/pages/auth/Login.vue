<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth';

const phone = ref('')
const password = ref('')

const store = useAuthStore();

const handleLogin = () => {
    if (!phone.value || !password.value) return
    store.login(phone.value, password.value)
}

</script>

<template >
    <q-layout class="">
        <q-page-container>
            <q-page class="bg-light-green window-height window-width row justify-center items-center">
                <div class="column">
                    <div style="width: 30vw;" class="row">
                        <h5 class="text-h5 text-white q-my-md">PINA WEB ADMIN</h5>
                    </div>
                    <div style="width: 30vw;" class="row">
                        <q-card square bordered class="q-pa-lg full-width shadow-1">
                            <q-card-section>
                                <q-form class="q-gutter-md">
                                    <q-input square filled clearable v-model="phone" label="Phone" />
                                    <q-input square filled clearable v-model="password" type="password" label="Password" />
                                </q-form>
                            </q-card-section>
                            <q-card-actions class="q-px-md">
                                <q-btn @click="handleLogin" :loading="store.isLoading" unelevated color="light-green-7"
                                    size="lg" class="full-width" label="Login" />
                            </q-card-actions>
                            <q-card-section class="text-center q-pa-none">
                                <p class="text-grey-6">Not reigistered? Created an Account</p>
                            </q-card-section>
                        </q-card>
                    </div>
                </div>
            </q-page>
        </q-page-container>
    </q-layout>
</template>
<style lang="css"></style>