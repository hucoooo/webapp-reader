import Vue from "vue";
import Router from "vue-router";
import Rank from "./page/rank/rank.vue";
import Bookcase from "./page/bookcase/bookcase.vue";
import BookClass from "./page/bookClass/bookClass.vue";
import BookSearch from "./page/bookSearch/bookSearch.vue";
import BookList from "./page/bookList/bookList.vue";
import Ranking from "./page/ranking/ranking.vue";
import Book from "./page/book/book.vue";
import Comment from "./page/comment/comment.vue";
import CommentDetail from "./page/commentDetail/commentDetail.vue";
import BookRelated from "./page/bookRelated/bookRelated.vue";
import Search from "./page/search/search.vue";
import BookDirectory from "./page/bookDirectory/bookDirectory.vue";
import Reader from "./page/reader/reader.vue";

Vue.use(Router);

export default new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "bookcase",
      component: Bookcase
    },
    {
      path: "/bookClass",
      name: "bookClass",
      component: BookClass
    },
    {
      path: "/rank",
      name: "rank",
      component: Rank
    },
    {
      path: "/bookSearch",
      name: "bookSearch",
      component: BookSearch
    },
    {
      path: "/bookList",
      name: "bookList",
      component: BookList
    },
    {
      path: "/ranking",
      name: "ranking",
      component: Ranking
    },
    {
      path: "/book",
      name: "book",
      component: Book
    },
    {
      path: "/comment",
      name: "comment",
      component: Comment
    },
    {
      path: "/commentDetail",
      name: "commentDetail",
      component: CommentDetail
    },
    {
      path: "/bookRelated",
      name: "bookRelated",
      component: BookRelated
    },
    {
      path: "/search",
      name: "search",
      component: Search
    },
    {
      path: "/bookDirectory",
      name: "bookDirectory",
      component: BookDirectory
    },
    {
      path: "/reader",
      name: "reader",
      component: Reader
    }
  ]
});
