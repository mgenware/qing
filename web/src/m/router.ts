import Vue from 'vue';
import Router from 'vue-router';
import EditProfile from './settings/profile/editProfileApp.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  linkExactActiveClass: 'is-active',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/m/settings/profile',
      name: 'profile',
      component: EditProfile,
    },
  ],
});
