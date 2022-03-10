import { createApp } from "vue";
import App from "./TestApp.vue";

// Router
import { Router } from "./routes.js";

const app = createApp(App);

app.use(Router);

app.mount("#app");