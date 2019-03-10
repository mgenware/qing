<template>
  <div v-if="status.isStarted">
    <Spinner v-if="status.isWorking" :text="loadingText || $ls.loading"></Spinner>
    <ErrorView
      v-else-if="status.isError"
      :canRetry="canRetry"
      :title="errorTitle || $ls.errOccurred"
      :message="status.error.message"
      @onRetryClick="handleRetryClick"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Status from '@/lib/status';
import Spinner from './spinner.vue';
import ErrorView from './errorView.vue';

@Component({
  components: {
    Spinner,
    ErrorView,
  },
})
export default class StatusView extends Vue {
  @Prop() status!: Status;
  @Prop() loadingText!: string;
  @Prop({ default: false }) canRetry!: boolean;
  @Prop() errorTitle!: string;

  handleRetryClick() {
    this.$emit('onRetryClick');
  }
}
</script>
