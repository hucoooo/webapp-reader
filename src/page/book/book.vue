<template>
  <Loading v-if='!loading'></Loading>
  <div v-else class="page-book">
    <ListHeader :title='title'></ListHeader>
    <div>
      <div class="book-detail clearfix">
        <img class="cover" :src="imgUrl" :alt='bookInfo.title'>
        <div class="desc">
          <h1>{{ bookInfo.title }}</h1>
          <span class="sku">
            <p class="red-color">{{ bookInfo.author }}</p>
            <i>|</i>
            <p>{{ bookInfo.cat }}</p>
            <i>|</i>
            <p>{{ latelyFollowerPoint(bookInfo.wordCount) }}字</p>
          </span>
          <p class="update">{{ dateFtt(bookInfo.updated) }}</p>
        </div>
      </div>
      <div class="read-link">
        <a class="button-left" :class="{subtract: ifJoinBookcase}" @click='joinBookcase'>
          <i>{{ ifJoinBookcase ? buttonLeftTextOut : buttonLeftTextJoin }}</i>
        </a>
        <router-link class="button-right" :to="{path: '/reader', query: {book_id: $route.query.id, index: 1}}">
          <i>{{ buttonRightText }}</i>
        </router-link>
      </div>
      <div class="reader-data">
        <span class="item">
          <p class="key">人气</p>
          <p class="data">{{ latelyFollower(bookInfo.latelyFollower) }}</p>
        </span>
        <span class="item">
          <p class="key">读者留存率</p>
          <p class="data">{{ bookInfo.retentionRatio }}%</p>
        </span>
        <span class="item">
          <p class="key">日更字数</p>
          <p class="data">{{ latelyFollower(bookInfo.serializeWordCount) }}</p>
        </span>
      </div>
      <div>
        <div class="introduction" @click='introductionToClick'>
          <p :class='{active: isIntroductionClick}'>{{ bookInfo.longIntro }}</p>
          <span class="arrow" :class='{up: isIntroductionClick}'></span>
        </div>
        <router-link class="chapter-item" :to="{path: '/bookDirectory', query: {book_id: $route.query.id}}">
          <div class="inner clearfix">目录
            <i class="arrow"></i>
            <span v-if='loading'>[{{ dateFtt(bookInfo.updated) }}]&nbsp;&nbsp;{{ bookInfo.lastChapter }}</span>
          </div>
        </router-link>
      </div>
    </div>
    <div class="hot-comment">
      <div class="hot-comment-top">
        <h2>热门书评</h2>
        <router-link
          class="more"
          :to="{path: '/comment', query:{book_id: $route.query.id, title: bookInfo.title}}"
        >
          更多评论
        </router-link>
      </div>
      <ul class="comment-list">
        <li v-for='(item, index) in reviewsData' :key="index">
          <!-- reviews：评论数据   title：书籍名称   book_id：书籍ID  reviewsIndex：该评论所在数组下标 -->
          <Reviews :reviews='item' :title='title' :book_id='$route.query.id' :reviewsIndex='index'></Reviews>
        </li>
      </ul>
    </div>
    <div class="book-recommend-section">
      <h4 class="title">你可能感兴趣
        <i class="tip"></i>
        <router-link :to="{path: '/bookRelated', query:{book_id: $route.query.id}}" class="recommend-more">
          <span>更多</span>
        </router-link>
      </h4>
      <div class="content">
        <router-link v-for='(item, index) in bookColummList' :key="index" :to="{path: '/book', query:{id: item._id}}">
          <img :src="STATIC_HOST + item.cover" :alt='item.title'>
          <span>{{ item.title }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import ListHeader from '@/components/header/listHeader.vue';
import Reviews from '@/components/reviewsView/reviewsView.vue';
import Loading from '@/components/loading/loading.vue';
import API from '../../api/api.js';
import store from 'storejs';
export default {
  // inject: ['reload'],
  components: {
    ListHeader,
    Reviews,
    Loading
  },
  props: {
    
  },
  data () {
    return {
      loading: false,
      title: '书籍详情',
      bookInfo: {},
      imgUrl: '',
      ifJoinBookcase: false,
      buttonLeftTextJoin: '加入书架',
      buttonLeftTextOut: '撤出书架',
      buttonRightText: '开始阅读',
      isIntroductionClick: false,
      reviewsData: [],
      bookColummList: [],
      STATIC_HOST: API.STATIC_HOST
    }
  },
  watch: {
    // 点击‘你可能感兴趣的书籍’，跳转本页，刷新页面
    '$route' (to, from) {
      if(this.$route.query.id) {
        this.loading = false;
        this.getBookInfo(this.$route.query.id);
      }
    }
  },
  mounted() {
    this.$store.state.isTabber = false;
    this.getBookInfo(this.$route.query.id);
    console.log('书架缓存', store.get("bookcase"));
  },
  computed: {

  },
  methods: {

    // 获取书籍详情
    getBookInfo: function (book_id) {
      this.axios.get(API.book.bookInfo(book_id))
        .then((res) => {
          // console.log('获取书籍详情-成功', res);
          // console.log('isSerial', res.data.isSerial);
          this.bookInfo = res.data;
          this.imgUrl = API.STATIC_HOST + this.bookInfo.cover;
          this.isBookcase();
          // console.log(this.bookInfo);
        })
        .catch((res) => {
          // console.log('获取书籍详情-失败', res);
        })
    },
    isBookcase: function () {
      console.log('书架', store.get("bookcase"));
      var arr = store.get("bookcase");
      var obj = {};
      // 是否存在书架缓存
      if(arr) {
        for(let i in arr) {
          // 是否存在此书的书架缓存，存在就将此书移到书架缓存的最前面
          if(arr[i].book_id === this.$route.query.id) {
            obj = arr[i];
            arr.splice(i, 1);
            this.ifJoinBookcase = true;
            break;
          }else{
            this.ifJoinBookcase = false;
          }
        }
        this.ifJoinBookcase ? arr.unshift(obj) : '';
        store.set("bookcase", arr);
      }else{
        this.ifJoinBookcase = false;
      }
      console.log('书架11', store.get("bookcase"));
      this.getBookReviews(this.$route.query.id, 2);
    },
    joinBookcase: function () {
      // console.log('书架缓存111', store.get("bookcase"));
      var obj = {};
      var arr = [];
      obj.book_id = this.$route.query.id;
      obj.title = this.bookInfo.title;
      obj.image = this.imgUrl;
      obj.index = 1;
      if(!this.ifJoinBookcase) {
        // 是否存在书架缓存
        if(store.get("bookcase")) {
          arr = store.get("bookcase");  // 获取书架缓存
          // console.log('arr111', arr);
          arr.push(obj);  // 将此书追加至arr
          // console.log(obj,arr);
          store.set("bookcase", arr);   // 加入书架缓存
        }else{
          // 是否存在阅读记录缓存
          if(store.get("bookIdMessage")) {
            for(let i in store.get("bookIdMessage")) {
              // 是否存在此书的阅读记录
              if(store.get("bookIdMessage")[i].book_id === this.$route.query.id) {
                obj.index = store.get("bookIdMessage")[i].index;
                break;
              }else{
                arr.push(obj);
                // console.log('arr', arr);
                store.set("bookcase", arr);
              }
            }
          }else{
            arr.push(obj);
            store.set("bookcase", arr);
          }
        }
        console.log('加入书架', store.get("bookcase"));
        this.ifJoinBookcase = true;
      }else {
        arr = store.get("bookcase");
        for(let i in arr) {
          if(arr[i].book_id === this.$route.query.id) {
            arr.splice(i, 1);
          }
        }
        store.set("bookcase", arr);
        console.log('撤出书架', store.get("bookcase"));
        this.ifJoinBookcase = false;
      }
    },
    latelyFollowerPoint: function(num) {
      if(num >= 10000) num = Math.round(num/10000) + '万';
      return num;
    },
    dateFtt: function(time) {
      let timeData = time.replace(/T/g,' ').replace(/\.[/d]{3}Z/,'');
      timeData = timeData.replace(/-/g, '/');
      let timestamp = Math.round(new Date(timeData).getTime() / 1000);
      let toTime = Math.round(new Date().getTime() / 1000);
      let timeDifference = toTime - timestamp;
      let timeString = '';
      if(this.bookInfo.isSerial){
        if(timeDifference < 3600) {
          timeString = Math.round(timeDifference / 60) + '分钟前更新';
        }else if(timeDifference >= 3600 && timeDifference < 86400) {
          timeString = Math.round(timeDifference / 3600) + '小时前更新';
        }else if(timeDifference >= 86400 && timeDifference < 2629800) {
          timeString = Math.round(timeDifference / 86400) + '天前更新';
        }else if(timeDifference >= 2629800 && timeDifference < 31557600) {
          timeString = Math.round(timeDifference / 2629800) + '月前更新';
        }else if(timeDifference >= 31557600) {
          timeString = Math.round(timeDifference / 31557600) + '年前更新';
        }
      }else{
        timeString = '完结';
      }
      return timeString;
    },
    latelyFollower: function(num) {
      if(num >= 10000) {
        num = Math.round(num/1000)/10;
        num = num.toFixed(1) + '万';
      }
      return num;
    },
    introductionToClick: function() {
      this.isIntroductionClick ? this.isIntroductionClick = false : this.isIntroductionClick = true;
    },
    getBookReviews: function (book_id, page_num) {
      this.axios.get(API.comment.bookReviews(book_id, page_num))
        .then((res) => {
          // console.log('获取长评-成功', res);
          this.reviewsData = res.data.reviews;
          this.getRelatedRecommendedBooks(book_id);
        })
        .catch((res) => {
          // console.log('获取长评-失败', res);
        })
    },
    // 获取相关书籍
    getRelatedRecommendedBooks: function (book_id) {
      this.axios.get(API.book.relatedRecommendedBooks(book_id))
        .then((res) => {
          // console.log('获取相关书籍-成功', res);
          for(let i = 0; i < 4; i ++) {
            this.bookColummList[i] = res.data.books[i]
          }
          // console.log('相关书籍', this.bookColummList);
          this.loading = true;
        })
        .catch((res) => {
          // console.log('获取相关书籍-失败', res);
        })
    },
    // routerToBook: function (book_id) {
    //   this.$router.push({path: '/book', query: {id: book_id}});
    //   this.reload();
    // }
    // routerBook: function () {
    //   this.reload();
    // }
  }
};
</script>
<style lang='scss' scoped>
.page-book{
  background-color: #f4f4f4;
}
.book-detail{
  padding: 1.067rem;
  background-color: #fff;
  .cover{
    float: left;
    width: 3.467rem;
    height: 4.667rem;
  }
  .desc{
    margin-left: 4rem;
    & > h1{
      height: 1.333rem;
      font-weight: 400;
      font-size: 16px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .sku{
      height: 1.333rem;
      font-size: 12px;
      color: #999;
      display: inline-block;
      & > p{
        display: inline-block;
        vertical-align: middle;
      }
      & > i{
        margin: 0 0.533rem;
        font-style: normal;
      }
    }
    .update{
      height: 1.067rem;
      color: #999;
    }
  }
}
.read-link{
  padding: 0 1.067rem 1.067rem;
  border-bottom: 1px solid #ebebeb;
  font-size: 0;
  background-color: #fff;
  display: flex;
  & > a{
    display: inline-block;
    vertical-align: middle;
    height: 2.347rem;
    line-height: 2.347rem;
    background-color: #b93321;
    border: 1px solid #b93321;
    border-radius: 2px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    width: 45%;
    margin-right: 5%;
    box-sizing: content-box;
    & > i{
      font-style: normal;

    }
  }
  .button-left{
    color: #b93321;
    background-color: #fff;
  }
  .subtract{
    border: 1px solid #999;
    background-color: #999;
    color: #fff;
  }
  .button-right{
    margin: 0 0 0 5%;
  }
}
.reader-data{
  padding: 1.067rem 0;
  border-bottom: 1px solid #ebebeb;
  font-size: 0;
  background-color: #fff;
  .item{
    display: inline-block;
    vertical-align: middle;
    width: 33.33%;
    text-align: center;
    .key{
      font-size: 12px;
      color: #999;
    }
    .data{
      margin-top: 0.267rem;
      font-size: 16px;
      line-height: 1.067rem;
    }
  }
}
.introduction{
  position: relative;
  padding: 1.067rem;
  background-color: #fff;
  & > p{
    line-height: 1.333rem;
    font-size: 13px;
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    -webkit-transition: all .4s ease;
  }
  .arrow{
    position: absolute;
    width: 1.067rem;
    height: 1.067rem;
    bottom: 0.933rem;
    right: 0.533rem;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAENklEQVR4Xu3dzW0TURTF8feClHXowIvYYukFyTolQAWYEqgASoAKCB3QAVnHkWAb2xIpwTTghybgKB8zztzxfNx3zvEO8oJ87//Hk5PNxKAX9QYi9fQaPggAOQIBEADyDZCPrxtAAMg3QD6+bgABIN8A+fi6AQSAfAPk4+sGEADyDZCPrxtAAMg3QD6+bgABIN8A+fi6AQSAfAPk4+sGEADyDZCPrxtAAMg3QD6+bgABIN8A+fi6AQSAfAPk4+sGEADyDZCPrxtAAMg3QD6+bgABIN8A+fi6AQSAfAPk4z+5ASaT03cxpVmKcb3ZbL6sVlcX5DvKdvyiZQjhzf8Bvi0Wl98fD/MAwGR88jXGOLt/aJPS++Vyfp7tFkjfeFnLsNl8uF5dfb6/kjsA4/HJ9CDGn2X7EoK8FJXGDyGklNaL5fxlKYDj49dnLw4OflSNKgR5IKiKv33314vLB7f+3R9ejaajdHj4e9eYQuAbwXPxU0p/Fsv5UekNUPzlZHL6KYbwUQh8hy57d8/FL74nhfD28QfBpz8FjE/OY4zFp8fKl24CX0DqxK9qVvqLoIkQ+Cq8493sE7/4Zyt/EygE/g3sG38ngNvPBLoJ3CpoI/6zAITAZ/+24tcCIAS+ELQZvzYAIfCBoO34JgBCMCyCLuKbAQjBMAi6it8IgBD0i6DL+I0BCEE/CLqOvxcAIegWQR/x9wYgBN0g6Ct+KwCEoF0EfcZvDYAQtIOg7/itAhCC/RAMEb91AELQDMFQ8TsBIAQ2BEPG7wyAENRDMHT8TgEIwW4EHuJ3DkAIyhF4id8LACF4iMBT/N4ACME/BN7i9wqAHYHH+L0DYEXgNf4gANgQeI4/GAAWBN7jDwoAHUEO8QcHgIogl/guAKAhyCm+GwAoCHKL7wpA7ghyjO8OQK4Ico3vEkBuCHKO7xZALghyj+8agHcECPHdA/CKACV+FgC8IUCKnw0ALwjQ4mcFYGgEiPGzAzAUAtT4WQLoGwFy/GwB9IUAPX7WALpGwBA/ewBdIWCJDwGgbQRM8WEAtIWALT4UgH0RMMaHA9AUAWt8SABWBMzxYQHURRBSuggxnhXnq17oT0eBfnRsnecdMMeHvgG2YZsiQP+fv90P9A3QFAFLfIobwIqAKT4VgDofDNni0wHYhYAxPiWAWwT3npBaPE41xDgre7T6rp8QUL5G8SGwKtZoND26ufm1RonZZA5qAE0WhvY9AoBW1DiPABgXhnZcANCKGucRAOPC0I4LAFpR4zwCYFwY2nEBQCtqnEcAjAtDOy4AaEWN8wiAcWFoxwUArahxHgEwLgztuACgFTXOIwDGhaEdFwC0osZ5BMC4MLTjAoBW1DiPABgXhnZcANCKGucRAOPC0I4LAFpR4zwCYFwY2nEBQCtqnEcAjAtDOy4AaEWN8wiAcWFoxwUArahxnr+aEMOu5NitsQAAAABJRU5ErkJggg==) 50% no-repeat;
    background-size: 60%;
    background-position: 50%;
    transition: all .1s ease;
    -moz-transition: all .1s ease;
    -webkit-transition: all .1s ease;
  }
  .active{
    height: auto !important;
    overflow: auto !important;
    display: block !important;
  }
  .up{
    transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
  }
}
.chapter-item{
  display: block;
  background-color: #fff;
  padding: 0 0 0 1.067rem;
  border-bottom: 1px solid #ebebeb;
  line-height: 1.067rem;
  color: #333;
  .inner{
    position: relative;
    font-size: 14px;
    padding: 1.067rem 0.533rem 1.067rem 0;
    border-top: 1px solid #f4f4f4;
    .arrow{
      float: right;
      width: 1.067rem;
      height: 1.067rem;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAENklEQVR4Xu3dzW0TURTF8feClHXowIvYYukFyTolQAWYEqgASoAKCB3QAVnHkWAb2xIpwTTghybgKB8zztzxfNx3zvEO8oJ87//Hk5PNxKAX9QYi9fQaPggAOQIBEADyDZCPrxtAAMg3QD6+bgABIN8A+fi6AQSAfAPk4+sGEADyDZCPrxtAAMg3QD6+bgABIN8A+fi6AQSAfAPk4+sGEADyDZCPrxtAAMg3QD6+bgABIN8A+fi6AQSAfAPk4+sGEADyDZCPrxtAAMg3QD6+bgABIN8A+fi6AQSAfAPk4z+5ASaT03cxpVmKcb3ZbL6sVlcX5DvKdvyiZQjhzf8Bvi0Wl98fD/MAwGR88jXGOLt/aJPS++Vyfp7tFkjfeFnLsNl8uF5dfb6/kjsA4/HJ9CDGn2X7EoK8FJXGDyGklNaL5fxlKYDj49dnLw4OflSNKgR5IKiKv33314vLB7f+3R9ejaajdHj4e9eYQuAbwXPxU0p/Fsv5UekNUPzlZHL6KYbwUQh8hy57d8/FL74nhfD28QfBpz8FjE/OY4zFp8fKl24CX0DqxK9qVvqLoIkQ+Cq8493sE7/4Zyt/EygE/g3sG38ngNvPBLoJ3CpoI/6zAITAZ/+24tcCIAS+ELQZvzYAIfCBoO34JgBCMCyCLuKbAQjBMAi6it8IgBD0i6DL+I0BCEE/CLqOvxcAIegWQR/x9wYgBN0g6Ct+KwCEoF0EfcZvDYAQtIOg7/itAhCC/RAMEb91AELQDMFQ8TsBIAQ2BEPG7wyAENRDMHT8TgEIwW4EHuJ3DkAIyhF4id8LACF4iMBT/N4ACME/BN7i9wqAHYHH+L0DYEXgNf4gANgQeI4/GAAWBN7jDwoAHUEO8QcHgIogl/guAKAhyCm+GwAoCHKL7wpA7ghyjO8OQK4Ico3vEkBuCHKO7xZALghyj+8agHcECPHdA/CKACV+FgC8IUCKnw0ALwjQ4mcFYGgEiPGzAzAUAtT4WQLoGwFy/GwB9IUAPX7WALpGwBA/ewBdIWCJDwGgbQRM8WEAtIWALT4UgH0RMMaHA9AUAWt8SABWBMzxYQHURRBSuggxnhXnq17oT0eBfnRsnecdMMeHvgG2YZsiQP+fv90P9A3QFAFLfIobwIqAKT4VgDofDNni0wHYhYAxPiWAWwT3npBaPE41xDgre7T6rp8QUL5G8SGwKtZoND26ufm1RonZZA5qAE0WhvY9AoBW1DiPABgXhnZcANCKGucRAOPC0I4LAFpR4zwCYFwY2nEBQCtqnEcAjAtDOy4AaEWN8wiAcWFoxwUArahxHgEwLgztuACgFTXOIwDGhaEdFwC0osZ5BMC4MLTjAoBW1DiPABgXhnZcANCKGucRAOPC0I4LAFpR4zwCYFwY2nEBQCtqnEcAjAtDOy4AaEWN8wiAcWFoxwUArahxnr+aEMOu5NitsQAAAABJRU5ErkJggg==) 50% no-repeat;
      background-size: 60%;
      background-repeat: no-repeat;
      transform: rotate(-90deg);
      -webkit-transform: rotate(-90deg);
      -moz-transform: rotate(-90deg);
    }
    & > span{
      float: right;
      max-width: 60%;
      color: #999;
      word-break: break-all;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
.book-recommend-section{
  background-color: #fff;
  font-size: 0;
  .title{
    position: relative;
    width: 100%;
    height: 2.4rem;
    padding: 0 .8rem;
    line-height: 2.4rem;
    font-size: 14px;
    overflow: hidden;
    text-align: left;
    .tip{
      position: absolute;
      left: 0;
      top: .8rem;
      width: 0.107rem;
      height: .8rem;
      background-color: #b93321;
    }
    .recommend-more{
      float: right;
      color: #b93321;
    }
  }
  .content{
    & > a{
      display: inline-block;
      width: 25%;
      height: 6.133rem;
      padding: 0 .8rem;
      text-align: left;
      overflow: hidden;
      img{
        height: 4.267rem;
      }
      span{
        display: block;
        height: 1.867rem;
        line-height: 1.867rem;
        color: #333;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 12px;
      }
    }
  }
}
</style>