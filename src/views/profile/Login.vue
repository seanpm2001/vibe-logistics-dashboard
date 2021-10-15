<template>
  <div class="account">
    <div class="form-wrap ban-selected">
      <el-form
        name="custom-validation"
        ref="ruleForm"
        :model="loginForm"
      >
        <el-form-item>
          <label>用户名</label>
          <el-input
            v-model="loginForm.username"
            type="text"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item>
          <label>密码</label>
          <el-input
            v-model:value="loginForm.password"
            type="password"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item>
          <!--No-Captcha渲染的位置，其中 class 中必须包含 nc-container-->
          <!-- <div id="captcha-dom" class="nc-container"></div> -->
          <Captcha @sliderValidation="moveSlider" />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="submitLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="text-center fs-12">
        <router-link
          to="/register"
          class="color-white"
        >注册</router-link> |
        <router-link
          to="/forget"
          class="color-white"
        >忘记密码</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ElInput, ElMessage } from "element-plus";
import { defineComponent, reactive, toRefs } from "vue";
// 局部组件（导入）
import Captcha from "/@/components/Captcha/Index.vue";
import { useStore } from "vuex";
// import router from "/@/router";

export default defineComponent({
  name: "Login",
  components: {
    ElInput,
    Captcha,
  },
  setup() {
    const store = useStore();

    const data = reactive({
      loginForm: {
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

    const submitLogin = () => {
      if (data.validated) {
        const isLogined = store.dispatch("profiles/login", data.loginForm);
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
        ElMessage("请拖动滑块到底验证", 3);
      }
    };

    return {
      ...toRefs(data),
      formConfig,
      moveSlider,
      submitLogin,
    };
  },
});
</script>

<style scoped lang="sass">
.account
  width: 100vw
  height: 100vh
  background-color: #282828
  .form-wrap
    width: 300px
    margin: 0 auto
    padding-top: 100px
    color: #fff
    label
      display: block
      font-size: 14px
      color: #fff
</style>
