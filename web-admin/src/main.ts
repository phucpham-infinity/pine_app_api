import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import { Quasar } from "quasar";
import "@quasar/extras/roboto-font/roboto-font.css";
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/material-icons-outlined/material-icons-outlined.css";
import "@quasar/extras/material-icons-round/material-icons-round.css";
import "@quasar/extras/material-icons-sharp/material-icons-sharp.css";
import "@quasar/extras/material-symbols-outlined/material-symbols-outlined.css";
import "@quasar/extras/material-symbols-rounded/material-symbols-rounded.css";
import "@quasar/extras/material-symbols-sharp/material-symbols-sharp.css";
import "quasar/src/css/index.sass";

import store from "./lib/store";
import router from "./lib/router";

createApp(App)
  .use(router)
  .use(store)
  .use(Quasar, {
    plugins: {}, // import Quasar plugins and add here
  })
  .mount("#app");
