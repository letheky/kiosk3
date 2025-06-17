<script setup>
import { ref, watch, reactive } from "vue"
import axios from "axios"
import useStore from '@/store/useStore.js'


const props = defineProps({
    status: Boolean
})
const store = useStore()
const template = ref(null)
const show_menu = ref(false)
const selected_config = ref("default")
var holdTimeout = null

const loading = ref(false)
const success = ref(false)
const error = ref(null)
const data = reactive({
    preload: null,
    value: null
})


function startHold() {
    holdTimeout = setTimeout(() => {
        show_menu.value = true
    }, 5000)
}

function clearHold() {
    clearTimeout(holdTimeout)
}

function getTemplate() {
    // axios.get(`${store.api}/api/app_kiosk/template/${store.template}/`)
    // .then((res) => {
    //     template.value = res.data
    // })
    // .catch((err) => console.log(err))
}

function handleReload() {
    window.location.reload()
}

watch(()=>props.status, (newValue, _)=>{
    if (newValue) {
        getTemplate()
    }
})

watch(()=>selected_config.value, (newValue,_)=>{
    if (newValue == 'default') {
        const existingStyle = document.getElementById('dynamic-style')
        if (existingStyle) {
            existingStyle.remove()
        }
    }
    else {
        const existingStyle = document.getElementById('dynamic-style')
        if (existingStyle) {
            existingStyle.remove()
        }
        if (newValue.content) {
            const style = document.createElement('style')
            style.id = 'dynamic-style'
            style.textContent = newValue.content
            document.head.appendChild(style)
        }
        else if (newValue.file) {
            const style = document.createElement('link')
            style.id = 'dynamic-style'
            style.rel = 'stylesheet'
            style.href = newValue.file
            document.head.appendChild(style)
        }
    }
})

watch(()=>store.selected_id, (newValue, _)=>{
    data.preload = null
    data.value = null
})

function getData() {
    loading.value = true
    axios.get(`${store.selected_path}/preload/`)
    .then((res) => {
        data.preload = res.data
    })
    .catch((err) => {
        loading.value = false
        error.value = err
        return
    })

    axios.get(`${store.selected_path}/${store.selected_id}/`)
    .then((res) => {
        data.value = res.data
        loading.value = false
    })
    .catch((err) => {
        loading.value = false
        error.value = err
        return
    })
}

function handleCancer() {
    data.value = null
    data.preload = null
    success.value = false
    loading.value = false
    error.value = null
}

function handleSubmit() {
    loading.value = true
    const form = document.querySelector('.edit-form')
    const form_data = new FormData(form)
    const form_data_object = {}
    const formSubmit = new FormData()

    for (const [key, value] of form_data.entries()) {
        if (value instanceof File) {
            if (value.name) {
                form_data_object[key] = value
            }
            else {
                form_data_object[key] = null
            }
        } else {
            form_data_object[key] = value
        }
    }
    for (const [key, value] of Object.entries(data.preload.fields)) {
        if (key == 'translations') {
            const trans_data = {}
            trans_data[store.lang] = {}
            for (const [k, v] of Object.entries(data.preload.fields[key])) {
                trans_data[store.lang][k] = form_data_object[k]
            }
            formSubmit.append(key, JSON.stringify(trans_data))
        }
        else {
            if (data.value[key] != form_data_object[key] && form_data_object[key]) {
                formSubmit.append(key, form_data_object[key])
            }
        }
    }
    axios.patch(`${store.selected_path}/${store.selected_id}/`, formSubmit)
    .then((res) => {
        loading.value = false
        success.value = true
    })
    .catch((err) => {
        loading.value = false
        error.value = err
        return
    })
}

</script>

<template>
    <div class="menu-control">
        <button class="btn btn-danger" data-bs-toggle="offcanvas" href="#offcanvasMenu" v-if="show_menu">Menu</button>
        <div class="w-100 h-100" @mousedown="startHold" @mouseup="clearHold" @mouseleave="clearHold" v-else></div>
    </div>

    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasMenu" aria-labelledby="offcanvasMenu">
        <div class="offcanvas-header">
            <h2 class="offcanvas-title" id="offcanvasMenu">Menu</h2>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <div class="row p-3">
                <button class="btn btn-primary mt-2" type="button" data-bs-toggle="offcanvas" href="#offcanvasConfig">Cấu hình</button>
                <button class="btn btn-primary mt-2" type="button" data-bs-toggle="offcanvas" href="#offcanvasData">Dữ liệu</button>
                <button class="btn btn-warning mt-4" type="button" @click="handleReload">Tải lại trang</button>
                <button class="btn btn-danger mt-2" type="button" data-bs-dismiss="offcanvas" @click="show_menu=false">Ẩn Menu</button>
            </div>
        </div>
    </div>
    <div class="offcanvas offcanvas-end" tabindex="1" id="offcanvasConfig" aria-labelledby="offcanvasConfig">
        <div class="offcanvas-header">
            <h2 class="offcanvas-title" id="offcanvasConfig">Cấu hình</h2>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <div class="form-check">
                <input class="form-check-input" type="radio" id="default" value="default" v-model="selected_config">
                <label class="form-check-label" for="default">
                    Mặc định
                </label>
            </div>
            <div class="form-check" v-for="i in template?.templateconfig_template">
                <input class="form-check-input" type="radio" :id="i.id" :value="i" v-model="selected_config">
                <label class="form-check-label" :for="i.id">
                    {{ i.name }}
                </label>
            </div>
        </div>
    </div>
    <div class="offcanvas offcanvas-end w-50" tabindex="2" id="offcanvasData" aria-labelledby="offcanvasData">
        <div class="offcanvas-header">
            <h2 class="offcanvas-title" id="offcanvasData">Dữ liệu</h2>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body position-relative">
            <div v-if="!(data.preload && data.value)">
                <b>Đường dẫn dữ liệu:</b>
                <p class="mt-1 mb-3">{{ store.selected_path }}/{{ store.selected_id }}</p>
                <button type="button" class="btn btn-success" @click="getData">Lấy dữ liệu</button>
            </div>
            <div v-else>
                <form class="edit-form" v-if="!success">
                    <template v-for="[key, value] of Object.entries(data.preload.fields)">
                        <template v-if="key == 'translations'">
                            <div class="mb-2" v-for="[k, v] of Object.entries(data.preload.fields[key])">
                                <b>{{ k }}</b>
                                <div class="ms-2" v-if="v == 'file'">
                                    <a :href="data.value[key][store.lang][k]">{{ data.value[key][store.lang][k] }}</a>
                                </div>
                                <textarea class="form-control mt-2 mb-2" :name="k" :id="k" rows="10" :value="data.value[key][store.lang][k]" v-if="v=='textarea'"></textarea>
                                <input type="file" class="form-control mt-2 mb-2" :id="k" :name="k" v-else-if="v=='file'">
                                <input :type="v" class="form-control mt-2 mb-2" :id="k" :name="k" :value="data.value[key][store.lang][k]" v-else>
                            </div>
                        </template>
                        <template v-else>
                            <div class="mb-2">
                                <b>{{ key }}</b>
                                <div class="ms-2" v-if="value == 'file'">
                                    <a :href="data.value[key]">{{ data.value[key] }}</a>
                                </div>
                                <textarea class="form-control mt-2 mb-2" :name="key" :id="key" rows="10" :value="data.value[key][store.lang][k]" v-if="value=='textarea'"></textarea>
                                <input type="file" class="form-control mt-2 mb-2" :id="key" :name="key" v-else-if="value=='file'">
                                <input :type="value" class="form-control mt-2 mb-2" :id="key" :name="key" :value="data.value[key]" v-else>
                            </div>
                        </template>
                    </template>
                    <div class="d-flex gap-2 mt-4">
                        <button type="button" class="btn btn-success" @click="handleSubmit">Xác nhận</button>
                        <button type="button" class="btn btn-danger" @click="handleCancer">Hủy</button>
                    </div>
                </form>
                <div class="d-flex flex-column align-items-center gap-2 w-100 h-100 pt-5" v-else>
                    <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="#198754" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <p>Cập nhật thành công</p>
                    <button type="button" class="btn btn-primary mt-4" @click="handleCancer">Trở lại</button>
                </div>
            </div>
            <div class="loading" v-if="loading">
                <div class="d-flex align-items-center gap-2">
                    <span class="spinner-border spinner-border" role="status" aria-hidden="true"></span>
                    <p>Loading ...</p>
                </div>
            </div>
            <div class="error" v-if="error">
                <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                <p>{{ error }}</p>
                <button type="button" class="btn btn-primary mt-4" @click="handleCancer">Trở lại</button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.menu-control {
    position: fixed;
    top: 5px;
    left: 5px;
    z-index: 1000;
    width: 70px;
    height: 40px;
    overflow: hidden;
}
.loading {
    position: absolute;
    z-index: 100;
    width: 100%;
    height: 100%;
    display: grid;
    place-content: center;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(3px);
}
.error {
    position: absolute;
    z-index: 100;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px 20px;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255);
}
</style>