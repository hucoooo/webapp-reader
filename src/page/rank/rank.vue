<template>
  <Loading v-if='!loading'></Loading>
  <div class="bookRank" v-else>
    <div class="book-rank-view" v-for='(item, index) in rank' :key='index'>
      <div class="ranking-herder">
        <h1>{{ item.name }}</h1>
      </div>
      <div class="ranking-body">
        <ul class="ranking-list">
          <li class="ranking-item" v-for="(rank, index) in item.data" v-if="!rank.collapse" :key='index'>
            <router-link
              :to="{path: '/ranking', query:{ gender: item.minor, title: rank.title, id: rank._id }}"
            >
              <img :src="STATIC_HOST+rank.cover">
              <span class="bottom-line">{{ rank.title }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from '@/components/loading/loading.vue';
import API from '../../api/api.js';
export default {
  components: {
    Loading
  },
  data() {
    return {
      loading: false,
      STATIC_HOST: API.STATIC_HOST, // 静态资源地址
      rank: [
        {
          minor: 'male',
          name: '男生',
          data: []
        },
        {
          minor: 'female',
          name: '女生',
          data: []
        }
      ]
    }
  },
  mounted() {
    this.$store.state.isTabber = true;
    this.getRankCategory();
  },
  methods: {
    // 获取排行榜
    getRankCategory: function() {
      this.axios.get(API.rank.rankCategory)
        .then((res) => {
          // console.log('排行榜', res);
          for (let key in res.data) {
            for (let i = 0; i < res.data[key].length; i++) {
              // 将追书替换
              res.data[key][i].title = res.data[key][i].title.replace('追书', 'DB小说');
            }
          }
          for(let i in this.rank) {
            let bookRank = this.rank[i].minor;
            this.rank[i].data = res.data[bookRank];
          }
          this.loading = true;
          console.log('rank', this.rank);
        })
        .catch((res) => {
          console.log('排行榜error', res);
        });
    }
  }
};
</script>
<style lang='scss' scoped>
  .bookRank{
    margin-bottom: 4rem;
  }
  .book-rank-view{
    h1{
      padding-left: .8rem;
      padding-top: 0.533rem;
      height: 2.88rem;
      line-height: 2.347rem;
      font-weight: 400;
      color: #999;
      background-color: #e6e6e6;
    }
    .ranking-item{
      position: relative;
      height: 3.2rem;
      a{
        display: inline-block;
        width: 100%;
        height: 100%;
        img{
          float: left;
          width: 1.6rem;
          height: 1.6rem;
          margin: .8rem 0 0 .8rem;
        }
        span{
          display: block;
          color: #333;
          font-size: 14px;
          font-weight: 500;
          height: 100%;
          line-height: 3.2rem;
          margin-left: 2.933rem;
        }
      }
    }
  }
</style>