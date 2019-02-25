<template>
  <div class="page-ranking" :style="{height: pageHeight + 'px'}">
    <ListHeader :title='$route.query.title'></ListHeader>
    <div class="page-book-ranking-body">
      <div class="ranking-detail-wraper">
        <RankingHeader :id='ids' @rankingToChildEvent='getRankInfo'></RankingHeader>
        <div class="ranking-detail-list-wraper">
          <BookView
            v-show='!isLoading'
            v-for='item in books'
            :bookDetails='item'
            :isBookClass='false'
          ></BookView>
          <div class="show-more">{{ moreText }}</div>
        </div>
      </div>
      <BookLoading v-show='isLoading' class='ranking-loading'></BookLoading>
    </div>
  </div>
</template>
<script>
import ListHeader from '@/components/header/listHeader.vue';
import RankingHeader from '@/components/header/rankingHeader.vue';
import BookView from '@/components/bookView/bookView.vue';
import BookLoading from '@/components/loading/bookLoading.vue';
import API from '../../api/api.js';
export default {
  components: {
    BookView,
    ListHeader,
    RankingHeader,
    BookLoading
  },
  data() {
    return {
      isLoading: true,
      pageHeight: 0,
      books: {},
      moreText: '没有更多书籍',
      ids: []
    }
  },
  mounted() {
    this.$store.state.isTabber = false;
    this.pageHeight = document.documentElement.clientHeight;
    this.getRankCategory();
    this.getRankInfo(this.$route.query.id);
    // console.log('111', this.$route);
  },
  methods: {
    getRankInfo: function(data) {
      this.isLoading = true;
      if(data !== undefined) {
        this.axios.get(API.rank.rankInfo(data))
          .then((res) => {
            // console.log('分类排行榜', res);
            this.books = res.data.ranking.books;
            this.isLoading = false;
          })
          .catch((res) => {

          })
      }else{
        this.books = {};
        this.isLoading = false;
      }
    },
    // 获取排行榜
    getRankCategory: function() {
      const key = this.$route.query.gender;
      this.axios.get(API.rank.rankCategory)
        .then((res) => {
          // console.log('ranking排行榜', res);
          for(let i = 0; i < res.data[key].length; i ++) {
            res.data[key][i].title = res.data[key][i].title.replace('追书', 'DB小说');
            if(res.data[key][i].title === this.$route.query.title) {
              this.ids[0] = res.data[key][i]._id;
              this.ids[1] = res.data[key][i].monthRank;
              this.ids[2] = res.data[key][i].totalRank;
            }
          }
          // console.log('ids', this.ids);
        })
        .catch((res) => {
          console.log('排行榜error', res);
        });
    }
  }
};
</script>
<style lang='scss' scoped>
.page-ranking{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.page-book-ranking-body{
  height: 100%;
  padding-bottom: 2.347rem;
  .ranking-detail-wraper{
    height: 100%;
    .ranking-detail-list-wraper{
      height: 100%;
      padding-bottom: 2.88rem;
      overflow-y: auto;
      background-color: #f5f2ed;
    }
  }
}
.ranking-loading{
  z-index: 9;
  background-color: rgb(245, 242, 237);
  position: absolute;
}
</style>