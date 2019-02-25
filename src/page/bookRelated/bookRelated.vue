<template>
  <div class="page-related-book">
    <ListHeader :title='title'></ListHeader>
    <div class="related-book-view">
      <div class="related-book-body">
        <div class="related-book-list">
          <BookLoading v-if='!loading'></BookLoading>
          <BookView
            v-else
            v-for='item in bookColummList'
            :bookDetails='item'
            :isBookClass='false'
          ></BookView>
          <div class="show-more">没有更多书籍</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ListHeader from '@/components/header/listHeader.vue';
import BookView from '@/components/bookView/bookView.vue';
import BookLoading from '@/components/loading/bookLoading.vue';
import API from '../../api/api.js';
export default {
  components: {
    ListHeader,
    BookView,
    BookLoading
  },
  props: {
    
  },
  data () {
    return {
      bookColummList: [],
      title: '你可能感兴趣的',
      loading: false
    }
  },
  mounted() {
    this.$store.state.isTabber = false;
    this.getRelatedRecommendedBooks(this.$route.query.book_id);
  },
  methods: {
    // 获取相关书籍
    getRelatedRecommendedBooks: function (book_id) {
      this.axios.get(API.book.relatedRecommendedBooks(book_id))
        .then((res) => {
          console.log('获取相关书籍-成功', res);
          for(let i = 0; i < res.data.books.length; i ++) {
            this.bookColummList[i] = res.data.books[i]
          }
          console.log('相关书籍', this.bookColummList);
          this.loading = true;
        })
        .catch((res) => {
          console.log('获取相关书籍-失败', res);
        })
    }
  }
};
</script>
<style lang='scss' scoped>
.page-related-book{
  height: 100%;
  overflow: hidden;
}
.related-book-view{
  height: 100%;
  padding-bottom: 2.347rem;
  .related-book-body{
    width: 100%;
    height: 100%;
    .related-book-list{
      height: 100%;
      overflow-y: auto;
    }
  }
}
</style>