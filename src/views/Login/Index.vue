<template>
  <div class="container">
    <div class="form-warp">
      <el-form
        ref="inForm"
        :rules="formRules"
        :model="signInForm"
        class="sign-in-form"
      >
        <h2 class="form-title">
          Vibe Logistic
        </h2>
        <div>
          <span class="svg-container">
            <svg-icon icon-name="user" />
          </span>
          <el-input
            ref="inUsername"
            v-model="signInForm.email"
            placeholder="username"
          />
        </div>
        <div prop="password">
          <span class="svg-container">
            <svg-icon icon-name="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="inPassword"
            v-model="signInForm.password"
            :type="passwordType"
            placeholder="password"
            @keyup="checkCapslock"
            @blur="capsTooltip = false"
          />
          <span @click="showPwd((signInPattern = true))">
            <svg-icon
              :icon-name="passwordType === 'password' ? 'profile-eye' : 'profile-eye-open'"
              icon-class="eye"
            />
          </span>
        </div>
        <Captcha @sliderValidation="moveSlider" />
        <el-button
          :loading="btnLoading"
          class="submit-btn"
          @click="handleLogin((signInPattern = true))"
        >
          Sign In
        </el-button>
      </el-form>
      <el-form
        ref="upForm"
        :rules="formRules"
        :model="signUpForm"
        class="sign-up-form"
      >
        <h2 class="form-title">
          Vibe Logistic
        </h2>
        <div>
          <span class="svg-container">
            <svg-icon icon-name="user" />
          </span>
          <el-input
            ref="upUsername"
            v-model="signUpForm.email"
            placeholder="username"
          />
        </div>
        <div>
          <span class="svg-container">
            <svg-icon icon-name="password" />
          </span>
          <el-input
            ref="upPassword"
            v-model="signUpForm.password"
            :type="passwordType"
            placeholder="password"
          />
          <span @click="showPwd((signInPattern = false))">
            <svg-icon
              :icon-name="passwordType === 'password' ? 'eye' : 'eye-open'"
              icon-class="eye"
            />
          </span>
        </div>
        <el-button
          :loading="btnLoading"
          class="submit-btn"
          @click="handleLogin((signInPattern = false))"
        >
          Sign Up
        </el-button>
      </el-form>
    </div>
    <div class="desc-warp">
      <div class="desc-warp-item sign-up-desc">
        <div class="content">
          <button @click="toggleSignUp(true)">
            Sign Up
          </button>
        </div>
        <img
          :src="signInSrc"
          alt="sign-in.svg"
        >
      </div>
      <div class="desc-warp-item sign-in-desc">
        <div class="content">
          <button @click="toggleSignUp(false)">
            Sign In
          </button>
        </div>
        <img
          :src="signUpSrc"
          alt="sign-up.svg"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
// 局部组件（导入）
import Captcha from './Captcha/Index.vue';
import { ElMessage } from 'element-plus';
import { validUsername } from '@/utils/validate';
import { useUserStore } from '@/store';

import signInSrc from '@img/profile/sign-in.svg';
import signUpSrc from '@img/profile/sign-up.svg';

/* Begin Data */
const userStore = useUserStore();

const { proxy } = getCurrentInstance();

const validated = ref(false);
const capsTooltip = ref(false);
const passwordType = ref('password');

const signInForm = reactive({
  email: 'admin@vibe.us',
  password: '',
});

const signUpForm = reactive({
  email: '',
  password: '',
});
const state = reactive({
  otherQuery: {},
  redirect: undefined
});

const validateUsername = (rule, value, callback) => {
  if (!validUsername(value)) {
    callback(new Error('Please enter the correct user name'));
  } else {
    callback();
  }
};

const validatePassword = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error('The password can not be less than 6 digits'));
  } else {
    callback();
  }
};

const formRules = {
  email: [{ required: true, trigger: 'blur', validator: validateUsername }],
  password: [{ required: true, trigger: 'blur', validator: validatePassword }],
};

/* End Data */

/* Method */
onMounted(() => {
  focusForm(true, proxy.$refs);
});

function focusForm(signInPattern, refs) {
  const email = signInPattern ? 'inUsername' : 'upUsername';
  const password = signInPattern ? 'inPassword' : 'upPassword';

  if (refs[email].modelValue === '') {
    refs[email].focus();
  } else if (refs[password].modelValue === '') {
    refs[password].focus();
  }
}

const moveSlider = () => {
  validated.value = true;
};

const toggleSignUp = (signUpPattern) => {
  const containerDom = document.getElementsByClassName('container')[0];
  signUpPattern
    ? containerDom.classList.add('sign-up-mode')
    : containerDom.classList.remove('sign-up-mode');
  focusForm(!signUpPattern, proxy.$refs);
};

const checkCapslock = (e) => {
  const { key } = e;
  capsTooltip.value = key && key.length === 1 && key >= 'A' && key <= 'Z';
};

const showPwd = (signInPattern) => {
  passwordType.value = passwordType.value === 'password' ? '' : 'password';
  const password = signInPattern ? 'inPassword' : 'upPassword';
  nextTick(() => {
    proxy.$refs[password].focus();
  });
};

/* listen router change  */
const route = useRoute();
const getOtherQuery = (query) => {
  return Object.keys(query).reduce((acc, cur) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur];
    }
    return acc;
  }, {});
};

watch(
  () => route.query,
  (query) => {
    if (query) {
      state.redirect = query.redirect;
      state.otherQuery = getOtherQuery(query);
    }
  },
  { immediate: true }
);


/*
 *  login relative
 * */
const btnLoading = ref(false);
const handleLogin = async (signInPattern) => {
  if (validated.value) {
    proxy.$refs.inForm.validate((valid) => {
      if (valid) {
        loginReq();
      } else {
        return false;
      }
    });
  } else {
    ElMessage.error('Please drag the slider to verify or reflush the page.');
  }
};

const router = useRouter();
function loginReq () {
  btnLoading.value = true;
  userStore
    .login(signInForm)
    .then(() => {
      router.push({ path: state.redirect || '/', query: state.otherQuery });
    })
    .catch((err) => {
      console.log('login err: ', err);
    }).finally(() => btnLoading.value = false);
}
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

.svg-container
  display: inline-block
  vertical-align: middle
  width: 30px
  margin-left: -30px
.svg-icon.eye
  position: absolute
  height: 32px
  margin-left: -26px
  line-height: 32px
  cursor: pointer
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

.container.sign-up-mode
  .form-warp
    left: 25%
  .sign-in-form
    opacity: 0
    z-index: 3
  .sign-up-form
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

.sign-in-desc img
  margin-left: 3rem
  margin-right: -3rem

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
