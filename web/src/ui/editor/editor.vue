<template>
  <div>
    <!-- Use v-show instead of v-if cuz we're using refs -->
    <div v-show="!fatalError" ref="editor" class="kx-editor content"></div>
    <div v-if="fatalError">
      <ErrorView :message="fatalError"/>
    </div>
  </div>
</template>

<style scoped>
.kx-editor {
  margin-bottom: 20px;
  border: 1px solid #ededed;
}
</style>


<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ErrorView from '../views/errorView.vue';
import KXEditor from 'kangxi-editor';
import KXEN from 'kangxi-editor/dist/langs/en';
import KXCS from 'kangxi-editor/dist/langs/cs';
import 'kangxi-editor/dist/editor.css';
import app from '@/app';
import ls from '@/ls';

@Component({
  components: {
    ErrorView,
  },
})
export default class Editor extends Vue {
  @Prop() initialContent!: string;

  editorElement!: HTMLDivElement;
  editor: KXEditor | null = null;
  fatalError = '';

  mounted() {
    this.editorElement = this.$refs.editor as HTMLDivElement;
    try {
      this.editor = KXEditor.create(this.editorElement, {
        contentHTML: this.initialContent || '',
        lang: app.state.lang === 'cs' ? KXCS : KXEN,
      });
    } catch (err) {
      this.fatalError = err.message;
    }
  }

  getContent(): string {
    if (!this.editor) {
      return '';
    }
    return this.editor.contentHTML || '';
  }

  @Watch('value', { immediate: true })
  private onValueChanged(val: string, oldVal: string) {
    if (!this.editor) {
      return;
    }
    this.editor.contentHTML = val || '';
  }
}
</script>