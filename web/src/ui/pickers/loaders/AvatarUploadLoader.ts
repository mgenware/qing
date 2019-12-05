import FileUploadLoader from 'lib/fileUploadLoader';
import routes from 'routes';

export interface AvatarUploadResponse {
  iconL?: string;
  iconS?: string;
}

export default class AvatarUploadLoader extends FileUploadLoader<
  AvatarUploadResponse
> {
  constructor(formData: FormData) {
    super(formData);
  }

  requestURL(): string {
    return routes.sr.profile.setAvatar;
  }
}
