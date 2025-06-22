import { defineStore } from "pinia";

const useArticleDetail = defineStore("articleDetail", {
  state: () => ({
    articleDetail: {}, // Default state
  }),
  actions: {
    setArticleDetail(article) {
      this.articleDetail = article;
    },
  },
  getters: {},
  persist: {
    storage: sessionStorage,
    pick: ["articleDetail"], // Ensure only `personList` is persisted
  },
});

export default useArticleDetail;
