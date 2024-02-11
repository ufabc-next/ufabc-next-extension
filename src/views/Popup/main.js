import Vue from "vue";
import Vuetify from "vuetify";
import "../../styles/main.css";

import Popup from "./Popup.vue";

Vue.use(Vuetify);

var app = new Vue({
  el: "#app",
  data: {
    name: "popup-next-extension",
  },
  render: (h) => h(Popup),
});
