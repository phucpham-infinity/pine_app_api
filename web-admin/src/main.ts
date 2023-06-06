import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import store from "./lib/store";
import router from "./lib/router";

createApp(App).use(router).use(store).mount("#app");
