<template>
  <div>
    <form ref="formElement" :class="isWorking ? 'disable-all' : ''">
      <div class="file">
        <label class="file-label">
          <input
            type="file"
            name="main"
            class="file-input"
            ref="uploadElement"
            accept=".jpg, .jpeg, .png"
          >
          <span class="file-cta">
            <span class="file-icon">
              <img src="/static/img/main/upload.svg" width="16" height="16">
            </span>
            <span class="file-label">{{$ls.uploadFileBtn}}</span>
          </span>
          <br>
        </label>
      </div>
      <p>
        <small class="color-gray">{{$ls.uploadProfileImgDesc}}</small>
      </p>
    </form>

    <div v-if="isWorking" class="progress mt-3">
      <div
        v-if="progress"
        class="progress-bar"
        role="progressbar"
        :style="{ width: `${progress}%` }"
      ></div>
      <div
        v-else
        class="progress-bar progress-bar-striped progress-bar-animated"
        role="progressbar"
        :style="{ width: '100%' }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import StatusView from '@/ui/views/statusView.vue';
import Result from '@/lib/result';
import ls from '@/ls';
import ImgUploaderResponse from './avatarUploaderResponse';

@Component({
  components: {
    StatusView,
  },
})
export default class AvatarUploader extends Vue {
  @Prop() postURL!: string;
  isWorking = false;
  progress = 0;

  formElement!: HTMLFormElement;
  uploadElement!: HTMLInputElement;

  mounted() {
    this.formElement = this.$refs.formElement as HTMLFormElement;
    this.uploadElement = this.$refs.uploadElement as HTMLInputElement;
    this.hookEvents(this.formElement, this.uploadElement);
  }

  private hookEvents(domForm: HTMLFormElement, domFile: HTMLInputElement) {
    domFile.addEventListener('change', () => {
      this.isWorking = true;
      this.progress = 0;

      const fd = new FormData(domForm);
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('progress', e => {
        if (e.lengthComputable) {
          this.progress = Math.round((e.loaded / e.total) * 100);
        }
      });
      xhr.addEventListener('load', () => {
        this.isWorking = false;

        if (xhr.status === 200) {
          let resp: Result;
          try {
            resp = JSON.parse(xhr.responseText) as Result;
          } catch (exp) {
            resp = { code: 1000 };
            resp.message = `${ls.internalErr}: ${xhr.responseText}`;
          }

          if (resp.code) {
            // is error
            const { code } = resp;
            if (code === 10) {
              this.onError(ls.unsupportedImgExtErr, domFile);
            } else if (code === 11) {
              // Ignore no-header error, sometimes cancelling the dialog results in this error
              this.onError('', domFile);
            } else if (code === 12) {
              this.onError(ls.exceed5MBErr, domFile);
            } else {
              this.onError(`${resp.message}(${code})`, domFile);
            }
          } else {
            this.onSuccess(resp.data as ImgUploaderResponse);
          }
        } else {
          this.onError(
            `${ls.errOccurred}: ${xhr.statusText} ${xhr.status}`,
            domFile,
          );
        }
      });
      xhr.open('POST', this.postURL, true);
      xhr.send(fd);
    });
  }

  private onError(message: string, domFile: HTMLInputElement) {
    this.$emit('onComplete', message);
  }

  private onSuccess(data: ImgUploaderResponse) {
    this.$emit('onComplete', null, data);
  }
}
</script>
