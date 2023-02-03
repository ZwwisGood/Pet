<template>
    <div>
        <!--地区选择器-->
        <elui-china-area-dht @change="onChange"></elui-china-area-dht>
    </div>
</template>
   
<script>
import { EluiChinaAreaDht } from 'elui-china-area-dht'

export default {
    name: 'Help',
    components: {
        EluiChinaAreaDht
    },
    data() {
        return {
            chinaData: []
        }
    },
    methods: {
        onChange(e) {
            console.log(e);
            const province = this.chinaData[e[0]]
            const city = this.chinaData[e[1]]
            const area = this.chinaData[e[2]]
            console.log(province.label, city.label, area.label)
        }
    },
    mounted() {
        const chinaData = new EluiChinaAreaDht.ChinaArea().chinaAreaflat
        this.chinaData = chinaData
    }
}
</script>

<style scoped>

</style>