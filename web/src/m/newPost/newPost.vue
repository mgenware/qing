<template>
  <div>
    <Composer :showTitle="true" @save="handleSave"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Composer from '@/ui/editor/composer.vue';
import ComposerPayload from '@/ui/editor/composerPayload';
import SetEntityLoader from './loaders/setEntityLoader';
import EntityType from './loaders/entityType';
import app from '@/app';
import ls from '@/ls';

@Component({
  components: {
    Composer,
  },
})
export default class NewPost extends Vue {
  private async handleSave(payload: ComposerPayload) {
    const loader = new SetEntityLoader(true, EntityType.userPost, payload);
    await app.runActionAsync(loader, ls.publishing);
  }
}
</script>