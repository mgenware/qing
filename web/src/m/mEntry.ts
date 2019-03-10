import app from '@/app';
import MApp from './mApp.vue';
import router from './router';

if (document.getElementById('m_app')) {
  app.mountComponent('#m_app', MApp, undefined, router);
}
