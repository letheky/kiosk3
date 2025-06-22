import { defineStore } from 'pinia'
const useStore = defineStore('store', {
    state: () => ({
        api: localStorage.getItem('api') === null ? "" : localStorage.getItem('api'),
        showAudio: localStorage.getItem('showAudio') === null ? false : localStorage.getItem('showAudio'),
        template: localStorage.getItem('template') === null ? "" : localStorage.getItem('template'),
        kiosk: localStorage.getItem('kiosk') === null ? "" : localStorage.getItem('kiosk'),
        selected_id: null,
        selected_path: null,
        lang: 'vi',

        page: []
    }),
    actions: {
    },
    persist:{
        storage: sessionStorage
    }
})

export default useStore