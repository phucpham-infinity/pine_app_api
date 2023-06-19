<template >
    <div>
        <q-table :filter="filter" :loading="store.isLoading" :rows-per-page-options="[500]" title="Pending Users"
            :rows="store.data" :columns="columns" row-key="name">
            <template v-slot:top-right>
                <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                    <template v-slot:append>
                        <q-icon name="search"></q-icon>
                    </template>
                </q-input>
            </template>
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td key="userEmail" :props="props">
                        {{ props.row.userEmail }}
                    </q-td>
                    <q-td key="companyName" :props="props">
                        {{ props.row.companyName }}
                    </q-td>
                    <q-td key="companyEmail" :props="props">
                        {{ props.row.companyEmail }}
                    </q-td>
                    <q-td key="licenseNo" :props="props">
                        {{ props.row.licenseNo }}
                    </q-td>
                    <q-td key="registerNo" :props="props">
                        {{ props.row.registerNo }}
                    </q-td>
                    <q-td key="status" :props="props">
                        <q-badge v-if="props.row.status === 'APPROVAL'" color="green">
                            {{ props.row.status }}
                        </q-badge>
                        <q-badge v-else>
                            {{ props.row.status }}
                        </q-badge>
                    </q-td>
                    <q-td key="actions" :props="props">
                        <q-btn
                            @click="handleApproval({ email: props.row.userEmail, companyName: props.row.companyName, userId: props.row.userId })"
                            v-if="props.row.status === 'PENDING'" color="primary" label="APPROVAL" />
                    </q-td>
                </q-tr>
            </template>
        </q-table>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserRequestStore } from '../../stores/user-request';

const store = useUserRequestStore();


const handleApproval = ({ email, userId, companyName }: { email: string, companyName: string, userId: string }) => {
    store.approvalRequest({ email, userId, companyName }).then(() => {
        filter.value = '';
    })
}

const filter = ref('');

onMounted(() => {
    store.getUserRequest().then(() => {
        filter.value = ''
    })
})

const columns = [
    { name: 'userEmail', label: 'User Email', field: 'userEmail' },
    { name: 'companyName', label: 'Company Name', field: 'companyName' },
    { name: 'companyEmail', label: 'Company Email', field: 'companyEmail' },
    { name: 'licenseNo', label: 'License No', field: 'licenseNo' },
    { name: 'registerNo', label: 'Register No', field: 'registerNo' },
    { name: 'status', label: 'Status', field: 'status' },
    { name: 'actions', label: 'Actions', field: 'actions' },
]

</script>

<style lang="css"></style>