<template>
    <Test1></Test1>
    <button @click="updateLocation">改变location</button>
    <h1>Test</h1>
    <h2>location: {{location}}</h2>
    <h2>geolocation: {{geolocation}}</h2>
</template>
    
<script setup>
import {
    provide,
    ref,
    reactive,
    readonly
} from 'vue'
// 引入组件
import Test1 from './Test1.vue'
const location = ref('北京')
const geolocation = reactive({
    longitude: 90,
    latitude: 135
})
const updateLocation = () => {
    location.value = '上海'
}
provide('location', readonly(location));
provide('geolocation', geolocation);

</script>