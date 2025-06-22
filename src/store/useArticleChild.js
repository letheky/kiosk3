import {
  defineStore
} from "pinia";

const useArticleChild = defineStore("articleChild", {
  state: () => ({
    articleInfo: {}, // Default state
  }),
  actions: {
    setArticleList(list) {
      if (Array.isArray(list)) {
        this.articleInfo = list;
      } else {
        console.error("Invalid list provided to setArticleList");
      }
    },
    removeArticle(id) {
      this.articleInfo = this.articleInfo.filter((article) => article.id !== id);
    },
    clearArticleList() {
      this.articleInfo = [];
    },
  },
  getters: {
    articleById: (state) => (id) => state.articleInfo.find((article) => article.id === id),
  },
  persist: {
    storage: sessionStorage,
    pick: ["articleInfo"], // Ensure only `articleInfo` is persisted
  },
});

export default useArticleChild;