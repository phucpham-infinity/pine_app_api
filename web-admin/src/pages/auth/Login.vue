<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from '../../components/HelloWorld.vue';
defineProps<{ }>()

const count = ref(0)
</script>

<template >
    <div>
        <HelloWorld msg="Haha" />
        {{ count }}
    </div>
</template>
<style lang="css">
    
</style>