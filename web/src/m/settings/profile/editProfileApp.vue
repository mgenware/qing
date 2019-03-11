<template>
  <div>
    <StatusView
      v-if="loader && !loader.status.isSuccess"
      :status="loader.status"
      :canRetry="true"
      @onRetryClick="loadAsync"
    />

    <div v-else>
      <article class="message m-t-md is-light">
        <div class="message-header">{{$ls.aboutMe}}</div>
        <div class="message-body">
          <div class="field">
            <label class="label" for="nick-tbx">{{$ls.nick}}</label>
            <div class="control">
              <input id="nick-tbx" type="text" class="input" name="nick" v-model="profileData.Name">
            </div>
          </div>

          <div class="field">
            <label class="label" for="website-tbx">{{$ls.url}}</label>
            <div class="control">
              <input
                id="website-tbx"
                type="url"
                name="website"
                class="input"
                v-model="profileData.Website"
              >
            </div>
          </div>

          <div class="field">
            <label class="label" for="company-tbx">{{$ls.company}}</label>
            <div class="control">
              <input
                id="company-tbx"
                type="text"
                name="company"
                class="input"
                v-model="profileData.Company"
              >
            </div>
          </div>

          <div class="field">
            <label class="label" for="addr-tbx">{{$ls.location}}</label>
            <div class="control">
              <input
                id="addr-tbx"
                type="text"
                name="location"
                class="input"
                v-model="profileData.Location"
              >
            </div>
          </div>
          <button
            type="button"
            class="button is-success"
            @click="handleSaveProfileClick"
          >{{$ls.save}}</button>
        </div>
      </article>

      <article class="message m-t-md is-light">
        <div class="message-header">{{$ls.bio}}</div>
        <div class="message-body">
          <div class="field">
            <label class="label">
              {{$ls.profileSig}}
              <button
                class="button is-small m-l-md"
                @click="handleEditSigClick"
              >{{$ls.edit}}</button>
            </label>
            <hr>
            <div class="md-content content" v-html="profileData.SigHTML"></div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EditProfileData from './editProfileData';
import StatusView from '@/ui/views/statusView.vue';
import app from '@/app';
import { ls, format } from '@/ls';
import SetProfileLoader from './loaders/setProfileLoader';
import GetUserEditingDataLoader from './loaders/getUserEditingDataLoader';

@Component({
  components: {
    StatusView,
  },
})
export default class EditProfileApp extends Vue {
  profileData = new EditProfileData();
  loader = new GetUserEditingDataLoader();

  async mounted() {
    await this.loadAsync();
  }

  async loadAsync() {
    try {
      const resp = (await this.loader.startAsync()) as EditProfileData;
      this.profileData = resp;
    } catch (_) {
      // error is handled in loader.result
    }
  }

  private async handleSaveProfileClick() {
    if (!this.profileData.Name) {
      await app.alert.error(format('pCannotBeEmpty', ls.name));
      return;
    }

    const { Name, Website, Company, Location } = this.profileData;
    const loader = new SetProfileLoader(Name, Website, Company, Location);
    const res = await app.runActionAsync(loader, ls.saving);
    if (res.isSuccess) {
      // update user session
      const user = app.state.user;
      if (user) {
        user.name = Name;
        user.notifyChanges();
      }
    }
  }
}
</script>
