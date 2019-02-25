<template>
  <Loading v-if='!isLoading'></Loading>
  <div v-else class="page-search">
    <ListHeader :title='title'></ListHeader>
    <div class="search-body">
      <div class="search-list" id="scrollViewList">
        <BookView
          v-for='(item, index) in searchBooks'
          :key='index'
          :bookDetails='item'
          :bookClass='item.cat'
          :isBookClass='true'
					ref='bookList'
        >
        </BookView>
        <div class="show-more">{{ moreText }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import ListHeader from '@/components/header/listHeader.vue';
import BookView from '@/components/bookView/bookView.vue';
import Loading from '@/components/loading/loading.vue';
import API from '../../api/api.js';
import store from 'storejs';
export default {
  components: {
    BookView,
    ListHeader,
    Loading
  },
  data() {
    return {
      isLoading: false,
      searchBooks: [],
      booksNum: 30,
      moreText: '正在加载...',
      title: `跟“${this.$route.query.val}”有关的书籍`,
      start: 0,
			limit: 20,
			isAxios: false
    }
  },
  mounted() {
    this.$store.state.isTabber = false;
    this.getBookSearch(this.start, this.limit, this.$route.query.val);
    this.setSearchRecord();
  },
  methods: {
    setSearchRecord: function () {
      var arr = [];
      var val = this.$route.query.val;
      // 是否存在搜索历史缓存
      if(store.get("searchRecord")) {
        arr = store.get("searchRecord");
        var isArr = arr.indexOf(val) === -1 ? false : true;
        var isArr1 = false;
        for(var i = 0; i < arr.length; i ++) {
          if(arr[i] === val) {
            arr.splice(i, 1);
            arr.unshift(val);
            break;
          }
        }
        isArr ? '' : ( (arr.length < 5 ? '' : arr.pop() ), arr.unshift(val) );
      }else {
        arr.unshift(val);
      }
      store.set("searchRecord", arr);
    },
    getBookSearch: function (start, limit, content) {
      // console.log('limit', limit);
      if(this.searchBooks.length < this.booksNum) {
        this.axios.get(API.book.bookSearch(start, limit, content))
          .then((res) => {
            // console.log('搜索结果页面-成功', res);
            if(res.data.books.length < limit) this.moreText = '没有你更多书籍';
						this.booksNum = res.data.total;
            for(let i in res.data.books) {
              this.searchBooks.push(res.data.books[i]);
            }
						// this.searchBooks = res.data.books;
						this.isAxios = true;
            this.isLoading = true;
						this.getDocument();
          })
          .catch((res) => {
            console.log('搜索结果页面-失败', res);
          });
      }else{
        this.moreText = '没有你更多书籍';
      }
    },
		getDocument: function () {
			this.$nextTick(() => {
			  this.scrollView();
			})
		},
		scrollView: function () {
			const _this = this;
			const scrollDiv = document.getElementById('scrollViewList');
			const bookListView = _this.$refs.bookList[0].$el.clientHeight;
			scrollDiv.addEventListener('scroll', function() {
				if(scrollDiv.clientHeight + scrollDiv.scrollTop + bookListView >= scrollDiv.scrollHeight) {
					if(_this.isAxios) {
						_this.isAxios = false;
            _this.start += 20;
						_this.getBookSearch(_this.start, _this.limit, _this.$route.query.val);
					}
				}
			})
		}
  }
};
</script>
<style lang='scss' scoped>
.page-search{
  height: 100%;
  overflow: hidden;
  .search-body{
    height: 100%;
    padding-bottom: 2.347rem;
    .search-list{
      height: 100%;
      overflow-y: auto;
      background-color: #f5f2ed;
    }
  }
}
</style>