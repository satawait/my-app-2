import Vue from 'vue';
import './plugins/axios';
import App from './App.vue';
import router from './router';
import store from './store';
import 'core-js/stable';
import './plugins/element.js';
import './utils/componentRegister.js';
import 'normalize.css/normalize.css'; // a modern alternative to CSS resets
import * as filters from '@/filters';

Vue.config.productionTip = false;

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
