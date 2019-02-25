<template>
  <!-- user_id: 用户ID   book_id: 书籍ID   book_name： 书籍名称  index： 该评论所在数组的下标 -->
  <router-link :to="{path: '/commentDetail', query:{user_id: reviews._id, book_id: book_id, book_name: title, index: reviewsIndex}}">
    <div class="inner">
      <img class="avater" :src="imgUrl">
      <div class="right">
        <p class="name">{{ reviews.author.nickname }}</p>
        <p class="title">{{ reviews.title }}</p>
        <Score :level='reviews.rating'></Score>
        <p class="content">{{ reviews.content }}</p>
        <span class="love">
          <p>{{ dateFtt(reviews.updated) }}前</p>
          <p>{{ reviews.likeCount }}人觉得有用</p>
        </span>
      </div>
    </div>
  </router-link>
</template>
<script>
import Score from '@/components/score/score.vue';
import API from '../../api/api.js';
export default {
  components: {
    Score
  },
  props: {
    reviews: Object,
    title: String,
    book_id: String,
    reviewsIndex: Number
  },
  data () {
    return {
      imgUrl: ''
    }
  },
  created() {
    
  },
  mounted() {
    this.getReviews();
  },
  methods: {
    getReviews: function () {
      this.imgUrl = API.STATIC_HOST + this.reviews.author.avatar;
    },
    dateFtt: function(time) {
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
};
</script>
<style lang='scss' scoped>
a{
  display: block;
}
.inner{
  position: relative;
  padding-left: 2.4rem;
  padding-right: 1.067rem;
  padding-bottom: 0.427rem;
  border-bottom: 1px solid #ebebeb;
  .avater{
    position: absolute;
    top: 0;
    left: 0;
    width: 1.867rem;
    height: 1.867rem;
    border-radius: 50%;
  }
  .right{
    .name{
      height: .8rem;
      line-height: .8rem;
      color: #a58d5e;
      font-size: 12px;
    }
    .title{
      height: 1.067rem;
      line-height: 1.333rem;
      font-weight: 700;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      color: #000;
    }
    .content{
      height: 2.133rem;
      overflow: hidden;
      line-height: 1.067rem;
      text-align: justify;
      color: #999;
    }
    .love{
      padding-top: 0.267rem;
      height: 1.067rem;
      overflow: hidden;
      display: inline-block;
      width: 100%;
      color: #999;
      & > p:first-child{
        float: left;
      }
      & > p:last-child{
        float: right;
      }
    }
  }
}
</style>