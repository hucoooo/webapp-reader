<template>
  <div class="no-data">
    <span class="icon"></span>
    <span class="tip">暂无数据</span>
  </div>
</template>
<script>
export default {
  props: {
    
  },
  data () {
    return {
      
    }
  },
  mounted () {
    
  },
  methods: {
    
  }
};
</script>
<style lang='scss' scoped>
.no-data{
  width: 4.267rem;
  margin: 4.8rem auto;
  .icon{
    display: inline-block;
    width: 100%;
    height: 4.267rem;
    background: url('../../assets/images/no-data.png') 50% no-repeat;
    background-size: contain;
  }
  .tip{
    display: inline-block;
    width: 100%;
    height: 1.6rem;
    line-height: 1.6rem;
    margin: 0.533rem auto;
    text-align: center;
    color: #ccc;
    font-size: 16px;
  }
}
</style>