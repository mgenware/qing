<template>
  <div>
    <div>
      <Editor :value="editorContent" @save="handleEditorSave"/>
    </div>
    <button>{{isEditing ? $ls.save : $ls.publish }}</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EditProfileData from './editProfileData';
import StatusView from '@/ui/views/statusView.vue';
import app from '@/app';
import { ls, format } from '@/ls';
import SetInfoLoader from './loaders/setInfoLoader';
import SetBioLoader from './loaders/setBioLoader';
import GetUserEditingDataLoader from './loaders/getUserEditingDataLoader';
// avatar uploader
import AvatarUploader from '@/ui/pickers/avatarUploader.vue';
import AvatarUploaderResp from '@/ui/pickers/avatarUploaderResponse';
// bio
import Editor, { HandleSaveArgs } from '@/ui/editor/editor.vue';

@Component({
  components: {
    StatusView,
    AvatarUploader,
    Editor,
  },
})
export default class Composer extends Vue {
  editorContent = '';

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
    const loader = new SetInfoLoader(Name, Website, Company, Location);
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

  private async handleEditorSave(e: HandleSaveArgs) {
    console.log(e);
    const loader = new SetBioLoader(e.content);
    const res = await app.runActionAsync(loader, ls.saving);
    if (res.isSuccess) {
      this.profileData.Bio = e.content;
      e.saved = true;
      await app.alert.successToast(ls.saved);
    }
  }
}
</script>
