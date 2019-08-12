export default class ComposerPayload {
  title: string | null = null;
  captcha: string | null = null;
  constructor(public content: string) {}
}
