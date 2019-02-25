<template>
  <Loading v-if='!loading'></Loading>
  <div v-else>
    <div class="book-searching">
      <div class="searching-wrapper">
        <div>
          <input type="text" placeholder="请输入搜索内容" v-on:input='inputFun()' v-model="val">
          <div class="del" v-show='searching' @click='inputDel'></div>
        </div>
        <span @click="searching ? $router.push({path: '/search', query: {val: val}}) : ''">确定</span>
      </div>
      <div class="searching-body" v-show='!searching'>
        <div class="searching-section">
          <div class="searching-view">
            <div class="searching-title">
              <div class="searching-title-left">搜索热词</div>
              <div class="searching-title-right" @click="randomSearchHotWord()">换一批</div>
            </div>
            <router-link
              v-for="(item, index) in showSearchHotWords"
              :key='index'
              :to="{path: '/search', query:{val: item.word}}"
              class="searching-content"
              :style="{backgroundColor: searchHotWordBackgoundColor[index]}"
            >
              {{ item.word }}
            </router-link>
          </div>
        </div>

        <div class="searching-section">
          <div class="searching-view">
            <div class="searching-title">
              <div class="searching-title-left">热门推荐</div>
              <div class="searching-title-right" @click="randomHotWord()">换一批</div>
            </div>
            <router-link
              v-for="(item, index) in showHotWords"
              :key='index'
              :to="{path: '/search', query:{val: item}}"
              class="searching-content"
              :style="{backgroundColor: hotWordBackgoundColor[index]}"
            >
              {{ item }}
            </router-link>
          </div>
        </div>

        <div class="searching-record">
          <div class="searching-title">
            <div class="title">搜索历史</div>
            <div class="right">删除历史</div>
          </div>
          <router-link
            class="list"
            v-for="(item, index) in searchRecord"
            :to="{path: '/search', query:{val: item}}"
            :key="index"
          >
            {{ item }}
          </router-link>
        </div>
      </div>
      <div class="searching-results-view" v-show='searching'>
        <ul>
          <li class="li" v-for='(item, index) in keywords' :key='index'>
            <router-link :to="{path: '/search', query:{val: item}}">{{ item }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from '@/components/loading/loading.vue';
import API from '../../api/api.js';
import store from 'storejs';
export default {
  components: {
    Loading
  },
  data() {
    return {
      // 随机显示搜索热词背景色
      searchHotWordBackgoundColor: ['#FFC0CB', '#7B68EE', '#FF69B4', '#66CDAA', '#FA8072', '#228B22', '#90c5f0', '#f6bc7e', '#67ccb7', '#e78f8f', '#FA8072', '#228B22', '#FFC0CB', '#7B68EE', '#FF69B4'],
      hotWordBackgoundColor: ['#FA8072', '#7B68EE', '#e78f8f','#FFC0CB', '#FF69B4', '#66CDAA'],
      searchHotWords: [],   // 搜索热词
      showSearchHotWords: [], // 处理后的随机搜索热词
      hotWords: [],      // 热门推荐
      showHotWords: [],  // 随机显示热词
      loading: false,
      searching: false,
      searchRecord: [],
      val: '',
      keywords: []
    }
  },
  mounted() {
    this.$store.state.isTabber = true;
    this.getSearchHotWord();
    this.getHotWord();
    this.getsearchRecord();
  },
  methods: {
    // 获取搜索历史（本地缓存）
    getsearchRecord: function () {
      if(store.get("searchRecord")) {
        this.searchRecord = store.get("searchRecord");
      }
    },
    // 获取搜索热词
    getSearchHotWord: function() {
      this.axios.get(API.book.searchHotWord)
        .then((res) => {
          // console.log('搜索热词', res);
          this.searchHotWords = res.data.searchHotWords;
          this.randomSearchHotWord();
        })
        .catch((res) => {
          console.log('搜索热词error', res);
        });
    },

    // 获取热门推荐
    getHotWord: function() {
      this.axios.get(API.book.hotWord)
        .then((res) => {
          // console.log('热门推荐', res);
          this.hotWords = res.data.hotWords;
          this.randomHotWord();
          this.loading = true;
        })
        .catch((res) => {
          console.log('热门推荐error', res);
        });
    },
    // 搜索
    inputFun: function() {
      console.log(this.val);
      this.searching = true;
      this.axios.get(API.book.bookSearchRealTime(this.val))
        .then((res) => {
          // console.log('搜索结果-成功', res);
          this.keywords = res.data.keywords;
          console.log('this.keywords', this.keywords);
        })
        .catch((res) => {
          console.log('搜索结果-失败', res);
        });
    },
    inputDel: function() {
      this.searching = false;
    },
    // 随机热门推荐
    randomHotWord: function() {
      let temHotWord = Array();
      let temShowHotWord = Array();

      // 随机打乱热门推荐词数组
      temHotWord = this.shuffle(this.hotWords);
      // 取随机打乱热词数组的前6个并追加至显示热词
      for (let i = 0; i < 6; i++) {
        temShowHotWord.push(temHotWord[i]);
      }
      this.showHotWords = temShowHotWord;
    },

    //随机搜索热词
    randomSearchHotWord: function() {
      let temSearchHotWord = Array();
      let temShowSearchHotWord = Array();

      // 随机打乱热词数组
      temSearchHotWord = this.shuffle(this.searchHotWords);
      // 取随机打乱热词数组的前15个并追加至显示热词
      for (let i = 0; i < 15; i++) {
        temShowSearchHotWord.push(temSearchHotWord[i]);
      }
      this.showSearchHotWords = temShowSearchHotWord;
    },

    // 随机打乱数组
    shuffle: function(arr) {
      let i = arr.length;
      while (i) {
        let j = Math.floor(Math.random() * i--);
        [arr[j], arr[i]] = [arr[i], arr[j]];
      }
      return arr;
    }
  }
};
</script>
<style lang='scss' scoped>
  .book-searching{
    width: 100%;
    height: 100%;
    padding: .8rem .8rem 4rem;
    .searching-wrapper{
      width: 100%;
      & > div {
        position: relative;
        width: 16rem;
        height: 1.867rem;
        background-color: #ebebf0;
        border-radius: 0.933rem;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAvCAMAAACWqWnGAAAAZlBMVEXs6/GJiI7o5+3i4eeMi5Hq6e/W1dve3eOSkZeQj5WenaOamZ/OzdO9vMK2tbutrLKWlZvGxcvCwce/vsS4t72zsridnKKOjZPk4+nR0NbIx83b2uDLytC7usCysbeqqa+ko6mhoKaCxcZ5AAABR0lEQVRIx+2U3XqDIAyGCaBoUay/1daqvf+b3IJ77DoTNnfc75D4EvLzKd76Lpm1XQpwsUXZ/wnomxQ26cL8TpQr8ISaKAxEBex0UkFiAVTiBiOlGVwCqHOImfGLtJZbI2r/TCtZotq/Q53wrOAIpZH4caP0zMAgLZahdhdhQR0zQUxS7s9HTBOTyBULpYZgPwMTieBIciqQY6NJxHL5Y3wZ2WcsRZGdRORGRdi7IrZ+YLOwSBKshTTBI9QxTVqgwV5yc1kEm7+kRwyVIGX5HdNKMBvDbvLEedJHu1e/dN517J/GXHy8erqySgFVC1aZXr3fZuj9rE1g1SUOMoTCTHzefe1P9MAz0r0mmo2ynskEL3XfMqUT7nzfeWYUIZkxd66+3qKvzA9gNoOXXDxTHWGiOTCf8P/9Lo6oPY6gnxpxULkTb/1XH5t/C5iviG3nAAAAAElFTkSuQmCC);
        background-repeat: no-repeat;
        background-size: .96rem .96rem;
        background-position: 0.533rem;
        padding: 0 1.6rem;
        margin-bottom: 1.067rem;
        display: inline-block;
        & > input{
          width: 100%;
          height: 1.867rem;
          background-color: #ebebf0;
          border-style: none;
          padding: 0.613rem;
          font-size: 0.64rem;
        }
      }
      & > span{
        color: #748389;
        font-size: .8rem;
        display: inline-block;
        line-height: 1.867rem;
        margin-left: 0.533rem;
      }
      .del{
        display: inline-block;
        width: .8rem;
        height: .8rem;
        position: absolute;
        top: 0.533rem;
        right: 0.533rem;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAAb1BMVEUAAACEg4mAgIuEg4mEg4mGhoaEg4mDgoqFhYuFg4mDg4mEg4mEg4mEg4mEg4mFg4mEgoqEg4mEhImEg4mEg4mEg4mEhImFgYmCgoyEg4mEg4mEg4mFg4iFg4mEhImEhIqEhIiEg4qDg4iGhoaEg4m0/nsGAAAAJHRSTlMA6xX50gexHC3kifLn4c5eRPXbyKqBOCQM1KCYkXhyUDxsZyjKUJg7AAAA+klEQVQoz32SW7KCMAxAQ3kXKG8REVFv9r/Gq6SThgE8X52eJmmagqPqO5NlY6QX2PMIkGn661ZWDW7wSml73DE5e8cDouNY5kb2iSdQ/RzP+N7/bZvRBVp83dLi/tF2dwaVWptAhUTIlZsYVGFt2HJ1zS8Rr/H+BcLANdeh9D4mwmIABqVPntKiJ9paE8NQoKMGDwUVwF+90Wsq7kgNoHKZPJKpw9SPIU55awTNlu7sfeLZR/xAOVnqb0TizROZyZK/uJnMtDIvwxd6RWLiGZ6hvno5sw/+aj8/W3dkW2Cm41im9PZ1JUqLA/U0gIW5Lre2yLLUdKXizX8DsVTrf3yRBwAAAABJRU5ErkJggg==);
        background-size: 100% 100%;
        z-index: 999;
      }
    }
  }
  .searching-view, .searching-record{
    width: 100%;
    overflow: hidden;
    margin-bottom: 1.6rem;
    .searching-title{
      position: relative;
      width: 100%;
      height: 1.6rem;
      margin-bottom: 0.747rem;
      .searching-title-left, .title{
        position: absolute;
        top: 0;
        left: 0;
        height: 1.6rem;
        line-height: 1.6rem;
        font-size: 1.173rem;
        color: #6b6b6b;
      }
      .searching-title-right, .right{background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFVklEQVR4Xu1aTXraSBB9JWYmyzgniHOC2CcwLAzZxT5BMMw+9glCThB7PwJ8guBdwIuQEwxzgtgnGNgNjKXK192S3EII1PoB/6Dv8wKrVd3v9euqruomPPOHnjl+bAnYKuCZM7BdAs9cAFsnuF0C2yWwRga4frgHsl6DeE92S9gDaAfMQ/mbaQR2b6l7PVrXsApfAnxSew/CEYAyCLuJgDGPAerBokv665sip6CnMAK4Wf0AplY8aJ6AoWaa6CAWH+MGxC2yB5dFcJA7AdysHoHpSxg4TwD0pNTd/3vUHY4XgeH6u11YThlkCcW8D7fhEcg6y1sRuRLAjVoHhLo28Fuw26L2ddd09rhe3oH1+xHIagF4HXzP3KL24LOpvbj2uRAgZ67kfgVIOTcgNfD5gSoi/jgF4RSgl977IZzpcZySTMjJh4Bm7RzAR6/jKzjTeh6D04F4RAxB9Fb9n0dwZpWs/eRCgBxOs9oF44baAyHZQh5JQumFWE6ef+AR2YP9LJ3lRkCWQZh+K8kGfVBCQJfa/RNTG377R0mAUlytFyiBcUbtvliGxs/jJUA5R+UTxMbJnb1J4w8eLQFSBX++K4P5u+cUL8ke6CE4kRoeNQGB8/X9gUNvqPvtJhFyr5ERAR7jb8nuX5h0UmRbtQfhn2lVkJiAkNwyet68CQmiAvOY2oNXJvYTESDTWIu+g2hHM35Bdv/UpLOi2sr8A/TVU8Ex2QMRIRI9KwmIAe/15Z6k2ecnGplhI25WRQottspGE7OUgDB4kdEFe/H74fHDIIEbVRESD8D8g9qDclL+YgmIgHe4jJL1tzTMLLKxo/sYzJV1VnEWgeNGtQWiT+Id2f2VyvZtLGy4EPxvJVG6UjGXqII7Z4wSDaUq5EZksyRwoyYyxi+ZCVgEXsxuKAp48Va29VWRU3a2SrrcrMmscz4ULxqfbotPDg+oc/1j3n5EAdyo/byv5nDgUfUOdIlx47AOsjqe4SHZ/coqEGnfhwhn/qxnniECiCp65Ugr1EQcZJQAmdtzHcynuodfJjEO6gE8IXugh8q0WGO/40Z1FNQENAccp4BQlWqONKmkpCMMdzB9NZ94yPd3uDHdiibt328XKYw47r5cotpewFdouETHC3OFdATMScwURNb2ainoDtjah+XW9SiQBLyZAvQ99wOI/SEShANmTPx9AEDCj/mZ4RXZfVFlXvgkVoAM/yl3W1lnPO77OQccbcb8D9xZeVmdwJAAvwqTvRaXFymxJCQAb7QEpAL0kJci984L9LydUI1QDnT1zPs2zBSgqrL/yo8XhJSiACaxq6XEK2Wv2zMiQPkBbxlkqMMlAZSmjQjFpkdn5gTodbgHpoI0pBkToHyBl3qKH95GJE3nD+GbdASos8CRqg/kc0S1KTJSEeCpIMi/s57ObAq8cRhcGn7WVCgVuUCaA5A4klMrQKpAP51RPeR2bL1owN72tyPuEmU5D8wUBiMqiJAgfIJ1nHdWqG6eoBNUpnPKRzIpwCcjemytTm3hTs+yylVdm+FPoZsnGQ5D5ycwFwICIrS6nLdbFHeBzuHylWnRVJXmrI/hKzc8gcNlU1vLnGyuBCi/IGbM7UZufonbXuAeWOTx7hhcuvWXibo/iJewaBdMZYBFxVmrLMkbZedwZ+dZFVWoAnTjXgVJnBzN3fYyDnoXcKatvIH7o8hdAVEnKdfwkTer8fcB7z+8BeTN0R6c2bAo4GsjIErI4R7EGYPr7AIk/sawSF2YvPtvVDTgtS0BY6Fv6IPCl8CGcCXudktAYqqeaMOtAp7oxCaGtVVAYqqeaMOtAp7oxCaG9QvrvMZfXd+MCQAAAABJRU5ErkJggg==);
        background-size: 0.853rem 0.853rem;
        background-position: 100%;
        background-repeat: no-repeat;
        position: absolute;
        bottom: 0;
        right: 0;
        padding-right: 1.067rem;
        line-height: 1.6rem;
        font-size: .64rem;
        color: #FFC0CB;
      }
    }
  }
  .searching-content{
    float: left;
    padding: 0 0.533rem;
    margin: 0 0.533rem 0.533rem 0;
    height: 1.6rem;
    line-height: 1.6rem;
    font-size: .64rem;
    color: #fff;
    border-radius: .8rem;
  }
  .searching-results-view{
    width: 100%;
    .li{
      max-width: 90%;
      height: 2.773rem;
      padding-left: 1.28rem;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAWBAMAAADdrcoLAAAAJFBMVEX///++vr7y8vLu7u7Dw8Pk5OTe3t719fXa2trs7OzPz8/Hx8dTXNRiAAAAP0lEQVQY02MgHXAIAoEYhM0YACRWQNmCIOAAYQcbGxubCkDYCkCCCcpWd3HxZsIq7smAJE42OxlhLxvCPYQBAECeCDq7BiEBAAAAAElFTkSuQmCC);
      background-repeat: no-repeat;
      background-size: 0.853rem 0.853rem;
      background-position: 0;
      font-size: 0.907rem;
      line-height: 2.773rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      a{
        display: inline-block;
        width: 100%;
        color: #222;
      }
    }
  }
  .searching-record{
    .searching-title{
      .right{
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAoCAMAAABU4iNhAAAArlBMVEX////9/P+Qj5T5+fz7+v/4+Pv7+/2NjJH08/eTkpbe3uDKys2Lio6MjI/n5uv39/nT0tfHxsubm52WlZq6ub6Ghonu7vGTk5b29frz8vXw7/Ph4ePW1tnMy8+pqauJiI2ysbWlpamYmJuPj5LZ2dvT09XQ0NLOztDExMe/v8KhoKOIiIrb2929vMCurbKrqq+Wlpjq6uyjoqWdnKCEhIbl5eeXl5m2triAf4R+fYIt4g+bAAABxUlEQVQ4y+2TaW/bMAyGX1qWfCpunPqKj8TOfZ/ttv//x0ZnG7CtQj8U6LdS4AtJfChSEITPNAklSboQ9FgSXEk8FyaW6KFScly8c6ZiBIzQnxoMc5Iywj2lGHfdXynEbrAHxUKqDz9cChYjSRyJgm2y2yXXWnImjCQUKUHjRXZPui5JzlXBxY3gwN/v5/PDzInbpmlus2yz932/vPxTlUXIRofOTuv7tuz35q+evp+TcNe+IUVzzl7P3bapJISkYnWNdZzF8fT/6ygxr+rVMliWAkSkEM0X62WwqHy8QYGi4NP+LkRj1/SSKgpWzKlL2qel6Ri4rJamu0dlHFeR8KcHTooOz3slh/E2NaEvll4ptdaZgCgsb0G00V4Bg5XebAF8y0KCcnddQFjPsshE+s7oycazZdmEgeUFoKFluV/kB0l6GXlM1lmbg9I2rnLadJOxgRSl5z1JDIY1wc7rOgU2nWMiyddOJUF5znPk3AK/ppFEaU2Wrm3bILIFQcr8kMxSE5m2P+Lj8XSaHqdTllPbeN+vhQF03WA0mYTORIdas1hJEt5q2/jfB5ubwyiP37JdG9tEROj7owhkQ7LbkleELwN+AmK6JDKO8B81AAAAAElFTkSuQmCC);
        background-size: 0.853rem 0.853rem;
        background-position: 100%;
        background-repeat: no-repeat;
        color: #8a8a8f;
      }
    }
    .list{
      display: block;
      height: 2.773rem;
      font-size: 0.907rem;
      color: #9b9ba3;
      line-height: 2.773rem;
      border-bottom: 0.027rem solid #ebebf0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
</style>