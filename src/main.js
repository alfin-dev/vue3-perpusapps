// @ts-ignore
import {
    createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import { setApiUrl } from './router'

import {
    library
} from '@fortawesome/fontawesome-svg-core'
import {
    FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'
import {
    fas
} from '@fortawesome/free-solid-svg-icons'
library.add(fas)

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// import the package
import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";

import {
    LoadingPlugin
} from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

const app = createApp(App)
app.config.globalProperties.apiUrl = 'http://localhost:8081'
app.use(router)
setApiUrl(app.config.globalProperties.apiUrl)
app.use(VueAwesomePaginate)
app.use(LoadingPlugin)
app.component("fa", FontAwesomeIcon)
app.mount('#app')