import Loader from './loader';

export default class FileUploadLoader<T> extends Loader<T> {
  constructor(public formData: FormData) {
    super();
  }

  fetchParams(): RequestInit {
    return {
      method: 'POST',
      body: this.formData,
    };
  }
}
