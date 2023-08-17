// Generated on https://transform.tools/json-schema-to-typescript

export interface CoreConfigSchema {
  extends?: string;
  dev?: DevConfig;
  logging: LoggingConfig;
  http: HttpConfig;
  templates: TemplatesConfig;
  db: DbConfig;
  res_server: ResServerConfig;
  extern: ExternConfig;
  z_test?: ZTestConfig;
  [k: string]: unknown;
}
export interface DevConfig {
  reload_views_on_refresh?: boolean;
  panic_on_unexpected_html_errors?: boolean;
  panic_on_unexpected_json_errors?: boolean;
  real_mail?: boolean;
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
    logging?: boolean;
    [k: string]: unknown;
  };
  img_proxy: {
    port: number;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
export interface ZTestConfig {
  a?: number;
  b?: number;
  c?: number;
  [k: string]: unknown;
}
