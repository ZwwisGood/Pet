<template>
    <div id="nav" class="container clearfix">
        <img src="../assets/images/logo.jpeg">
        <span class="title">乐宠网</span>
        <ul class="fr clearfix">
            <li><el-button size="large" :class="{ active: btnNum == 1 }" @click="btnClick(1)">首页</el-button></li>
            <li><el-button size="large" :class="{ active: btnNum == 2 }" @click="btnClick(2)">关于我们</el-button></li>
            <li><el-button size="large" :class="{ active: btnNum == 3 }" @click="btnClick(3)">产品展示</el-button></li>
            <li><el-button size="large" :class="{ active: btnNum == 4 }" @click="btnClick(4)">新闻动态</el-button></li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'Menu',
    data() {
        return {
            btnNum: 1
        }
    },
    methods: {
        btnClick(num) {
            this.btnNum = num;
        }
    }
}
</script>

<style lang="scss" scoped>
@import url('../assets/css/common.css');
@import url('../assets/css/reset.css');
@import url('../assets/css/index.css');


.el-button {
    border: none;
}
.active {
    color: black;
    border: none;
    border-bottom: 1px solid black;
    background-color: #ecf5ff;
}

#nav {
    img {
        width: 100px;
        height: 100px;
        vertical-align: top;
    }

    .title {
        font-size: 32px;
        // 书法字
        font-family: 'SimHei';
        font-weight: 700;
        color: #333;
        margin-top: 10px;
        cursor: default;
    }
}
</style>