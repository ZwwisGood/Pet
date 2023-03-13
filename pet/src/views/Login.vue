<template>
    <div class="main">
        <el-image style="width:500px;height:400px;marginTop:70px" fit="cover" src="/src/assets/images/login.png"></el-image>
        <div class="login">
            <div v-if="show" class="animated animate__flipInY">
                <h2 style="color:#409eff">W&nbsp;E&nbsp;L&nbsp;C&nbsp;O&nbsp;M&nbsp;E</h2>
                <el-form label-width="80px" :model="loginForm" :rules="loginRules" ref="loginForm">
                    <el-form-item label="用户名" prop="username">
                        <el-input width="100px" v-model="loginForm.userName" placeholder="Username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" @keyup.enter.native="onSubmit" v-model="loginForm.userPwd"
                            placeholder="Password"></el-input>
                    </el-form-item>
                </el-form>
                <el-button class="submit" type="primary" @click="onSubmit">登录</el-button>
            </div>
            <div v-if="!show" class="animated animate__flipInY">
                <h2 style="color:#409eff">W&nbsp;E&nbsp;L&nbsp;C&nbsp;O&nbsp;M&nbsp;E</h2>
                <el-form label-width="80px" :model="registerForm" :rules="registerRules" ref="registerForm">
                    <el-form-item label="用户名" prop="username">
                        <el-input width="100px" v-model="registerForm.userName" placeholder="Username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="registerForm.userPwd" placeholder="Password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="password1">
                        <el-input type="password" v-model="registerForm.userPwd1" placeholder="Password"></el-input>
                    </el-form-item>
                </el-form>
                <el-button class="register" type="primary" @click="onRegister">注册</el-button>
            </div>
            <a style="cursor:pointer;font-size: 12px" @click="show = !show">{{ show ? '去注册' : '去登录'
            }}</a>
        </div>

    </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
    data() {
        return {
            show: true,
            loginForm: {},
            registerForm: {},
            loginRules: {
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                userPwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ]
            },
            registerRules: {
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                userPwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                // 与第一次密码一致
                userPwd1: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            if (value !== this.registerForm.password) {
                                callback(new Error('两次输入密码不一致!'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods: {
        onSubmit() {
            this.$refs.loginForm.validate(async (valid) => {
                if (valid) {
                    const res = await this.$api({
                        url: '/user/login',
                        method: 'post',
                        data: this.loginForm
                    })
                    this.$message({
                        message: '登录成功',
                        type: 'success'
                    })
                    console.log(res)
                    this.$store.commit('setUserInfo', res)
                    this.$nextTick(() => {
                        this.$router.push('/')
                    })

                } else {
                    console.log('error submit!!')
                    return false
                }
            });
        },
        onRegister() {
            this.$refs.registerForm.validate(async (valid) => {
                if (valid) {
                    try {
                        await this.$api({
                            url: '/user/register',
                            method: 'post',
                            data: this.registerForm
                        })
                        this.$message({
                            message: '注册成功',
                            type: 'success'
                        });
                        this.$router.push('/')
                    } catch (error) {
                        this.$message.error(error)
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    },
}
</script>

<style lang="scss">
.main {
    display: flex;
    position: relative;
    justify-content: center;
}

.login {
    text-align: center;
    width: 400px;
    height: 250px;
    background-color: rgba(0, 0, 0, .1);
    border-radius: 30px;
    padding: 50px;
    margin-top: 100px;
    position: relative;
    box-shadow: 20px 20px 30px rgba(0, 0, 0, .5);

    a {
        position: absolute;
        bottom: 10px;
        left: 229px;
    }

    .el-input {
        width: 250px;
    }

}
</style>