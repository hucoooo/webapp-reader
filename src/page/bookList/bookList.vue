<template>
  <div class="page-book-list" :style="{height: pageHeight + 'px'}">
    <ListHeader :title='$route.query.major' ref='header'></ListHeader>
    <div class="page-category-result-wraper">
      <div class="filter-item-wraper" v-if='isHeaderData' v-show='isHeader'>
        <ListMinor :list='typeList[0]' ref='list' @listenToChildEvent='bookClassName'></ListMinor>
        <ListMinor v-if='showMinor' :list='typeList[1]' @listenToChildEvent='bookClassName'></ListMinor>
      </div>
      <ListScrollHeader v-if='isHeaderData' v-show='!isHeader' @headerToChildEvent='headerEvent'></ListScrollHeader>
      <div class="list-wraper" id="scrollDiv" :style="{height: listMainHeight + 'px', marginTop: listMarginTop + 'px'}" ref="elememt">
        <div v-show='!isLoading' class="app-book-list" ref='book'>
          <BookView
            v-for='item in books'
            :bookDetails='item'
            :bookClass='$route.query.major'
            :isBookClass='true'
            ref='book_list_height'
          ></BookView>
          <div class="show-more" v-show='isMore'>{{ moreText }}</div>
          <NoData v-show='!isMore'></NoData>
        </div>
        <BookLoading v-show='isLoading' class='list-loading'></BookLoading>
      </div>
    </div>
  </div>
</template>
<script>
import ListHeader from '@/components/header/listHeader.vue';
import ListScrollHeader from '@/components/header/listScrollHeader.vue';
import ListMinor from '@/components/header/listMinorHeader.vue';
import BookView from '@/components/bookView/bookView.vue';
import NoData from '@/components/noData/noData.vue';
import BookLoading from '@/components/loading/bookLoading.vue';
import API from '../../api/api.js';
export default {
  components: {
    ListHeader,
    ListMinor,
    BookView,
    ListScrollHeader,
    NoData,
    BookLoading
  },
  data () {
    return {
      showMinor: false,
      pageHeight: 0,
      listMainHeight: 0,
      listMarginTop: 0,
      minorHeight: 0,
      isHeaderData: true,
      bookMinor: '',
      isScroll: true,
      books: [],
      scrollDiv: {},
      isHeader: true,
      isPush: false,
      isMore: true,
      isLoading: true,
      moreText: '正在加载...',
      typeList: [
        [
          {
            id: 'hot',
            name: '热门'
          },
          {
            id: 'new',
            name: '新书'
          },
          {
            id: 'reputation',
            name: '好评'
          },
          {
            id: 'over',
            name: '完结'
          },
          {
            id: 'monthly',
            name: '包月'
          }
        ],
        []
      ],
      indexBooks: [this.$route.query.gender, 'hot', this.$route.query.major, '', 0]
    }
  },
  created () {
    
  },
  mounted () {
    this.$store.state.isTabber = false;
    this.pageHeight = document.documentElement.clientHeight;
    this.getIndexBooks(...this.indexBooks);
    this.checkDivScroolTop();
    if(this.$route.query.gender === 'press') {
      this.isHeaderData = false;
      this.listMarginTop = 0;
      this.listMainHeight = this.pageHeight - this.$refs.header.$el.offsetHeight;
    }else{
      this.getMinor();
    }
  },
  methods: {
     // 计算页面高度、书籍列表上边距
    bookListStyle: function() {
      this.minorHeight = this.$refs.list.$el.offsetHeight;
      if(this.showMinor) {
        this.listMainHeight = this.pageHeight - this.$refs.header.$el.offsetHeight - this.minorHeight * 2;
        this.listMarginTop = this.minorHeight * 2;
      }else{
        this.listMainHeight = this.pageHeight - this.$refs.header.$el.offsetHeight - this.minorHeight;
        this.listMarginTop = this.minorHeight;
      }
    },
    // 获取书籍列表信息（性别，排行类型，大类，小类，页码）
    getIndexBooks: function (gender, type, major, minor, start) {
      if(this.isPush){
        this.isLoading = false;
        this.isHeader = false;
      }
      else{
        this.isLoading = true;
        this.isHeader = true;
      }
      this.axios.get(API.classification.getCatsBooks(gender, type, major, minor, start))
        .then((res) => {
          // console.log('分类书籍', res);
           // 是否是滚动加载页面
          if(this.isPush) {
            this.books = this.books.concat(res.data.books);
            if(res.data.books.length === 0) {
              this.moreText = '没有更多书籍';
            }else{
              this.moreText = '正在加载...';
            }
          }else{
            this.isLoading = true;
            this.books = res.data.books;
            this.scrollDiv.scrollTop = 0;
            if(res.data.books.length === 0) {
              this.isMore = false;
            }else{
              this.isMore = true;
            }
            if(res.data.books.length < 20){
              this.moreText = '没有更多书籍';
            }else{
              this.moreText = '正在加载...';
            }
          }
          this.isLoading = false;
          console.log( this.isHeader);
        })
        .catch((res) => {
          console.log('分类书籍error', res);
        });
    },
    //获取二级分类及数目 
    getMinor: function() {
      this.axios.get(API.classification.getMinor)
        .then((res) => {
          // console.log('二级分类及数目', res);
          const classData = res.data[this.$route.query.gender];
          for (let i = 0; i < classData.length; i ++) {
            if(classData[i].major === this.$route.query.major) {
              if(classData[i].mins.length > 0) {
                classData[i].mins.unshift('全部');
                const typeListArr = [];
                for(let j = 0; j < classData[i].mins.length; j ++) {
                  typeListArr[j] = new Object();
                  typeListArr[j].type = classData[i].mins[j];
                  typeListArr[j].name = classData[i].mins[j];
                }
                this.typeList[1] = typeListArr;
                this.typeList[1][0].type = '';
                this.showMinor = true;
              }else {
                this.showMinor = false;
              }
              this.bookListStyle();
            }
          }
        })
        .catch((res) => {
          console.log('二级分类及数目error', res);
        });
    },
    checkDivScroolTop: function () {
      const _this = this;
      // 获取节点
      _this.scrollDiv = document.getElementById('scrollDiv');
      // 滚动事件
      _this.scrollDiv.addEventListener('scroll', function() {
         // 滚动距离超过单个列表高度，分类header切换 并计算列表上边距
        if(_this.scrollDiv.scrollTop > _this.$refs.book_list_height[0].$el.clientHeight) {
          _this.isHeader = false;
          _this.listMarginTop = _this.minorHeight;
          _this.listMainHeight = _this.pageHeight - _this.$refs.header.$el.offsetHeight - _this.minorHeight;
        }else{
          _this.isHeader = true;
          if(_this.showMinor) {
            _this.listMarginTop = _this.minorHeight * 2;
            _this.listMainHeight = _this.pageHeight - _this.$refs.header.$el.offsetHeight - _this.minorHeight * 2;
          }else{
            _this.listMarginTop = _this.minorHeight;
            _this.listMainHeight = _this.pageHeight - _this.$refs.header.$el.offsetHeight - _this.minorHeight;
          }
        }
        if(_this.scrollDiv.clientHeight + _this.scrollDiv.scrollTop === _this.$refs.book.clientHeight) {
          _this.isPush = true;
          _this.indexBooks[4] += 20; // 每次滚动加载  页码+20
          _this.getIndexBooks(..._this.indexBooks);
        }
      });
    },
    bookClassName: function(data) {
      this.isPush = false;
      this.indexBooks[4] = 0; // 页码初始化
      this.indexBooks[1] = data.major.id;
      this.indexBooks[3] = data.minor.type;
      if(this.indexBooks[3] === '全部') this.indexBooks[3] = '';
      this.getIndexBooks(...this.indexBooks);
    },
    headerEvent: function(data) {
      this.isHeader = data;
    }
  }
};
</script>
<style lang='scss' scoped>
.page-book-list{
  width: 100%;
  overflow: hidden;
}
.list{
  width: 20.0rem;
  height: 1rem;
  background-color: red;
}
.page-category-result-wraper{
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: #f5f2ed;
}
.filter-item-wraper{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  color: #666;
  background-color: #fff;
  opacity: 1;
  -webkit-transition: all .1s ease;
  z-index: 100;
}
.list-wraper{
  position: relative;
  width: 100%;
  overflow-y: auto;
  margin-top: 4.8rem;
}
.app-book-list{
  background-color: #f5f2ed;
}
.list-loading{
  z-index: 9;
  background-color: rgb(245, 242, 237);
  position: absolute;
}
</style>