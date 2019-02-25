<template>
  <div class="page-reader" :style="{color: bookMessage.color, backgroundColor: bookMessage.backgroundColor}" ref='viewBox' @click="isShow = true" v-if="isOk">
    <div class="reader-content-details" v-show='isLoading'>
      <div v-for="(item, index) in textContent" :key="index">
        <h1 :style="{fontSize: bookMessage.titleFontSize + 'px'}">{{ item.title }}</h1>
        <article class="read-content">
          <div class="inner" :style="{fontSize: bookMessage.textFontSize + 'px'}" v-html='item.content'></div>
        </article>
      </div>
      <div class="scroll-loading">
        <div class="loader">
          <div class="loader-inner">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-read-option" :class="{showPanel: isShow}" v-on:click.stop="panelClick()">
      <div class="top-controll-bar" ref="panelTop">
        <span class="back" @click="back()">
          <i class="icon"></i>
          <i>返回</i>
        </span>
        <h2>{{ bookTitle }}</h2>
        <span class="menu">
          <i class="icon"></i>
          <ul class="drop-down">
            <li>
              <router-link :to="{path: '/'}">
                <i class="menu-icon"></i>
                <span>首页</span>
              </router-link>
            </li>
            <li>
              <router-link :to="{path: '/'}">
                <i class="menu-icon"></i>
                <span>书架</span>
              </router-link>
            </li>
            <li>
              <router-link :to="{path: '/book', query: {id: $route.query.book_id}}">
                <i class="menu-icon"></i>
                <span>详情</span>
              </router-link>
            </li>
          </ul>
        </span>
      </div>
      <div class="bottom-controll-panel" ref="panelBottom">
        <div class="toBookShelf" @click="jionBookcase()">{{ isBookcase ? "撤出书架" : "加入书架" }}</div>
        <div class="item-font">
          <span
            class="font-size-change btn"
            :class="bookMessage.lineWidth === 0 ? 'disable' : ''"
            @click="fontSizeMinus()"
          >
            Aa-
          </span>
          <span class="font-size-line btn">
            <span class="content" :style="{width: bookMessage.lineWidth + '%'}"></span>
          </span>
          <span
            class="font-size-change btn"
            :class="bookMessage.lineWidth === 100 ? 'disable' : ''"
            @click="fontSizeAdd()"
          >
            Aa+
          </span>
        </div>
        <div class="item-btn">
          <span
            v-for="(item, index) in readerModel"
            :key="index"
            class="square btn"
            :class="{active: item.class}"
            v-on:click="isAcitve(index)"
          >
            {{ item.text }}
          </span>
        </div>
        <div class="item-footer">
          <span class="chapter-btn-w btn">上一章</span>
          <span class="directory btn" @click="directoryShowClick()">目录</span>
          <span class="chapter-btn-w btn f-r">下一章</span>
        </div>
      </div>
    </div>
    <div class="page-read-chapter-list" :class="{'show-panel': directoryShow}" @click.stop="directoryClick()">
      <div class="content" ref="directory">
        <div class="top-bar">
          <span>{{ bookTitle }}</span>
          <span>目录</span>
        </div>
        <ul class="directory-list">
          <li v-for="(item, index) in bookChapters" :key="index">
            <a @click="readerDirectory(index + 1)">
              <span class="title" :class="{active: (index + 1) == $route.query.index}">{{ index + 1 }}-{{ item.title }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <BookLoading v-show='!isLoading'></BookLoading>
  </div>
  <div class="no-book" v-else>
    <span>此书失联，<span class="back" @click="back()">点此返回</span></span>
  </div>
</template>
<script>
import BookLoading from '@/components/loading/bookLoading.vue';
import API from '../../api/api.js';
import store from 'storejs';
export default {
  components: {
    BookLoading
  },
  data() {
    return {
      isLoading: false,   // 是否加载完成
      isOk: true,
      textContent: [],
      isLoadingChapter: false,
      bookTitle: '书名',
      isShow: false,
      directoryShow: false,
      bookChapters: [],
      bookIdMessage: [],
      readerRecord: {},
      isBookcase: false,
      storageSourceIsBook: '',   // 跳转过来的路径名
      imgUrl: '',
      bookMessage: {
        lineWidth: 0,
        titleFontSize: 20,
        textFontSize: 16,
        color: '#5c5d58',
        backgroundColor: '#eee6dd'
      },
      readerModel: [
        {
          class: true,
          text: '默认',
          color: '#5c5d58',
          backgroundColor: '#eee6dd'
        },
        {
          class: false,
          text: '夜间',
          color: '#666',
          backgroundColor: '#0c0c0c'
        },
        {
          class: false,
          text: '护眼',
          color: 'rgba(12,46,16,.8)',
          backgroundColor: '#b8cd8d'
        }
      ]
    }
  },
  mounted() {
    this.$store.state.isTabber = false;
    window.addEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
    this.readerRecord.book_id = this.$route.query.book_id;
    this.readerRecord.index = this.$route.query.index;
    this.getBookcase();
  },
  beforeRouteEnter(to, from, next) {
    next(vm=>{
      if(from.name) vm.storageSourceIsBook = from.name;
      vm.getStorage();
    });
  },
  methods: {
    getBookcase: function () {
      // console.log('111', store.get("bookcase"));
      if(store.get("bookcase")) {
        var arr = store.get("bookcase");
        var obj = {};
        for(let i in arr) {
          if(arr[i].book_id === this.$route.query.book_id) {
            obj = arr[i];
            arr.splice(i, 1);
            this.isBookcase = true;
            break;
          }else {
            this.isBookcase = false;
          }
        }
        this.isBookcase ? arr.unshift(obj) : '';
        store.set("bookcase", arr);
        // console.log('222', store.get("bookcase"));
      }
    },
    // 本地储存
    getStorage: function () {
      var isStore = false;
      if(store.get('bookIdMessage')) {
        this.bookIdMessage = store.get('bookIdMessage');
        for(let i in this.bookIdMessage) {
          // 判断此书是否在本地缓存有阅读记录
          if(this.bookIdMessage[i].book_id === this.$route.query.book_id) {
            isStore = true;
            // 判断是否是从书籍详情页直接跳过来的（是否是点击‘开始阅读’按钮进入的）
            if(this.storageSourceIsBook === "book") {
              this.chapterLoading(this.bookIdMessage[i].index);
            }else{
              this.bookIdMessage[i].index = this.$route.query.index;
              store.set('bookIdMessage', this.bookIdMessage);
            }
          }else{
            isStore = false;
          }
        }
      }else{
        isStore = false;
      }
      if(!isStore) {
        this.bookIdMessage.push(this.readerRecord);
        store.set('bookIdMessage', this.bookIdMessage);
      }else{

      }
      if(store.get('bookMessage')) {
        this.bookMessage = store.get('bookMessage');
      }
      if(store.get("readerModel")) {
        this.readerModel = store.get("readerModel");
      }
      this.getBookInfo(this.$route.query.book_id);
    },
    // 获取书籍详情
    getBookInfo: function (book_id) {
      this.axios.get(API.book.bookInfo(book_id))
        .then((res) => {
          console.log('获取书籍详情-成功', res);
          this.imgUrl = API.STATIC_HOST + res.data.cover;
          this.bookTitle = res.data.title;
          this.getBookSources(book_id);
        })
        .catch((res) => {
          this.isOk = false;
          this.isLoading = true;
          return false;
          console.log('获取书籍详情-失败', res);
        })
    },
    // 获取书源
    getBookSources: function (book_id, isClickDirectory) {
      this.axios.get(API.book.bookSources(book_id))
        .then((res) => {
          // console.log('获取书源-成功', res);
          this.getBookChapters(res.data[1]._id, isClickDirectory);
        })
        .catch((res) => {
          this.isOk = false;
          this.isLoading = true;
          return false;
          console.log('获取书源-失败', res);
        })
    },
    // 获取书籍章节
    getBookChapters: function (book_id, isClickDirectory) {
      this.axios.get(API.book.bookChapters(book_id))
        .then((res) => {
          // console.log('获取书籍章节-成功', res);
          this.isOk = true;
          this.bookChapters = res.data.chapters;
          var bookIndex = res.data.chapters[this.$route.query.index - 1];
          this.textTitle = bookIndex.title;
          this.chapterContent(bookIndex.link, bookIndex.title, isClickDirectory);
        })
        .catch((res) => {
          this.isOk = false;
          this.isLoading = true;
          return false;
          console.log('获取书籍章节-失败', res);
        })
    },
    // 获取章节内容
    chapterContent: function (link, title, isClickDirectory) {
      this.axios.get(API.book.chapterContent(link))
        .then((res) => {
          // console.log('获取章节内容-成功', res);
          // 获取到的章节内容没有p标签，使其每段分割，组成数组
          let bodyArray = res.data.chapter.body.split(/\n/);
          // 给每段加上p标签
          for(let i in bodyArray) {
            bodyArray[i] = `<p>${bodyArray[i]}</p>`;
          };
          let bookContentArr = {};
          bodyArray = bodyArray.join('');
          bookContentArr.title = title;
          bookContentArr.content = bodyArray;
          isClickDirectory ? (this.textContent = []) : '';
          this.textContent.push(bookContentArr);
          this.isLoadingChapter = true;
          this.isLoading = true;
        })
        .catch((res) => {
          this.isOk = false;
          this.isLoading = true;
          return false;
          console.log('获取章节内容-失败', res);
        })
    },
    // 目录点击
    readerDirectory: function (index) {
      this.directoryShow = false;
      this.isLoading = false;
      this.chapterLoading(index);
      this.getBookSources(this.$route.query.book_id, true);
    },
    // 滚动到底部加载下一章
    handleScroll: function () {
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;  
      // 设备/屏幕高度
      let scrollObj = this.$refs.viewBox; // 滚动区域
      if(scrollObj) {
        let scrollTop = scrollObj.offsetParent.scrollTop; // div 到头部的距离
        let scrollHeight = scrollObj.scrollHeight; // 滚动条的总高度
        //滚动条到底部的条件
        if(scrollTop + clientHeight == scrollHeight){
          // div 到头部的距离 + 屏幕高度 = 可滚动的总高度
          if(this.isLoadingChapter) {
            this.isLoadingChapter = false;
            this.chapterLoading();
            this.getBookSources(this.$route.query.book_id);
            for (let i in this.bookIdMessage) {
              if(this.bookIdMessage[i].book_id === this.$route.query.book_id) {
                this.bookIdMessage[i].index = this.$route.query.index;
              }
            }
            store.set('bookIdMessage', this.bookIdMessage);
          }
        }
      }
    },
    // 修改URL的章节参数
    chapterLoading: function (index) {
      let query = this.$router.history.current.query;
      //对象的拷贝
      let newQuery = JSON.parse(JSON.stringify(query));
      newQuery.index = index ? index : (Number(newQuery.index) + 1);
      this.$router.replace({ query, query: newQuery });
    },
    panelClick: function () {
      const viewTop = this.$refs.panelTop;
      const viewBottom = this.$refs.panelBottom;
      if(!viewTop.contains(event.target) && !viewBottom.contains(event.target)) {
        this.isShow = false;
      }
    },
    // 界面风格选择
    isAcitve: function (index) {
      for(let i in this.readerModel) {
        this.readerModel[i].class = false;
        this.readerModel[index].class = true;
      }
      this.bookMessage.color = this.readerModel[index].color;
      this.bookMessage.backgroundColor = this.readerModel[index].backgroundColor;
      store.set("readerModel", this.readerModel);
      store.set("bookMessage", this.bookMessage);
    },
    // 字体减小
    fontSizeMinus: function () {
      this.bookMessage.lineWidth === 0 ? '' : (this.bookMessage.lineWidth -= 25, this.bookMessage.titleFontSize -= 2, this.bookMessage.textFontSize -= 2);
      store.set('bookMessage', this.bookMessage);
    },
    // 字体放大
    fontSizeAdd: function () {
      this.bookMessage.lineWidth === 100 ? '' : (this.bookMessage.lineWidth += 25, this.bookMessage.titleFontSize += 2, this.bookMessage.textFontSize += 2);
      store.set('bookMessage', this.bookMessage);
    },
    // 后退
    back: function () {
      if(window.history.length <= 1) {
        this.$router.push({path: '/'});
        return false;
      }else{
        this.$router.go(-1);
      }
    },
    // 加入/撤出 书架
    jionBookcase: function () {
      var arr = store.get("bookcase");
      var obj = {};
      obj.book_id = this.$route.query.book_id;
      obj.index = this.$route.query.index;
      obj.image = this.imgUrl;
      obj.title = this.bookTitle;
      if(!this.isBookcase) {
        // 是否存在书架缓存
        arr.unshift(obj);
        this.isBookcase = true;
      }else{
        for(var i = 0; i < arr.length; i ++) {
          if(arr[i].book_id === this.$route.query.book_id) {
            arr.splice(i, 1);
            break;
          }
        }
        this.isBookcase = false;
      }
      store.set("bookcase", arr);
    },
    directoryShowClick: function () {
      this.isShow = false;
      this.directoryShow = true;
    },
    directoryClick: function () {
      const directory = this.$refs.directory;
      if(!directory.contains(event.target)) {
        this.directoryShow = false;
      }
    }
  },
  // beforeRouteLeave (to, from, next) {
  //   console.log('to', to);
  //   console.log('from', from);
  //   console.log('next', next);
  // },
  destroyed: function () {
    window.removeEventListener('scroll', this.handleScroll);   //  离开页面清除（移除）滚轮滚动事件
  }
};
</script>
<style lang='scss'>
  .page-reader{
    height: auto;
    .reader-content-details{
      & > div{
        padding-top: 1.333rem;
      }
      h1{
        font-weight: 400;
        color: #333;
        padding: 0 1.067rem;
        line-height: 1.5;
      }
      .read-content{
        position: relative;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        .inner{
          font-size: 16px;
          line-height: 1.5;
          padding: 0.533rem 1.067rem 0;
          text-align: justify;
          p{
            font-size: inherit !important;
            line-height: 1.5;
            margin: 0.267rem 0;
            text-indent: 2em;
            text-align: justify;
          }
        }
      }
      .scroll-loading{
        width: 100%;
        height: 5.333rem;
        padding-top: 1.333rem;
        .loader{
          width: 100%;
          box-sizing: border-box;
          flex: 0 1 auto;
          flex-direction: column;
          flex-grow: 1;
          flex-shrink: 0;
          flex-basis: 25%;
          height: 1.173rem;
          align-items: center;
          justify-content: center;
          .loader-inner{
            width: 3.2rem;
            margin: 0 auto;
            div{
              background-color: red;
              width: 0.533rem;
              height: 0.533rem;
              border-radius: 50%;
              margin: 0.214rem;
              animation-fill-mode: both;
              display: inline-block;
              animation: ball-beat .7s 0s infinite linear;
            }
            div:nth-child(2n-1){
              animation-delay: .35s!important;
            }
          }
        }
      }
    }
    .page-read-option{
      visibility: hidden;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999;
      .top-controll-bar{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 20;
        width: 100%;
        height: 2.347rem;
        color: #fff;
        background-color: rgba(50,51,52,.9);
        transform: translateY(-100%);
        transition: all .2s ease;
        opacity: 0;
        .back{
          position: absolute;
          width: 3.2rem;
          text-align: center;
          color: #fff;
          font-size: 12px;
          .icon{
            width: .8rem;
            height: 2.347rem;
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAD7ElEQVR4Xu3d63XbMAxAYXKyppukmySTtN2o3aQbuMeJfeI4lgiSEAkCN39DypLuZ8mm88iJryFn4HQ6PaeUvuWcfwx5QOGDZOE4hnWcgUv8n5dN/LKEAAAdYSVT7+Jfp5hBAABJxcYxG/FNIQBAY9zStEJ8MwgAUCrZ8H1hfBMIANAQeG9KZfzpCACgCKAx/lQEAFAC0Bl/GgIAKABQin/dk9ec84vCbok2AQDRadoepBz/b0rpKef8r3O3xNMBID5VXweuHv98RABoBOAhPgCCxwdAAwAvz/zroXMLqEDgLT5XgODxASAE4PGZzy2A+G9ngNcAOxA8P/O5AhSuABHicwXYQBAlPgAeAIgUHwB3AKLFB8ANgIjxAXABEDU+AFJKkeOHBxA9fmgAxH+//4VcCST+x6vfcACI//m9bygAxP+68hUGAPEfr3uHAED87U++3AMg/v7Hnq4BEL/8Uy9uARC/HN/tOgDxZfFdAiC+PL47AMSvi+8KAPHr47sBQPy2+C4AEL89/vIAiN8Xf2kAxO+PvywA4uvEXxIA8fXiLweA+LrxlwJAfP34ywAg/jHxlwBA/OPimwdA/GPjmwZA/OPjmwVA/DHxTQIg/rj45gAQf2x8UwCIPz6+GQDEnxPfBADiz4s/HQDx58afCoD48+NPA0B8G/GnACC+nfjDARDfVvzVAfxJKX0f+R+27OXr36PhvxyqfBUAQaeB4QDO+wuCzmqK06cAAIFiwc5NTQMAgs5yStOnAgCBUsWOzUwHAIKOegpTTQAAgULJxk2YAQCCxoKd00wBAEFnzYbp5gCAoKFixxSTAEDQUbRyqlkAIKgs2TjcNAAQNFatmGYeAAgqajYMXQIACBrKCqcsAwAEwqKVw5YCAILKuoLhywEAgaBqxZAlAYCgonBh6LIAQKCDYGkAIOhHsDwAEPQhcAEABO0I3AAAQRsCVwBAUI/AHQAQ1CFwCQAEcgRuAYBAhsA1ABCUEbgHAIJ9BCEAgGAbQRgAIHiMIBQAEHxFEA4ACD4jCAkABB8IwgIAwTuC0ABAAIC3Z0Hkv1kU/gpwvRtGRQCAmxfFEREA4O6tcTQEAHiwQBYJAQA2lsmjIADAzodlERAAoPCRuXcEACj/zITrdQIACAB4XiwCgBCAVwQAqADgEQEAKgF4QwCABgCeEACgEYAXBADoAOABAQA6ARyA4DXn/KKwW6JNAEB0msqDlFYMf+ecn8uPpjcCAHrnsnfFcHj886EDQBFAx+1gSnwAKMe/bq7ydjAtPgAOAlBxJZgaHwAHAhAgmB4fAAcD2EFgIj4ABgB4gMBMfAAMAnCD4Gn0+/zSIf4HnJnqn1/5JcgAAAAASUVORK5CYII=) no-repeat;
            background-size: 125%;
            background-position: 50%;
          }
          i{
            display: inline-block;
            vertical-align: middle;
            font-style: normal;
          }
        }
        h2{
          width: 70%;
          height: 100%;
          margin: 0 auto;
          line-height: 2.347rem;
          text-align: center;
          white-space: normal;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .menu{
          position: absolute;
          width: 3.2rem;
          right: 0;
          top: 0;
          text-align: center;
          font-size: 12px;
          .icon{
            width: .8rem;
            height: 2.347rem;
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAaCAYAAABPY4eKAAAAcElEQVRIS+3UwQ2AMAxDUZspmArGgJFgQiqVA2SABiEkTpydA+kCVl+rz2o2oPlKoIfoOFDQcWI9zk05/N6PLLHju9mI5guE7HjYZ4qe+XMmx0P0kz2GPfMqd7/bnnmVswPIyESo/5k98yr/cdF5vQD65koTkcw9oAAAAABJRU5ErkJggg==) no-repeat;
            background-size: 100%;
            background-position: 50%;
            display: inline-block;
            vertical-align: middle;
            font-style: normal;
          }
          .drop-down{
            position: absolute;
            width: 4.8rem;
            background: #323334;
            right: .8rem;
            top: 2.827rem;
            border-radius: .16rem;
            li{
              border-bottom: 1px solid #222;
              height: 1.6rem;
              border-radius: .16rem;
              a{
                display: block;
                width: 100%;
                height: 100%;
                padding: .4rem 0.533rem;
                .menu-icon{
                  width: .64rem;
                  height: .64rem;
                  display: inline-block;
                  vertical-align: middle;
                  font-style: normal;
                }
                span{
                  display: inline-block;
                  vertical-align: middle;
                  line-height: 0.853rem;
                  height: .8rem;
                  margin-left: 0.533rem;
                  font-size: .64rem;
                  color: #fff;
                  font-style: normal;
                }
              }
            }
            li:nth-child(1) {
              a{
                .menu-icon {
                  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAVCAYAAACt4nWrAAABc0lEQVRIS+3UQStEURQH8P/JyIIyvXwEC1vFSlYsJaN77gJZychaKdlZsLCWkZUaNffeDFlbyYqypXwEvSgWMjl66k68eWbejLHi7e7pnN/tnnN6hJSfc25QRHaJaEkpdZ2mjNIkGWMmiagIoAfAE4A5Zj5pVNsQt9auANgC0OExEXkjolVm3q53wbd4oVDoDIJgB8BCHWA/DMPlfD7/mpSTiJfL5WylUnEAxho9HcBZJpNRuVzuIZ5bgxtj+onoFMBACtin3IrIhNb67nPNF9xaOwrgCEBfE7BPvQcwzcznPlDFrbXzAPYAdLUA+5IXAIvMfBAFSETIWrtBRGvR+QdwdZkAbCql1iPYAOA2oHHCRrj8AvxBUqlUGq8OgOiYiLpbvUxEnkVkqmagUcBaG+1qb6s4gEdmzv4RnIiGlVJX/rnOuSERuUxoX/Nt+ccTV7EtbXHOFUVkJjaoGxEZ0VqHPm6MCYjoIv5bFpFDrfWsz3sHIDy7/nCVYlkAAAAASUVORK5CYII=) no-repeat;
                  background-size: 100%;
                  background-position: 50%;
                }
              }
            }

            li:nth-child(2) {
              a{
                .menu-icon {
                  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAASCAYAAABb0P4QAAABPElEQVQ4T63UMUsDMRQH8P+7KLe7HXRwUFxFJ1cr4hdo7hC53e/QTfQD3OQoHFK8pJtLcXATl1LngjgonKOLHFSSJznaUhwT35Ah8H55vCSPAEAp1WXmKyLaA7Dm9jziyxjTpaqqDoloFAC1Z1trz9M0vSal1BOAA4+KVlNmTdNs5Hn+7cAZgPUQkJlfpZRbznDgO4BOCAjgs9frJQvwAkA/EIQxZifLsikVRREnSXIDIAtBmflOSpnRAqmqahfAPgDhC0dR9LgEfZG/ef8PDgaDTSHEsW+FQghjjHmRUo7bW3aL1vqWmU990Xmeruv6rAWHw2HHWvsW+v2Y+XLZQ631mJndcAiJj1XwgZmPQjRm/lmCSqkpgO1A8LkF3aMmokkIBsBEUXRCZVkmcRzfz4erj2kATKy1/TRNR7/K4n2RwkIP6QAAAABJRU5ErkJggg==) no-repeat;
                  background-size: 100%;
                  background-position: 50%;
                }
              }
            }
            li:nth-child(3) {
              a{
                .menu-icon {
                  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+nhxg7wAAAL5JREFUOI3t1TEKwjAYhuHH4CjiJcQrdHER8QCeRnAX71LwAOLm4hEELyHqrkMVBNta24AIvpAlIW/+Px8hrTRNoY8lxuj6nBM2mOHQxgA79GrIHnQxxQhJwKKh8JkeFkHWckwmQb07LKMTIgtBnnSIVoUx/ERalWvRQjtnbtvgIDSr9PvSsqAKw3knLaMwnGf+Qb1Q9UUVBte00tzgfiuoU2TnJcg+rJisA+Y4RhIeMQ/YI8EK55qy831/gv0NuwMcQx3mmj0AAAAASUVORK5CYII=) no-repeat;
                  background-size: 100%;
                  background-position: 50%;
                }
              }
            }
          }
          .drop-down:before {
            border-style: solid;
            border-color: transparent transparent #323334;
            border-width: 0 0.213rem .32rem;
            content: " ";
            width: 0;
            height: 0;
            top: -0.267rem;
            right: .64rem;
            position: absolute;
          }
        }
      }
      .bottom-controll-panel{
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 20;
        width: 100%;
        height: 9.067rem;
        padding: 1.067rem;
        background-color: rgba(50,51,52,.9);
        transform: translateY(100%);
        transition: all .2s ease;
        opacity: 0;
        .toBookShelf{
          position: absolute;
          width: 4.267rem;
          height: 1.6rem;
          background-color: rgba(50,51,52,.9);
          border-radius: 1.6rem 0 0 1.6rem;
          color: #fff;
          font-size: 0.693rem;
          line-height: 1.6rem;
          padding-left: .8rem;
          top: -2.827rem;
          right: 0;
        }
        & > div{
          position: relative;
          height: 1.6rem;
          margin-bottom: 1.067rem;
          font-size: 0;
          .btn{
            display: inline-block;
            vertical-align: middle;
            height: 1.6rem;
            line-height: 1.6rem;
            text-align: center;
            border-radius: 2px;
            color: #fff;
            font-size: 14px;
          }
          .font-size-change{
            width: 1.707rem;
            font-size: 1.013rem;
          }
          .disable{
            background-color: transparent;
            color: #888;
          }
          .font-size-line{
            width: 12.8rem;
            height: 0.107rem;
            background-color: #b2b2b2;
            border-radius: 0.053rem;
            margin: 0 .8rem;
            .content{
              width: 0;
              height: 0.107rem;
              display: block;
              background-color: #b93221;
              border-radius: 0.053rem;
            }
          }
          .square{
            width: 5.333rem;
            color: #fff;
            border: 1px solid #535353;
            border-radius: 0.213rem;
          }
          .square:nth-of-type(2){
            margin: 0 0.907rem;
          }
          .active{
            color: #b93221;
            border: 1px solid #b93221;
          }
          .chapter-btn-w{
            width: 2.667rem;
            font-size: .8rem;
          }
          .directory{
            width: 5.333rem;
            color: #a8a8a8;
            text-align: center;
            font-size: .8rem;
            position: absolute;
            left: 50%;
            margin-left: -2.667rem;
          }
          .f-r{
            float: right;
          }
        }
        & > div:last-child{
          margin-bottom: 0;
        }
      }
    }
    .showPanel{
      visibility: visible;
      .top-controll-bar{
        opacity: 1;
        transform: translateY(0);
      }
      .bottom-controll-panel{
        opacity: 1;
        transform: translateY(0);
      }
    }
    .page-read-chapter-list{
      position: fixed;
      top: 0;
      left: 0;
      opacity: 0;
      visibility: hidden;
      width: 100%;
      height: 100%;
      z-index: 100;
      overflow: hidden;
      transition: all .2s ease;
      transform: translateX(-100%);
      .content{
        width: 15.733rem;
        height: 100%;
        background-color: #fff;
        position: absolute;
        .top-bar{
          width: 15.733rem;
          height: 4.267rem;
          position: absolute;
          top: 0;
          border-bottom: 1px solid #f2f2f2;
          padding-left: 1.067rem;
          z-index: 99;
          background-color: #fff;
          span{
            display: inline-block;
            width: 100%;
          }
          span:first-child{
            font-size: .96rem;
            line-height: .96rem;
            padding: .8rem 0 1.067rem;
            color: #333;
          }
          span:last-child{
            font-size: 0.907rem;
            height: 0.907rem;
            line-height: 0.907rem;
            color: #999;
          }
        }
        .directory-list{
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding-top: 4.267rem;
          overflow-y: auto;
          li{
            position: relative;
            height: 2.667rem;
            .title{
              display: block;
              height: 100%;
              line-height: 2.667rem;
              margin-left: 1.067rem;
              padding-right: 1.867rem;
              border-bottom: 1px solid #f2f2f2;
              color: #999;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            .active{
              color: #b93321;
            }
          }
        }
      }
    }
    .page-read-chapter-list.show-panel{
      transform: translateX(0)!important;
      visibility: visible;
      opacity: 1;
    }
  }
  @keyframes ball-beat{
    50%{
      opacity: .2;
      transform: scale(.75);
    }
    100%{
      opacity: 1;
      transform: scale(1);
    }
  }
  .no-book{
    width: 100%;
    > span{
      width: 100%;
      font-size: 20px;
      display: inline-block;
      text-align: center;
      margin-top: 50%;
    }
    .back{
      font-size: 20px;
      color: #b93321;
      text-decoration: underline;
    }
  }
  // .inner >>> p{
  //   font-size: inherit !important;
  //   line-height: 1.5;
  //   margin: 0.267rem 0;
  //   text-indent: 2em;
  //   text-align: justify;
  // }
</style>