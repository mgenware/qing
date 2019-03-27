<template>
  <div class="notification is-danger">
    <div class="content">
      <h3 class="has-text-white">{{title || $ls.errOccurred}}</h3>
      <p>{{message}}</p>

      <p v-if="canRetry">
        <button class="button m-t-md" @click="handleRetryClick">{{$ls.retry}}</button>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component
export default class ErrorView extends Vue {
  @Prop() title!: string;
  @Prop() message!: string;
  @Prop() canRetry!: boolean;

  handleRetryClick() {
    this.$emit('onRetryClick');
  }
}
</script>
