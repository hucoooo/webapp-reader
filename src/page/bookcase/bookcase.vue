<template>
  <div class="page-bookcase">
    <div class="bookcase" v-if="isBookcase">
      <div class="top">
        <span class="left">共{{ bookcaseArr.length }}本</span>
        <span class="right">
          <span class="normal" @click="isEdit = true" v-show="!isEdit">编辑</span>
          <span class="edit" v-show="isEdit">
            <span class="cancel" @click="isEdit = false">取消</span>
            <span class="delete" @click="bookcaseDelete()">删除</span>
          </span>
        </span>
      </div>
      <div class="bookcase-list">
        <a
          v-for="(item, index) in bookcaseArr"
          :href="('#/reader?book_id='+item.book_id+'&index='+item.index)"
          @click="isEdit ? setListCheck($event, item.book_id) : ''"
          :key="index"
        >
          <div class="inner">
            <div class="select-container">
              <div class="cover">
                <img :src="item.image">
              </div>
              <div class="right">
                <h1 class="name">{{ item.title }}</h1>
                <p>阅读到第{{ item.index }}章</p>
              </div>
              <router-link :to="{path: '/book', query:{id: item.book_id}}" class="to-detail" v-show="!isEdit"></router-link>
              <div class="checkbox" v-show="isEdit">
                <div class="select-img" v-show="!item.check"></div>
                <div class="selected-img" v-show="item.check"></div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
    <div class="no-bookcase" v-else>
      <div class="ku"></div>
      <p>书架空空如也，快去逛逛找书</p>
    </div>
  </div>
</template>
<script>
import API from '../../api/api.js';
import store from 'storejs';
export default {
  components: {
    
  },
  data() {
    return {
      isBookcase: false,
      bookcaseArr: [],
      isEdit: false,
      list: []
    }
  },
  mounted() {
    this.$store.state.isTabber = true;
    console.log('bookcase', store.get("bookcase"));
    if(store.get("bookcase").length !== 0) {
      var arr = store.get("bookcase");
      for(var i = 0; i < arr.length; i ++) {
        arr[i].check = false;
        if(!arr[i].book_id) {
          arr.splice(i, 1);
        }
      }
      // console.log('arr', arr);
      this.bookcaseArr = arr;
      store.set("bookcase", arr);
      this.isBookcase = true;
    }else{
      this.isBookcase = false;
    }
  },
  methods: {
    // 多选
    setListCheck: function (ev, book_id) {
      ev.preventDefault();
      var arr = this.bookcaseArr;
      for(let i in arr) {
        if(arr[i].book_id === book_id) {
          arr[i].check = arr[i].check ? false : true;
          this.$set(this.bookcaseArr, i, arr[i]);   // 直接修该索引下的数据视图不会更新，需用set
          break;
        }
      }
    },
    // 移出书架
    bookcaseDelete: function () {
      var arr = [];
      for(let i in this.bookcaseArr) {
        this.bookcaseArr[i].check ? '' : arr.push(this.bookcaseArr[i]);
      }
      store.set("bookcase", arr);
      this.bookcaseArr = store.get("bookcase");
    }
  }
};
</script>
<style lang='scss' scoped>
  .page-bookcase{
    position: relative;
    background: #f4f4f4;
    height: 100%;
    .bookcase{
      min-height: 100%;
      padding-bottom: 4rem;
      .top{
        height: 2.933rem;
        line-height: 2.933rem;
        width: 100%;
        color: #999;
        padding: 0 .8rem;
        span{
          display: inline-block;
        }
        .right{
          float: right;
          .cancel{
            margin-right: 0.533rem;
          }
          .delete{
            margin-left: 0.533rem;
            color: #b93321;
          }
        }
      }
      .bookcase-list{
        background-color: #fff;
        > a{
          display: block;
          padding-left: .8rem;
        }
        .inner{
          position: relative;
          background-image: linear-gradient(180deg, transparent, 50%, #ddd 0);
          background-size: 100% 1px;
          background-repeat: no-repeat;
          background-position: bottom;
          padding: .8rem .8rem .8rem 0;
          .select-container{
            .cover{
              float: left;
              width: 3.2rem;
              height: 4rem;
              border: 1px solid #ebebeb;
              overflow: hidden;
            }
            .right{
              height: 4rem;
              margin-left: 4rem;
              .name{
                height: 1.067rem;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                line-height: 1.013rem;
                color: #333;
                font-size: 14px;
              }
              p{
                width: 80%;
                line-height: 1.067rem;
                height: 1.067rem;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                color: #999;
              }
            }
            .to-detail{
              display: block;
              position: absolute;
              top: 20%;
              right: 0;
              width: 2.667rem;
              height: 2.667rem;
              background: transparent url("../../assets/images/toBookDetail.png") 50% no-repeat;
              background-size: 1.333rem 1.333rem;
              opacity: .7;
            }
            .checkbox{
              position: absolute;
              right: .8rem;
              top: .8rem;
              .is-show{
                visibility: hidden;
              }
              .select-img{
                width: 0.907rem;
                height: 0.907rem;
                background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAhCAYAAAC803lsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBCRDJGNTM5OTVDOTExRTZCNTE3QzJGOUMyQTNGOEFDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjBCRDJGNTNBOTVDOTExRTZCNTE3QzJGOUMyQTNGOEFDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MEJEMkY1Mzc5NUM5MTFFNkI1MTdDMkY5QzJBM0Y4QUMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MEJEMkY1Mzg5NUM5MTFFNkI1MTdDMkY5QzJBM0Y4QUMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Xkfr3AAAARElEQVR42uzXsREAIAgEQXHsvxgaREMrUIK9iHDnMyIzazRojiat645Phmq1CAgICAgICAgICAgICAjIgye8LHLaAgwA/jIFWrMfqPQAAAAASUVORK5CYII=) no-repeat;
                background-size: 100%;
                background-position: 50%;
              }
              .selected-img{
                width: 0.907rem;
                height: 0.907rem;
                background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAhCAYAAACxzQkrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkZBMzlCMjAyOTVDODExRTZBQTkzODlCOEVGMkY2OUVDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkZBMzlCMjAzOTVDODExRTZBQTkzODlCOEVGMkY2OUVDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkEzOUIyMDA5NUM4MTFFNkFBOTM4OUI4RUYyRjY5RUMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RkEzOUIyMDE5NUM4MTFFNkFBOTM4OUI4RUYyRjY5RUMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5QY6EyAAAB6klEQVR42uyXyytEURzHDzMRmeS1s/AXeK0lM0KyUKIUkWahKSWRVxTlXdMkJRMWylAWlGLDwtLazjuSrSxkYcH31G/qdLruy733jJpffWruuae5n37nnN85JyMR7flm3sQEWDLqlMlSLPzC73Lw4uK3PnXeNYAL8CUKvYM3BUnpA1vgAHT7FY9QL9ikqdMJPlTOoS6wDXz0zBfXpSohno0dSSbCh06FUAfYlWQGQFzFsm8He5LMIFhXUYfaQEIoNVxmCKypKIytYB9kCW3DYFVFpW6hGiPKjICYna2Dj/UGqLYp0wwOJZkxELWzl/loNfSDM1BlUaYJHEkyk2DF7ua6QPWCR6FFqUaSyRbapsCi1K+MTgDjZoT4hLsRnotIqtJApp5kcoS2GTCv0beUhjBiRuiV/vxOkjrXkaoDxyBXaJslTIXRpObHkSC418hUhdS3FpxIMnOUHeaUUFIqBB6FtmLKVFKqRkOGz5dpq8vSbB16pkw9SVI8U2FwCvKEd8u0ophbQoxkgiSXjBI6XAWEtqi4atwUYjRsQZ2jboyqMPNKiMfDL1Jx2p+Y10KMSkGISgOjYYvQDu7YrcNq3JJUmIqbI/e7vx7yr8Gok0eDlLsopoX+9d0+HxR4/P2AntBVesg04keAAQC58VklGpqQEgAAAABJRU5ErkJggg==) no-repeat;
                background-size: 100%;
                background-position: 50%;
              }
            }
          }
        }
      }
    }
    .no-bookcase{
      width: 100%;
      padding-top: 50%;
      text-align: center;
      .ku{
        width: 5.333rem;
        height: 5.333rem;
        background: url('../../assets/images/ku.png') no-repeat;
        background-size: 100%;
        background-position: 50%;
        margin: 0 auto;
      }
      p{
        line-height: 3.2rem;
        color: #999;
      }
    }
  }
</style>