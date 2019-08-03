function toURL(s: string): string {
  return `/m/${s}`;
}

export const newPost = 'new-post';
export const newPostURL = toURL(newPost);
export const editProfile = 'profile';
export const editProfileURL = toURL(editProfile);
