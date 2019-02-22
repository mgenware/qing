import Vue from 'vue';
import ls from './ls';

// Styles
import './app/styles/bulma.css';
import './app/styles/app.css';

Vue.config.productionTip = false;
Vue.prototype.$ls = ls;
