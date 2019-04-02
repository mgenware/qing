<template>
  <div>
    <StatusView
      v-if="loader && !loader.status.isSuccess"
      :status="loader.status"
      :canRetry="true"
      @onRetryClick="loadAsync"
    />

    <div v-else>
      <EditProfileView :profileData="profileData"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EditProfileView from './editProfileView.vue';
import EditProfileData from './editProfileData';
import GetUserEditingDataLoader from './loaders/getUserEditingDataLoader';
import StatusView from '@/ui/views/statusView.vue';

@Component({
  components: {
    EditProfileView,
    StatusView,
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
}
</script>
