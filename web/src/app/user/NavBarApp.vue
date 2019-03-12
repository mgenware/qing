<template>
  <div id="m_nav_menu" class="navbar-menu">
    <div class="navbar-end">
      <div v-if="user" class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link" :href="user.profileURL">
          <img
            alt
            :src="user.iconURL"
            width="20"
            height="20"
            class="border-radius-10 vertical-align-middle"
          >
          <span class="m-l-sm">{{user.name}}</span>
        </a>
        <div class="navbar-dropdown">
          <a class="navbar-item" :href="user.profileURL">{{$ls.profile}}</a>
          <hr class="navbar-divider">

          <hr class="navbar-divider">
          <a class="navbar-item" :href="editProfileURL">{{$ls.settings}}</a>
          <a class="navbar-item" href="#" v-on:click.prevent="handleLogOutClick">{{$ls.signOut}}</a>
        </div>
      </div>
      <a v-else href="#" class="navbar-item" @click.prevent="handleLoginClick">
        <img src="/static/img/user/login.svg" width="16" height="16">
        <span class="m-l-sm">{{$ls.signIn}}</span>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import User from './User';
import app from '@/app';
import ls from '@/ls';
import defs from '@/defs';

@Component
export default class NavBarApp extends Vue {
  user = app.state.user;
  editProfileURL = defs.editProfileURL;

  async handleLogOutClick() {}
  handleLoginClick() {}
}
</script>
