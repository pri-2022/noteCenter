<template>
  <div id="app">
    <!-- <Login/> -->
    <Home/>
  </div>
</template>

<script>
import Login from './components/login/index.vue'
import Home from './components/home/index.vue'

export default {
  name: 'App',
  components: {
    Login,
    Home
  }
}
</script>

<style>

</style>
