import BaseLoader from '@/lib/loader';

export default class SetBioLoader extends BaseLoader {
  constructor(public bio: string) {
    super();
  }

  requestURL(): string {
    return '/sr/settings/profile/set_bio';
  }

  requestParams(): object {
    const ret = {
      bio: this.bio,
    };
    return ret;
  }
}
