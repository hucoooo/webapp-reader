import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  	isTabber: true,
  	bookListViewH: 0,
  	headerData: {
		major: {
		  id: 'hot',
		  type: '热门'
		},
		minor: {
		  id: '全部',
		  type: '全部'
		}
	},
	storage: {}
  },
  mutations: {},
  actions: {}
});
