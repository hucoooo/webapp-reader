<template>
  <div class="book-loading">
    <div class="tip-wraper">
      <i class="icon"></i>
      <span class="text">加载中...</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      
    }
  },
  mounted() {
    
  },
  methods: {
    
  }
};
</script>
<style lang='scss' scoped>
.book-loading{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  z-index: 999;
  .tip-wraper{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5.333rem;
    height: 4rem;
    margin: -2rem 0 0 -2.667rem;
    text-align: center;
    .icon{
      display: inline-block;
      width: 3.2rem;
      height: 3.2rem;
      margin: 0 auto;
      background: url('../../assets/images/loading.gif') 50% no-repeat;
      background-size: contain;
    }
    .text{
      display: inline-block;
      width: 100%;
      height: 1.333rem;
      line-height: 1.333rem;
      font-size: 12px;
      color: #bbb;
    }
  }
}
</style>