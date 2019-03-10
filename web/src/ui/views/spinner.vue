<template>
  <div class="spinner-root">
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
    <div v-if="text" class="text-center">{{text}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Spinner extends Vue {
  @Prop() private text!: string;
}
</script>
