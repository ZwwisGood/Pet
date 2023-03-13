<template>
    <div id="head">
        <div class="main">
            <div class="left">欢迎来到乐宠宠物服务平台 !
                <el-input clearable v-model="search" class="search" placeholder="请输入搜索内容" prefix-icon="el-icon-search"
                    size="mini" style="width: 300px;"></el-input>
                <el-button type="primary" size="mini">搜索</el-button>
            </div>
            <div class="right">
                <div><i class="el-icon-phone"></i> 400-00-000123</div>
                <div><i class="iconfont icon-youjian"></i> 1329824163@qq.com</div>
                <!-- 头像 -->
                <div style="display:flex" v-if="userName">
                    <div class="img"><img class="avatar" src="../assets/images/logo.jpeg"></div>
                    <div class="user">{{ userName }}</div>
                </div>
                <div v-else @click="$router.push('/login')" class="btn hvr-buzz" style="color:cyan;cursor:pointer;">登录注册
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            search: '',
            userName: ''
        }
    },
    mounted() {
        let timer = setInterval(() => {
            if (this.userName !== '') {
                clearInterval(timer)
            }
            this.userName = JSON.parse(window.localStorage.getItem('petUserInfo')) ? JSON.parse(window.localStorage.getItem('petUserInfo')).userName : ''
            console.log(this.userName);
        }, 50);
    },
    methods: {
        init() {
            let user = JSON.parse(window.localStorage.getItem('petUserInfo'))
            if (user) {
                console.log(123);
                this.userName = user.userName
            } else {
                console.log(456);
                this.userName = ''
            }
        }
    },
}
</script>

<style lang="scss" scoped>
:deep(.b) {
    display: block !important;
}

.main {
    margin: 0 100px;
}

/* 欢迎来到家居网 */
#head {
    position: sticky;
    top: 0;
    z-index: 99;
    height: 45px;
    // min-width: 1200px;
    background: #252525;
    line-height: 45px;
    color: white;
}

#head a {
    color: white;
    margin-left: 20px;
}

#head {
    height: 45px;
    min-width: 1200px;
    background: #252525;
    line-height: 45px;
    color: white;

    .main {
        min-width: 1200px;
        font-size: 12px;
        display: flex;
        justify-content: space-between;
    }

    .left .search {
        margin-left: 150px;
        border-radius: 0;
    }

    :deep(.el-input__inner) {
        border-radius: 0;
    }

    .el-button {
        border-radius: 0;
    }

    .right {
        display: flex;

        .user {
            cursor: pointer;
        }

        .avatar {
            margin-top: 7px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
        }

        .img {
            margin: 0 6px 0 50px;
        }

        div {
            margin-right: 20px;

            .el-icon-phone {
                font-size: 16px;
                vertical-align: middle;
            }

            .iconfont {
                font-size: 20px;
                vertical-align: middle;
            }
        }
    }
}
</style>