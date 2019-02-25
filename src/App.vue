<template>
  <div id="app">
    <router-view></router-view>
    <Tabber v-if='$store.state.isTabber'></Tabber>
  </div>
</template>
<script>
  import Tabber from "@/components/tabber/tabber.vue";
  export default {
    name: "app",
    components: {
      Tabber
    },
    data() {
      return {
        // isRouterAlive: true
      }
    },
    created () {
      // console.log('sessionStorage11111', sessionStorage.getItem("store"));
      // if (sessionStorage.getItem("store") ) {
      //   console.log('sessionStorage', this.$store);
      //   this.$store.storage.replaceState(Object.assign({}, this.$store.state.storage,JSON.parse(sessionStorage.getItem("store"))))
      // };
      // window.addEventListener("beforeunload",()=>{
      //   sessionStorage.setItem("store",JSON.stringify(this.$store.state.storage))
      // });
    },
    // provide() {
    //   return {
    //     reload: this.reload
    //   }
    // },
    mounted () {
      
    },
    methods: {
      // reload () {
      //   this.isRouterAlive = false;
      //   this.$nextTick(() => (this.isRouterAlive = true));
      // }
    }
  };
  const html = document.documentElement;

  function onWindowResize() {
    html.style.fontSize = html.getBoundingClientRect().width / 20 + 'px';
  }

  window.addEventListener('resize', onWindowResize);
  onWindowResize();
</script>
<style lang='scss'>
#app{
  height: 100%;
}
</style>