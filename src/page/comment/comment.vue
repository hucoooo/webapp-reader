<template>
  <div style="height: 100%;">
    <Loading v-if='!loading'></Loading>
    <div v-else class="screen-page-wraper">
      <ListHeader :title='$route.query.title' ref='reviewsHeader'></ListHeader>
      <div class="screen-page-body">
        <div class="hot-comment">
          <ul class="comment-list" id="scrollView">
            <li v-for='(item, index) in reviewsData'>
              <!-- reviews：评论数据   title：书籍名称   book_id：书籍ID  reviewsIndex：该评论所在数组下标 -->
              <Reviews :reviews='item' :title='$route.query.title' :book_id='$route.query.book_id' :reviewsIndex='index'></Reviews>
            </li>
            <div class="show-more">{{ moreText }}</div>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ListHeader from '@/components/header/listHeader.vue';
import Loading from '@/components/loading/loading.vue';
import Reviews from '@/components/reviewsView/reviewsView.vue';
import API from '../../api/api.js';
export default {
  components: {
    ListHeader,
    Loading,
    Reviews
  },
  props: {
    
  },
  data () {
    return {
      loading: false,
      reviewsData: [],
      page_num: 10,
      start_num: 0,
      isFun: true,
      moreText: '正在加载...'
    }
  },
  created() {
    
  },
  mounted() {
    this.$store.state.isTabber = false;
    this.getBookReviews(this.$route.query.book_id, this.page_num, this.start_num);
    
  },
  methods: {
    getBookReviews: function (book_id, page_num, start_num) {
      this.axios.get(API.comment.bookReviews(book_id, page_num, start_num))
        .then((res) => {
          // console.log('获取长评-成功', res);
          if(this.reviewsData.length === res.data.total) {
            this.moreText = '没有更多评论'
          }else{
            this.start_num += 10;
            this.moreText = '正在加载...'
          }
          for(let i in res.data.reviews) {
            this.reviewsData.push(res.data.reviews[i]);
          }
          this.loading = true;
          this.isFun = true;
          this.getHageHeight();
        })
        .catch((res) => {
          // console.log('获取长评-失败', res);
        })
    },
    getHageHeight: function () {
      this.$nextTick(() => {
        this.windowHeight = document.documentElement.clientHeight;
        this.checkDivScroolTop();
      })
    },
    checkDivScroolTop: function() {
      const _this = this;
      // 获取节点
      _this.scrollDiv = document.getElementById('scrollView');
      // 滚动事件
      _this.scrollDiv.addEventListener('scroll', function() {
        if(_this.scrollDiv.clientHeight + _this.scrollDiv.scrollTop === _this.scrollDiv.scrollHeight) {
          if(_this.isFun) {
            _this.isFun = false;
            _this.getBookReviews(_this.$route.query.book_id, _this.page_num, _this.start_num);
          }
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.screen-page-wraper{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.screen-page-body{
  height: 100%;
  padding-bottom: 2.347rem;
  .hot-comment{
    height: 100%;
    overflow: hidden;
    .comment-list{
      width: 100%;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      li:first-child{
        padding-top: 1.067rem;
      }
    }
  }
}
</style>