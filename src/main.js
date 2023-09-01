import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import VueApexCharts from 'vue-apexcharts'
import Vuelidate from 'vuelidate'
import VueSweetalert2 from 'vue-sweetalert2';
import VueMask from 'v-mask'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueYoutube from 'vue-youtube'
import VeeValidate from "vee-validate";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import vco from "v-click-outside"

import router from './router'
import store from '@/state/store'
import i18n from './i18n'
import VJstree from 'vue-jstree'

import "@/assets/scss/app.scss";

import { initFirebaseBackend } from './helpers/firebase/authUtils';

import { configureFakeBackend } from './helpers/fakebackend/fake-backend';

import VueLazyload from 'vue-lazyload'

const firebaseConfig = {
  apiKey: process.env.VUE_APP_APIKEY,
  authDomain: process.env.VUE_APP_AUTHDOMAIN,
  databaseURL: process.env.VUE_APP_VUE_APP_DATABASEURL,
  projectId: process.env.VUE_APP_PROJECTId,
  storageBucket: process.env.VUE_APP_STORAGEBUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
  appId: process.env.VUE_APP_APPId,
  measurementId: process.env.VUE_APP_MEASUREMENTID
};

if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
  initFirebaseBackend(firebaseConfig);
} else {
  configureFakeBackend();
}

Vue.config.productionTip = false
Vue.use(Loading);
Vue.use(VueYoutube)
Vue.use(BootstrapVue)
Vue.use(VeeValidate);
Vue.use(vco)
Vue.use(Vuelidate)
Vue.use(VueSweetalert2);
Vue.use(VueMask)
Vue.use(VueLazyload)
Vue.use(require('vue-chartist'))
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE',
    libraries: 'places',
  },
  installComponents: true
})
Vue.component('apexchart', VueApexCharts)
Vue.component('v-jstree', VJstree)

export const eventBus = new Vue(); // creating an event bus.

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
