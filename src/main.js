require("dotenv").config();
import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import Notifications from "vue-notification";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "./assets/index.scss";
import cookie from 'js-cookie'

Vue.use(VueSweetalert2);

Vue.use(Notifications);
Vue.config.productionTip = false;

const url = process.env.VUE_APP_API;
const token = cookie.get('userToken');
const axiosInstance = Axios.create({
  baseURL: url,
  // baseURL: 'http://192.168.42.49:3002/api/'
  // withCredentials: true,
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // whatever you want to do with the error

    // if (error.response.data.message === "BLOCKED") {
    //   Axios.post(url + "logout", {
    //     log_id: store.state.user.log_id
    //   }).then(response => {
    //     store.dispatch("logout");

    //     router.push("/login");
    //   });
    // }

    throw error;
  }
);

axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token

Vue.prototype.$axios = axiosInstance;
Vuex.Store.prototype.$axios = axiosInstance;
Vuex.Store.prototype.$router = router;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
