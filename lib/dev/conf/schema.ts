export interface QingConfSchema {
  extends?: string;
  debug?: DebugConfig;
  logging: LoggingConfig;
  http: HttpConfig;
  templates: TemplatesConfig;
  localization: LocalizationConfig;
  app_profile: AppProfileConfig;
  app_settings: AppSettingsConfig;
  db: DbConfig;
  res_server: ResServerConfig;
  extern: ExternConfig;
  [k: string]: unknown;
}
export interface DebugConfig {
  reload_views_on_refresh?: boolean;
  panic_on_unexpected_html_errors?: boolean;
  panic_on_unexpected_json_errors?: boolean;
  turbo_web?: {
    dir?: string;
    url?: string;
    [k: string]: unknown;
  };
  mailbox?: {
    url?: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
export interface LoggingConfig {
  dir: string;
  [k: string]: unknown;
}
export interface HttpConfig {
  port?: number;
  log_404_error?: boolean;
  static: {
    url: string;
    dir: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
export interface TemplatesConfig {
  dir: string;
  [k: string]: unknown;
}
export interface LocalizationConfig {
  dir: string;
  langs: [string, ...string[]];
  [k: string]: unknown;
}
export interface AppProfileConfig {
  dir: string;
  [k: string]: unknown;
}
export interface AppSettingsConfig {
  file: string;
  [k: string]: unknown;
}
export interface DbConfig {
  user: string;
  pwd: string;
  database: string;
  host: string;
  port: number;
  params: string;
  [k: string]: unknown;
}
export interface ResServerConfig {
  url: string;
  dir: string;
  [k: string]: unknown;
}
export interface ExternConfig {
  redis: {
    port: number;
    [k: string]: unknown;
  };
  img_proxy: {
    port: number;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
