<template>
  <Loading v-if='!loading'></Loading>
  <div v-else class="page-comment-detail">
    <ListHeader :title='$route.query.book_name'></ListHeader>
    <div class="page-comment-detail-body">
      <div class="commentList" id="scrollView">
        <div class="comment">
          <div class="author">
            <img class="avater" :src="STATIC_HOST + userInfo.reviews[0].author.avatar">
            <div class="right">
              <div class="nickname">{{ userInfo.reviews[0].author.nickname }}</div>
              <div class="updated">{{ getTimeNum(userInfo.reviews[0].updated) }}前</div>
            </div>
          </div>
          <p class="content">{{ userInfo.reviews[0].content }}</p>
        </div>
        <div class="replyNum">共{{ userInfo.reviews[0].commentCount }}条回复</div>
        <ul class="reply">
          <li v-for='item in userComments' ref='liView'>
            <Comments :commentsInfo='item'></Comments>
          </li>
          <div class="show-more">{{ moreText }}</div>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import ListHeader from '@/components/header/listHeader.vue';
import Loading from '@/components/loading/loading.vue';
import Comments from '@/components/reviewsView/comments.vue';
import API from '../../api/api.js';
export default{
  components: {
    ListHeader,
    Loading,
    Comments
  },
  props: {

  },
  data () {
    return {
      userInfo: {},
      userComments: [],
      loading: false,
      STATIC_HOST: API.STATIC_HOST,
      moreText: '正在加载...',
      isFun: true,
      start_num: 0,
      limit_num: 10,
      user_id_ls: ''
    }
  },
  mounted() {
    this.$store.state.isTabber = false;
    this.getUserInfo(this.$route.query.book_id, 1, this.$route.query.index);
    
  },
  methods: {
    // 无法直接获取用户的单个评论，使用书籍评论API，点击某个评论，传该评论的数组下标，用获取数量与下标来获取单个评论
    getUserInfo: function (book_id, page_num, index) {
      this.axios.get(API.comment.bookReviews(book_id, page_num, index))
        .then((res) => {
          // console.log('获取长评-成功', res);
          this.userInfo = res.data;
          this.getUserReview(this.userInfo.reviews[0]._id, this.start_num, this.limit_num);
        })
        .catch((res) => {
          console.log('获取长评-失败', res);
        })
    },
    getUserReview: function (user_id, start, limit) {
      this.axios.get(API.comment.userReview(user_id, start, limit))
        .then((res) => {
          // console.log('获取用户评论-成功', res);
          for(let i in res.data.comments) {
            this.userComments.push(res.data.comments[i]);
          }
          if(res.data.comments.length < 10) {
            this.start_num += res.data.comments.length;
            this.moreText = '没有更多评论';
          }else{
            this.start_num += 10;
            this.moreText = '正在加载...';
          }
          this.loading = true;
          this.isFun = true;
          this.getHtml();
        })
        .catch((res) => {
          console.log('获取用户评论-失败', res);
        })
    },
    getHtml: function() {
      this.$nextTick(() => {
        this.checkDivScroolTop();
      })
    },
    checkDivScroolTop: function() {
      const _this = this;
      const viewHeight = _this.$refs.liView[0].clientHeight;
      // 获取节点
      _this.scrollDiv = document.getElementById('scrollView');
      // 滚动事件
      _this.scrollDiv.addEventListener('scroll', function() {
        // console.log(_this.scrollDiv.clientHeight, _this.scrollDiv.scrollTop, viewHeight, _this.scrollDiv.scrollHeight);
        if(_this.scrollDiv.clientHeight + _this.scrollDiv.scrollTop >= _this.scrollDiv.scrollHeight) {
          if(_this.isFun) {
            _this.isFun = false;
            _this.getUserReview(_this.userInfo.reviews[0]._id, _this.start_num, _this.limit_num);
          }
        }
      });
    },
    getTimeNum: function(time) {
      let timeData = time.replace(/T/g,' ').replace(/\.[/d]{3}Z/,'');
      timeData = timeData.replace(/-/g, '/');
      let timestamp = Math.round(new Date(timeData).getTime() / 1000);
      let toTime = Math.round(new Date().getTime() / 1000);
      let timeDifference = toTime - timestamp;
      let timeString = '';
      if(timeDifference < 3600) {
        timeString = Math.round(timeDifference / 60) + '分钟';
      }else if(timeDifference >= 3600 && timeDifference < 86400) {
        timeString = Math.round(timeDifference / 3600) + '小时';
      }else if(timeDifference >= 86400 && timeDifference < 2629800) {
        timeString = Math.round(timeDifference / 86400) + '天';
      }else if(timeDifference >= 2629800 && timeDifference < 31557600) {
        timeString = Math.round(timeDifference / 2629800) + '月';
      }else if(timeDifference >= 31557600) {
        timeString = Math.round(timeDifference / 31557600) + '年';
      }
      return timeString;
    }
  }
}
</script>
<style lang='scss' scoped>
.page-comment-detail{
  width: 100%;
  height: 100%;
  overflow: hidden;
  .page-comment-detail-body{
    height: 100%;
    padding-bottom: 2.347rem;
    .commentList{
      height: 100%;
      overflow-y: auto;
      .comment{
        .author{
          padding: 1.067rem 0 .8rem .8rem;
          overflow: hidden;
          .avater{
            width: 1.813rem;
            height: 1.813rem;
            border-radius: 50%;
            float: left;
            margin-right: 0.533rem;
          }
          .right{
            float: left;
            height: 1.813rem;
            .nickname{
              font-size: .64rem;
              line-height: .64rem;
              color: #967c6c;
              margin-bottom: 0.427rem;
            }
            .updated{
              font-size: 0.533rem;
              line-height: 0.533rem;
              color: #999;
            }
          }
        }
        .content{
          padding: 0 .8rem 1.067rem;
          text-align: justify;
          font-size: .8rem;
          line-height: 1.173rem;
          overflow: hidden;
          color: #666;
        }
      }
      .replyNum{
        height: 2.133rem;
        line-height: 2.133rem;
        background-color: #f4f4f4;
        color: #999;
        padding-left: .8rem;
        font-size: .64rem;
      }
      .reply{
        li{
          padding: 1.067rem 0 0 .8rem;
          overflow: hidden;
        }
      }
    }
  }
}
</style>