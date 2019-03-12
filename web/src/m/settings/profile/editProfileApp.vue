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
        <div class="message-header">{{$ls.profilePicture}}</div>
        <div class="message-body">
          <p>
            <img
              :src="profileData.IconURL"
              class="border-radius-5"
              width="250"
              height="250"
              :style="{ border: '1px solid #ededed' }"
            >
          </p>
          <div class="mt-3">
            <AvatarUploader
              postURL="/sr/settings/profile/set_avatar"
              @onComplete="handleImgUploadComplete"
            />
          </div>
        </div>
      </article>

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
// avatar uploader
import AvatarUploader from '@/ui/pickers/avatarUploader.vue';
import AvatarUploaderResp from '@/ui/pickers/avatarUploaderResponse';

@Component({
  components: {
    StatusView,
    AvatarUploader,
  },
})
export default class EditProfileApp extends Vue {
  profileData = new EditProfileData();
  loader: GetUserEditingDataLoader | null = null;

  async mounted() {
    await this.loadAsync();
  }

  async loadAsync() {
    try {
      this.loader = new GetUserEditingDataLoader();
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
      await app.alert.successToast(ls.saved);
      // update user session
      const user = app.state.user;
      if (user) {
        user.name = Name;
      }
    }
  }

  private async handleImgUploadComplete(
    error: string | null,
    resp: AvatarUploaderResp | null,
  ) {
    if (error) {
      await app.alert.error(error);
      return;
    }
    if (resp) {
      // update current image
      this.profileData.IconURL = resp.iconL || '';

      // update session
      const user = app.state.user;
      if (user) {
        user.iconURL = resp.iconL || '';
      }
    }
  }
}
</script>
