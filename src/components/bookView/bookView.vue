<template>
  <router-link ref='list' :to="{path: '/book', query:{id: bookDetails._id}}">
    <div class="inner">
      <div class="cover">
        <img :src="STATIC_HOST + bookDetails.cover">
      </div>
      <div class="right">
        <h2 class="name">{{ bookDetails.title }}</h2>
        <p>{{ bookDetails.author }} <span v-if='isBookClass' class="split">|</span>{{ bookClass }}</p>
        <p>{{ bookDetails.shortIntro }}</p>
        <p class="important">
          <span class="color-red">{{ latelyFollower() }}</span>人气
          <span>
            <span class="split">|</span>
            <span class="color-red">{{ bookDetails.retentionRatio }}%</span>读者留存
          </span>
        </p>
      </div>
    </div>
  </router-link>
</template>
<script>
export default {
  props: {
    bookDetails: Object,
    bookClass: String,
    isBookClass: Boolean
  },
  data () {
    return {
      STATIC_HOST: 'https://statics.zhuishushenqi.com',
    }
  },
  mounted() {
    // console.log('bookDetails', this.bookDetails);
    this.bookListViewH();
  },
  methods: {
    bookListViewH: function() {
      this.$store.state.bookListViewH = this.$refs.list.clientHeight;
    },
    latelyFollower: function() {
      if(this.bookDetails.latelyFollower >= 10000) {
        const num = Math.round(this.bookDetails.latelyFollower/1000)/10;
        this.bookDetails.latelyFollower = num.toFixed(1) + '万';
      }
      return this.bookDetails.latelyFollower;
    }
  }
};
</script>
<style lang='scss' scoped>
  a{
    display: block;
    padding-left: .8rem;
    & > .inner{
      background-size: 100% 1px;
      background-image: linear-gradient(180deg,transparent 50%,#ddd 0);
      background-repeat: no-repeat;
      background-position: bottom;
      padding: .8rem .8rem .8rem 0;
      & > .cover{
        float: left;
        width: 3.2rem;
        height: 4rem;
        border: 1px solid #ebebeb;
        // background: url(/image/38b2adca9779.img-bk.png) no-repeat;
        // background-position: 50%;
        // background-size: 100%;
        overflow: hidden;
      }
      & > .right{
        height: 4rem;
        margin-left: 4rem;
        & > .name{
          height: 1.067rem;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          line-height: 1.013rem;
          color: #333!important;
          font-size: 14px;
        }
        & > p{
          line-height: 1.067rem;
          height: 1.067rem;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          color: #999;
        }
        .split{
          padding: 0 0.533rem;
        }
        .important{
          color: #666;
          .color-red{
            color: #b93321;
          }
        }
      }
    }
  }
</style>