<template>
  <div class="inner">
    <img class="avater" :src="STATIC_HOST + commentsInfo.author.avatar">
    <div class="right">
      <div class="author">
        <p class="nickname">{{ commentsInfo.author.nickname }}</p>
        <p class="updated">{{ getTimeNum(commentsInfo.created) }}前</p>
      </div>
      <p class="content">{{ commentsInfo.content }}</p>
    </div>
  </div>
</template>
<script>
import API from '../../api/api.js';
export default {
  components: {
    
  },
  props: {
    commentsInfo: Object
  },
  data () {
    return {
      STATIC_HOST: API.STATIC_HOST
    }
  },
  mounted() {
    
  },
  methods: {
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
};
</script>
<style lang='scss' scoped>
.inner{
  width: 100%;
  overflow: hidden;
  padding-bottom: .8rem;
  padding-right: .8rem;
  border-bottom: 1px solid #ebebeb;
  .avater{
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    float: left;
  }
  .right{
    width: 86%;
    float: right;
    .author{
      height: .8rem;
      overflow: hidden;
      margin-bottom: 0.533rem;
      .nickname{
        float: left;
        font-size: .64rem;
        color: #967c6c;
      }
      .updated{
        float: right;
        padding-top: 0.107rem;
        font-size: 0.533rem;
        color: #999;
      }
    }
    .content{
      font-size: .64rem;
      line-height: .96rem;
      text-align: justify;
      color: #333;
    }
  }
}
</style>