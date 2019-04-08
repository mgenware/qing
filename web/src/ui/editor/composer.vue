<template>
  <div>
    <div v-if="showTitle" class="control">
      <input
        type="text"
        class="input"
        :placeholder="$ls.title"
        ref="title"
        @input="setUnsavedChanges(true)"
      >
    </div>
    <div class="m-t-md">
      <Editor ref="editor"/>
    </div>
    <div>
      <button class="button is-success" @click="handleSave">{{$ls.publish}}</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import app from '@/app';
import { ls, format } from '@/ls';
import Editor from './editor.vue';
import ComposerPayload from './composerPayload';

@Component({
  components: {
    Editor,
  },
})
export default class Composer extends Vue {
  @Prop() showTitle!: boolean;

  editor: Editor | null = null;
  titleElement: HTMLInputElement | null = null;

  mounted() {
    this.editor = this.$refs.editor as Editor;
    this.titleElement = this.$refs.title as HTMLInputElement;
  }

  private getTitle(): string {
    if (this.showTitle && this.titleElement) {
      return this.titleElement.value;
    }
    return '';
  }

  private checkFormData() {
    if (this.showTitle) {
      if (!this.getTitle()) {
        throw new Error(ls.titleCannotBeEmpty);
      }
    }
  }

  private getContent(): string {
    if (!this.editor) {
      return '';
    }
    return this.editor.getContent();
  }

  private async validateFormDataAsync(): Promise<boolean> {
    try {
      this.checkFormData();
      return true;
    } catch (err) {
      await app.alert.error(err.message);
      return false;
    }
  }

  private setUnsavedChanges(val: boolean) {
    app.userData.setUnsavedChanges(val);
  }

  private async handleSave() {
    const isValid = await this.validateFormDataAsync();
    if (!isValid) {
      return;
    }
    const payload = new ComposerPayload(this.getContent());
    if (this.showTitle) {
      payload.title = this.getTitle();
    }
    this.$emit('save', payload);
  }
}
</script>
