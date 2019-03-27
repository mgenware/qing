<template>
  <div>
    <div v-if="fatalError">
      <ErrorView :message="fatalError"/>
    </div>
    <div v-else>
      <div ref="editor" class="kx-editor content" :style="{ marginBottom: '0.75rem' }"></div>
      <div class="m-t-sm">
        <button class="button is-success" @click="handleSave">{{$ls.save}}</button>
        <button class="button m-l-md" @click="handleReset">{{$ls.reset}}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ErrorView from '../views/errorView.vue';
import KXEditor from 'kangxi-editor';
import './editor.css';
import { EditorState } from 'prosemirror-state';
import app from '../../app';
import { ls } from '../../ls';

export class HandleSaveArgs {
  saved = false;
  constructor(public content: string) {}
}

@Component({
  components: {
    ErrorView,
  },
})
export default class Editor extends Vue {
  @Prop() value!: string;
  editorElement!: HTMLDivElement;
  editor: KXEditor | null = null;
  fatalError = '';

  // The editor state upon content reset.
  private lastSavedContent: string = '';

  mounted() {
    this.editorElement = this.$refs.editor as HTMLDivElement;
    try {
      this.editor = KXEditor.create(this.editorElement, this.value || '');
      this.setSaved();
    } catch (err) {
      this.fatalError = err.message;
    }
  }

  handleTextChanged(e: any) {
    this.$emit('onChanged', e.target.value);
  }

  @Watch('value', { immediate: true })
  onChildChanged(val: string, oldVal: string) {
    if (!this.editor) {
      return;
    }
    this.editor.contentHTML = val || '';
    this.setSaved();
  }

  private setSaved() {
    if (!this.editor) {
      return;
    }
    this.lastSavedContent = this.editor.contentHTML;
  }

  private handleSave() {
    if (!this.editor) {
      return;
    }
    const content = this.editor.contentHTML;
    const args = new HandleSaveArgs(content);
    this.$emit('save', args);
    if (args.saved) {
      this.setSaved();
    }
  }

  private async handleReset() {
    if (!this.editor) {
      return;
    }
    if (this.editor.contentHTML !== this.lastSavedContent) {
      const confirmed = await app.alert.confirm(ls.rysDiscardChanges);
      if (!confirmed) {
        return;
      }
    }
    this.editor.contentHTML = this.lastSavedContent;
  }
}
</script>