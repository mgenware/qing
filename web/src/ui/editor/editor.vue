<template>
  <div>
    <!-- Use v-show instead of v-if cuz we're using refs -->
    <div
      v-show="!fatalError"
      ref="editor"
      class="kx-editor content"
      :style="{ marginBottom: '0.75rem' }"
    ></div>
    <div v-if="fatalError">
      <ErrorView :message="fatalError"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ErrorView from '../views/errorView.vue';
import KXEditor from 'kangxi-editor';
import KXEN from 'kangxi-editor/dist/langs/en';
import KXCS from 'kangxi-editor/dist/langs/cs';
import './editor.css';
import app from '@/app';
import ls from '@/ls';

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

  mounted() {
    console.log('app.state.lang ', app.state.lang);
    this.editorElement = this.$refs.editor as HTMLDivElement;
    try {
      this.editor = KXEditor.create(this.editorElement, {
        contentHTML: this.value || '',
        lang: app.state.lang === 'cs' ? KXCS : KXEN,
      });
    } catch (err) {
      this.fatalError = err.message;
    }
  }

  getValue(): string {
    if (!this.editor) {
      return '';
    }
    console.log(' inner ', this.editor.contentHTML);
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