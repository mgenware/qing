<template>
  <div class="alert alert-danger" role="alert" :style="{ padding: '20px 40px' }">
    <p class="text-danger">{{title}}</p>
    <p>{{message}}</p>

    <p v-if="canRetry">
      <button class="button is-primary m-t-md" @click="handleRetryClick">{{$ls.retry}}</button>
    </p>
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
