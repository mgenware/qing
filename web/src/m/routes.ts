function toURL(s: string): string {
  return `/s/${s}`;
}

export const newPost = 'new-post';
export const newPostURL = toURL(newPost);
