function toURL(s: string): string {
  return `/m/${s}`;
}

export const newPost = 'new-post';
export const newPostURL = toURL(newPost);
