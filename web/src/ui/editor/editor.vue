<template>
  <textarea rows="10" style="width: 100%" value="value" @input="handleTextChanged"/>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Editor extends Vue {
  handleTextChanged(e: any) {
    this.$emit('onChanged', e.target.value);
  }
}
</script>