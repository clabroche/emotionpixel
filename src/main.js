import App from './App.vue'
import router from './router'
import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')

import { createApp, h } from "vue";

const app = createApp({
  render: () => h(App)
});

app.use(router);

app.mount("#app");
