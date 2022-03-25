<template>
  <div>
    <particles></particles>
    <div class="formBox">
      <div class="title">单路混合拼矩</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            show-password
            v-model="ruleForm.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="
              width: 100%;
              margin-bottom: 30px;
              background-color: #2d2c2d;
              border: none;
            "
            @click.native.prevent="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import particles from "./particles/Particles.vue";
export default {
  name: "login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能少于6位"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        name: "",
        password: "",
      },
      rules: {
        name: [
          {
            required: true,
            trigger: "blur",
            validator: validateUsername,
          },
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            validator: validatePassword,
          },
        ],
      },
    };
  },
  methods: {},
  components: {
    // 粒子背景组件
    particles,
  },

  mounted() {},
};
</script>

<style scoped lang='less'>
.formBox {
  z-index: 1;
  width: 520px;
  max-width: 40%;
  padding: 200px 35px;
  margin: 0 auto;

  .title {
    position: relative;
    font-size: 40px;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
    color: #fff;
  }

  .el-input {
    font-size: 20px;
    line-height: 100%;
    margin-bottom: 10px;
  }

  .el-button {
    font-size: 20px;
  }
}
</style>