<template>
  <div class="container">
    <div class="form-warp">
      <el-form ref="form" :model="signInForm" class="sign-in-form">
        <h2 class="form-title">登录</h2>
        <el-input v-model="signInForm.username" placeholder="用户名" />
        <el-input v-model="signInForm.password" type="password" placeholder="密码" />
        <Captcha />
        <el-button class="submit-btn" @click="submitLogin">立即登录</el-button>
      </el-form>
      <el-form ref="form" :model="signUpForm" class="sign-up-form">
        <h2 class="form-title">注册</h2>
        <el-input v-model="signUpForm.username" placeholder="用户名" />
        <el-input v-model="signUpForm.password" type="password" placeholder="密码" />
        <div class="submit-btn">立即注册</div>
      </el-form>
    </div>
    <div class="desc-warp">
      <div class="desc-warp-item sign-up-desc">
        <div class="content">
          <button @click="toggleSignUp(true)">注册</button>
        </div>
        <img src="/@/assets/img/profile/sign-in.svg" alt="sign-in.svg">
      </div>
      <div class="desc-warp-item sign-in-desc">
        <div class="content">
          <button @click="toggleSignUp(false)">登录</button>
        </div>
        <img src="/@/assets/img/profile/sign-up.svg" alt="sign-up.svg">
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs } from "vue";
// 局部组件（导入）
import Captcha from "/@/components/Captcha/Index.vue";
import { useStore } from "vuex";
import { useRouter } from 'vue-router';

export default defineComponent({
  name: "Login",
  components: {
    Captcha,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const { proxy } = getCurrentInstance();

    const data = reactive({
      signInForm: {
        username: "",
        password: "",
      },
      signUpForm: {
        username: "",
        password: "",
      },
      validated: false,
    });

    const formConfig = reactive({
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      },
    });

    const moveSlider = () => {
      data.validated = true;
    };

    const toggleSignUp = signUpPattern => {
      const containerDom = document.getElementsByClassName('container')[0];
      signUpPattern ? containerDom.classList.add('sign-up-mode') : containerDom.classList.remove('sign-up-mode');
    };

    const submitLogin = () => {
      // ToDo 逻辑尚未完善
      if (data.validated) {
        const isLogined = store.dispatch("profiles/login", data.signInForm);
        // 测试
        // if (data.signInForm.username === 'admin' && data.signInForm.password === '123') {
        //   router.push('/');
        // }
        if (isLogined) {
          // 初始化登录后所需数据
          console.log("初始化登录后所需数据");
          // store.dispatch("users/listUsers"); // 用户管理界面 用户列表
          // const params = {
          //   offset: 0,
          //   limit: 15,
          //   isSimple: false,
          // };
          // store.dispatch("orders/listOrders", params); // 订单管理界面 订单列表
        }
      } else {
        proxy.$message.error('Please drag the slider to verify.', 3);
        const loadingInstance = proxy.$loading.service({fullscreen: true});
        setTimeout(() => {
          loadingInstance.close();
        }, 1000);
      }
    };

    return {
      ...toRefs(data),
      formConfig,
      moveSlider,
      submitLogin,
      toggleSignUp
    };
  },
});
</script>

<style scoped lang="sass">

.container 
  position: relative
  width: 100%
  min-height: 100vh
  overflow: hidden

.container::before 
  content: " "
  position: absolute
  width: 2000px
  height: 2000px
  border-radius: 50%
  background-image: linear-gradient(-45deg, #6266f5 0%, #04befe 100%)
  transition: 1.8s ease-in-out
  z-index: 6
  top: -10%
  right: 48%
  transform: translateY(-50%)

.container.sign-up-mode::before 
  transform: translate(100%, -50%)

.form-warp 
  position: absolute
  z-index: 5
  left: 75%
  top: 50%
  z-index: 5
  display: grid
  width: 50%
  grid-template-columns: 1fr
  transition: 1s 0.7s ease-in-out
  transform: translate(-50%, -50%)
  form 
    display: flex
    align-items: center
    justify-content: center
    flex-direction: column
    gap: 20px
    /* 将两个 form 布局在 grid 同一位置 */
    grid-row: 1 / 2
    grid-column: 1 / 2
    transition: all 0.2s 0.7s
    opacity: 1
    z-index: 4
  .form-title 
    font-size: 1.5em
    font-weight: 700
    color: #6266f5
  .sign-up-form 
    opacity: 0
    z-index: 3
  .el-input
    width: 300px

.container.sign-up-mode .form-warp 
  left: 25%

.container.sign-up-mode .sign-in-form 
  opacity: 0
  z-index: 3

.container.sign-up-mode .sign-up-form 
  opacity: 1
  z-index: 4

input,
.submit-btn 
  min-width: 300px
  outline: none
  padding: 12px 30px
  line-height: 1
  font-size: 16px
  border-radius: 60px
  color: #333
  background-color: #6267f513
  border: none

input::placeholder 
  color: #cccc

.submit-btn 
  background-color: #6266f5
  color: #FFF
  text-align: center
  min-width: 150px
  font-size: initial
  font-weight: bold
  letter-spacing: 1.5px
  cursor: pointer


.desc-warp 
  width: 100%
  height: 100%
  position: absolute
  top: 0
  left: 0
  display: grid
  grid-template-columns: repeat(2, 1fr)

.desc-warp-item 
  display: flex
  flex-direction: column
  align-items: flex-end
  justify-content: space-around
  text-align: center
  text-align: center
  padding: 3rem 17% 2rem 12%
  z-index: 6

/* 事件穿透 BEGIN */
.sign-in-desc 
  pointer-events: none

.sign-up-mode .sign-in-desc 
  pointer-events: all

.sign-up-mode .sign-up-desc 
  pointer-events: none

/* 事件穿透 END */
.content 
  width: 100%
  transition: transform 0.9s ease-in-out
  transition-delay: .6s

.sign-in-desc img,
.sign-in-desc .content 
  transform: translateX(800px)

.sign-up-mode .sign-in-desc img,
.sign-up-mode .sign-in-desc .content 
  transform: translateX(0)


.sign-up-mode .sign-up-desc img,
.sign-up-mode .sign-up-desc .content 
  transform: translateX(-800px)


button 
  outline: none
  padding: 6px 8px
  min-width: 100px
  text-align: center
  border-radius: 30px
  border: 2px solid #FFF
  background: none
  color: #FFF
  cursor: pointer
  transition: all .3s ease

button:active 
  background: rgba(255, 255, 255, .1)

img 
  width: 100%
  display: block
  transition: transform 0.9s ease-in-out
  transition-delay: .5s


/* 响应式 */
@media screen and (max-width: 870px) 
  .container::before 
    width: 1500px
    height: 1500px
    transform: translateX(-50%)
    left: 30%
    bottom: 68%
    right: initial
    top: initial
    transition: 2s ease-in-out
  
  .container.sign-up-mode::before 
    transform: translate(-50%, 100%)
    bottom: 32%
    right: initial
  
  .form-warp 
    width: 100%
    top: 75%
    left: 50%
    transform: translate(-50%, -100%)
    transition: 1s 0.8s ease-in-out
  
  .container.sign-up-mode .form-warp 
    top: 25%
    left: 50%
    transform: translate(-50%, 0)
  
  img 
    width: 200px
    transition: transform 0.9s ease-in-out
    transition-delay: 0.7s
  
  .desc-warp 
    grid-template-columns: 1fr
    grid-template-rows: 1fr 2fr 1fr
  
  .desc-warp-item 
    flex-direction: row
    justify-content: space-around
    align-items: center
    padding: 2.5rem 8%
    grid-column: 1 / 2
  
  .sign-in-desc 
    grid-row: 3 / 4

  .sign-in-desc img,
  .sign-in-desc .content 
    transform: translateY(800px)
  
  .sign-up-mode .sign-in-desc img,
  .sign-up-mode .sign-in-desc .content 
    transform: translateY(0)

  .sign-up-mode .sign-up-desc img,
  .sign-up-mode .sign-up-desc .content 
    transform: translateY(-800px)

@media screen and (max-width: 570px) 
  .container::before 
    bottom: 72%
    left: 50%
  img 
    display: none
</style>
