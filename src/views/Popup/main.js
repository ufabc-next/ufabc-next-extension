import $ from "jquery";
import _ from "lodash";

// chrome.storage.local.get(function (items) {
//   var users = [];
//   var exists = false;
//   if (items) {
//     for (var key in items) {
//       if (_.get(items[key], '[0].cp', null) != null) {
//         exists = true;
//         users.push(key);
//       };
//     }
//     if (exists) {
//       $( 'p' ).replaceWith( 'Cadastrado para:' + users);
//     }
//   }
// })

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
