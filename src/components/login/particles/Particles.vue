<style scoped>
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("@/assets/img/bg.jpg");
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
}
</style>

<template>
  <div style="height: 100%; width: 100%">
    <div id="particles-js"></div>
  </div>
</template>

<script>
import particlesJs from "particles.js";
import particlesConfig from "./particles.json";
export default {
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      particlesJS("particles-js", particlesConfig);
      document.body.style.overflow = "hidden";
    },
  },
};
</script>
