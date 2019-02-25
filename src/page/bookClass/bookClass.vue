<template>
  <Loading v-if='!loading'></Loading>
  <div class="bookLists" v-else>
    <div class="category-section" v-for='(item, index) in cats' :key='index'>
      <h1>{{ item.name }}</h1>
      <div class="category-list">
        <router-link
          :to="{path: '/bookList', query: {gender: item.minor,major: cat.name}}"
          v-for='(cat, index) in item.data'
          :key='index'
        >
          <span class="name">{{ cat.name }}</span>
          <span class="count">{{ cat.bookCount }}</span>
        </router-link>
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
  data(){
    return {
      loading: false,
      cats: [
        {
          minor: 'male',
          name: '男生',
          data: []
        },
        {
          minor: 'female',
          name: '女生',
          data: []
        },
        {
          minor: 'press',
          name: '出版',
          data: []
        },
      ]
    }
  },
  mounted() {
    console.log('API', API);
    this.$store.state.isTabber = true;
    this.getCats();
  },
  methods: {
    //获取一级分类及数目 
    getCats: function() {
      this.axios.get(API.classification.getCats)
        .then((res) => {
          // console.log('一级分类及数目', res);
          for(let i in this.cats) {
            let catsMinor = this.cats[i].minor;
            this.cats[i].data = res.data[catsMinor];
          }
          this.loading = true;
        })
        .catch((res) => {
          // console.log('一级分类及数目error', res);
        });
    }
  }
};

</script>
<style lang="scss" scoped>
  .bookLists{
    margin-bottom: 4rem;
  }
  .category-section{
    h1{
      color: #999;
      padding: 0 .8rem;
      height: 3.2rem;
      line-height: 3.2rem;
      font-weight: 400;
    }
    a{
      display: inline-block;
      vertical-align: middle;
      width: 33.33%;
      height: 3.2rem;
      padding: 0.533rem;
      text-align: center;
      border-top: 1px solid #f8f8f8;
      border-right: 1px solid #f8f8f8;
      border-bottom: 1px solid #f8f8f8;
      box-sizing: border-box;
      span{
        display: block;
        line-height: 1.067rem;
      }
      .name{
        font-size: 15px;
        font-weight: 700;
        color: #333;
      }
      .count{
        font-size: 12px;
        color: #ccc;
      }
    }
    a:nth-child(n+4){
      margin-top: -1px;
    }
  }
</style>