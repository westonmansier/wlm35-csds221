import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import App from './App.vue';

import './assets/main.css';
import '@mdi/font/css/materialdesignicons.css';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';

const app = createApp(App);
app
  .use(createPinia())
  .use(
    createVuetify({
      components,
      directives,
    })
  )
  .mount('#app');
