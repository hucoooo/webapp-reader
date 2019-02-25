<template>
  <div id="tabber">
    <ul class="tabber-view">
      <router-link to="/" class="tabber-bind" tag="li" exact>
        <div>
          <i class="icon iconfont icon-shouye"></i>
        </div>
        <span>书架</span>
      </router-link>
      <router-link to="/bookClass" class="tabber-bind" tag="li" exact>
        <div>
          <i class="icon iconfont icon-fenlei"></i>
        </div>
        <span>分类</span>
      </router-link>
      <router-link to="/rank" class="tabber-bind" tag="li">
        <div>
          <i class="icon iconfont icon-paihang"></i>
        </div>
        <span>排行</span>
      </router-link>
      <router-link to="/bookSearch" class="tabber-bind" tag="li">
        <div>
          <i class="icon iconfont icon-sousuo"></i>
        </div>
        <span>搜索</span>
      </router-link>
    </ul>
  </div>
</template>

<style lang="scss">
  #tabber{
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #fff;
    box-shadow: 0 2px 4px #000;
    width: 100%;
  }
  .tabber-view {
    display: table;
    width: 100%;
    & > li {
      text-align: center;
      font-size: 16px;
      display: table-cell;
      padding: 8px 12px;
      cursor: pointer;
      &.router-link-active{
        color: #cb1c36;
      }
      & > div {
        font-size: 14px;
        & > i {
          font-size: 1.2rem !important;
        }
      }
    }
  }
</style>
