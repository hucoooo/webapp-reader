<template>
  <div class="ranking-header">
    <ul>
      <li
        v-for='(item, index) in header'
        :key='index'
        :class='{active : active === item}'
        @click="active === item ? '' : selected(item, id[index])"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    id: Array
  },
  data () {
    return {
      header: ['周榜', '月榜', '总榜'],
      active: '周榜'
    }
  },
  mounted () {
    // console.log(this.id);
  },
  methods: {
    selected: function(name, id) {
      this.active = name;
      // console.log('id', id);
      this.$emit('rankingToChildEvent', id);
    }
  }
};
</script>
<style lang='scss' scoped>
.ranking-header{
  width: 100%;
  z-index: 10000;
  position: relative;
  top: 0;
  left: 0;
  background-color: #fff;
  border-bottom: 1px solid #ebebeb;
  display: inline-block;
  & > ul{
    height: 2.88rem;
    color: #999;
    font-size: 0;
    white-space: nowrap;
    & > li{
      width: 33.333%;
      display: inline-block;
      height: 100%;
      line-height: 2.88rem;
      text-align: center;
      font-size: 14px;
      box-sizing: border-box;
    }
    .active{
      border-bottom: 2px solid #b93321;
      color: #b93321;
    }
  }
}
</style>