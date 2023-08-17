// Generated via https://transform.tools/json-schema-to-typescript

export interface AppConfigSchema {
  extends?: string;
  mail: MailConfig;
  permissions: PermissionsConfig;
  forum?: ForumConfig;
  content: ContentConfig;
  [k: string]: unknown;
}
export interface MailConfig {
  smtp: {
    host: string;
    ssl?: boolean;
    port: number;
    [k: string]: unknown;
  };
  no_reply_account: MailAccountConfig;
  [k: string]: unknown;
}
export interface MailAccountConfig {
  email: string;
  user_name: string;
  pwd: string;
  display_name?: string;
  [k: string]: unknown;
}
export interface PermissionsConfig {
  post: 'onlyMe' | 'everyone';
  [k: string]: unknown;
}
export interface ForumConfig {
  enabled?: boolean;
  [k: string]: unknown;
}
export interface ContentConfig {
  input_type: 'standard' | 'markdown';
  [k: string]: unknown;
}
