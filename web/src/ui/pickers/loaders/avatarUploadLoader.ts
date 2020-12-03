/* eslint-disable class-methods-use-this */
import FileUploadLoader from 'lib/fileUploadLoader';
import routes from 'routes';

export interface AvatarUploadResponse {
  iconL?: string;
  iconS?: string;
}

export default class AvatarUploadLoader extends FileUploadLoader<AvatarUploadResponse> {
  requestURL(): string {
    return routes.s.pri.profile.setAvatar;
  }
}
