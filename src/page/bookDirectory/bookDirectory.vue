<template>
  <div class="page-directory">
    <ListHeader :title='title'></ListHeader>
    <div>
      <div class="page-directory-body">
        <div class="chapter-header">
          <div class="chapter-header-left">
            <h3 class="chapter-title">目录</h3>
            <span class="chapter-title-desc">共{{ chapterNum }}章</span>
          </div>
          <span class="chapterBtn" @click="arrayReverse()">{{ isReverse ? '正序' : '倒序' }}</span>
        </div>
        <div class="chapter-body">
          <ul class="chapter-list">
            <li v-for="(item, index) in chapters" :key="index">
              <!-- <router-link :to="{path: '/reader', query: {book_id: $route.query.book_id, chapters: index + 1}}">{{ index + 1 }}&nbsp;{{ item.title }}</router-link> -->
              <router-link :to="{path: '/reader', query: {book_id: $route.query.book_id, index: index + 1}}">{{ index + 1 }}&nbsp;{{ item.title }}</router-link>
            </li>
          </ul>
        </div>
      </div>
      <BookLoading v-show='!isLoading'></BookLoading>
    </div>
  </div>
</template>
<script>
import ListHeader from '@/components/header/listHeader.vue';
import BookLoading from '@/components/loading/bookLoading.vue';
import API from '../../api/api.js';
export default {
  components: {
    ListHeader,
    BookLoading
  },
  data() {
    return {
      isLoading: false,
      chapterNum: 0,
      title: '目录',
      chapters: [],
      isReverse: false
    }
  },
  mounted() {
    this.$store.state.isTabber = false;
    this.getBookSources(this.$route.query.book_id);
  },
  methods: {
    getBookSources: function (book_id) {
      this.axios.get(API.book.bookSources(book_id))
        .then((res) => {
          // console.log('获取书源-成功', res);
          this.chapterNum = res.data[1].chaptersCount;
          this.getBookChapters(res.data[1]._id);
        })
        .catch((res) => {
          console.log('获取书源-失败', res);
        })
    },
    getBookChapters: function (book_id) {
      this.axios.get(API.book.bookChapters(book_id))
        .then((res) => {
          // console.log('获取书籍章节-成功', res);
          let arr = res.data.chapters;
          this.chapters = res.data.chapters;
          this.isLoading = true;
        })
        .catch((res) => {
          console.log('获取书籍章节-失败', res);
        })
    },
    arrayReverse: function () {
      this.isReverse ? this.isReverse = false : this.isReverse = true;
      this.chapters.reverse();
    }
  }
};
</script>
<style lang='scss' scoped>
  .page-directory-body{
    .chapter-header{
      width: 100%;
      padding: .8rem 1.067rem;
      font-size: 16px;
      border-bottom: 1px solid #f8f8f8;
      .chapter-header-left{
        display: inline;
        .chapter-title{
          font-size: 14px;
          display: inline;
        }
        .chapter-title-desc{
          color: #999;
          padding-left: 0.267rem;
        }
      }
      .chapterBtn{
        float: right;
        font-size: 14px;
      }
    }
    .chapter-body{
      .chapter-list{
        display: block;
        li{
          height: 2.667rem;
          line-height: 2.667rem;
          border-bottom: 1px solid #f8f8f8;
          margin-left: 1.067rem;
          a{
            position: relative;
            display: inline-block;
            padding-right: 2.133rem;
            width: 100%;
            height: 100%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            color: #999;
          }
        }
      }
    }
  }
</style>