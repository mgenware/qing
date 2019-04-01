<template>
  <div>
    <div class="control">
      <input
        type="text"
        class="input"
        :placeholder="$ls.title"
        ref="title"
        @input="setUnsavedChanges(true)"
      >
    </div>
    <div>
      <Editor :value="editorContent" @save="handleEditorSave"/>
    </div>
    <button>{{isEditing ? $ls.save : $ls.publish }}</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import app from '@/app';
import { ls, format } from '@/ls';
// bio
import Editor, { HandleSaveArgs } from '@/ui/editor/editor.vue';

@Component({
  components: {
    Editor,
  },
})
export default class Composer extends Vue {
  editorContent = '';

  private setUnsavedChanges(val: boolean) {
    app.userData.setUnsavedChanges(val);
  }

  private async handleEditorSave(e: HandleSaveArgs) {}
}
</script>
