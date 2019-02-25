<template>
  <div class="filter-item">
    <div class="inner">
      <ul>
        <li
          v-for="item in list"
          :data-type='item.id || type'
          :data-minor='item.type || type'
          v-on:click="currentMinor === (item.id || item.type) ? '' : switchMinor($event)"
          :class="currentMinor === (item.id || item.type) ? 'active' : ''"
          ref='lists'
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: Array
  },
  data () {
    return {
      currentMinor: this.list[0].id || this.list[0].type,
      type: ''
    }
  },
  mounted () {
    
  },
  methods: {
    headerMinor: function () {
      
    },
    switchMinor: function (e) {
      this.currentMinor = e.target.dataset.type || e.target.dataset.minor;
      if(e.target.dataset.type !== ''){
        this.$store.state.headerData.major.id = e.target.dataset.type;
        this.$store.state.headerData.major.type = e.target.innerText;
      }else{
        this.$store.state.headerData.minor.id = e.target.dataset.minor;
        this.$store.state.headerData.minor.type = e.target.innerText;
      }
      this.$emit('listenToChildEvent', this.$store.state.headerData);
    }
  }
};
</script>
<style lang='scss' scoped>
  .filter-item{
    background-size: 100% 1px;
    background-image: linear-gradient(180deg,transparent 50%,#ddd 0);
    background-repeat: no-repeat;
    background-position: bottom;
    width: 100%;
    height: 2.4rem;
    line-height: 2.4rem;
    overflow: hidden;
    .inner{
      height: 100%;
      overflow-x: auto;
      & > ul{
        width: auto;
        height: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 0;
        & > li{
          &:first-child{ padding-left: .8rem; }
          &.active{ color: #b93321; }
          display: inline-block;
          height: 100%;
          padding: 0 0.533rem;
          font-size: 13px;
        }
      }
    }
  }
  
</style>