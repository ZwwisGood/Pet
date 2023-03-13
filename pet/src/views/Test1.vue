<template>
    <div>
        <h1>Test1</h1>
        <h2>location: {{userLocation}}</h2><input type="text" v-model="userLocation">
        <h2>geolocation: {{userGeolocation}}</h2>
    </div>
</template>
<script>
import { inject } from 'vue'

export default {
    setup() {
        const userLocation = inject('location', 'The Universe')
        const userGeolocation = inject('geolocation')
        console.log(userLocation);
        // setInterval(() => {
        //     console.log(userLocation.value);
        // }, 3000)
        return {
            userLocation,
            userGeolocation
        }
    }
}
</script>