/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import np from 'path';
import * as yaml from 'js-yaml';
import * as qdu from '@qing/dev/util.js';
import * as mfs from 'm-fs';
import { infraDef } from '@qing/def';
import { CoreConfigSchema } from './coreConfigSchema.js';
import { mergeDeep } from './deepMarge.js';

const header = `${qdu.copyrightStringYAML}# This file was automatically generated by running \`qing conf\`
# Do not edit this file manually, your changes will be overwritten.

`;

const sServer = 'server';
const sDB = 'db';
const sMS = 'ms';
const sMigrate = 'migrate';
const sImgProxy = 'img_proxy';

const qingDataVolumeString = `../volumes/qing_data:${infraDef.qingDataDir}`;

// Loads the given config file.
async function loadConfigFile(file: string): Promise<CoreConfigSchema> {
  const absPath = np.resolve(file);
  const confObj = JSON.parse(await mfs.readTextFileAsync(absPath)) as CoreConfigSchema;
  if (confObj.extends) {
    const basePath = np.resolve(np.dirname(absPath), confObj.extends);
    const baseObj = await loadConfigFile(basePath);
    mergeDeep(confObj, baseObj);
  }
  return confObj;
}

function setRestartField(service: Record<string, unknown>, conf: CoreConfigSchema) {
  if (!conf.dev) {
    // eslint-disable-next-line no-param-reassign
    service.restart = 'always';
  }
}

function generateDockerComposeObj(_name: string, conf: CoreConfigSchema) {
  const server = {
    // Pass environment variables from docker compose command into this context.
    // Syntax: https://docs.docker.com/compose/environment-variables/
    environment: [
      infraDef.userCoreConfigNameEnv,
      infraDef.userAppConfigNameEnv,
      infraDef.brEnv,
      infraDef.utEnv,
    ],
    build: {
      context: '.',
      dockerfile: 'dev.dockerfile',
    },
    volumes: [
      // [Dev only] Preset dev config files.
      `../userland/config/dev:${infraDef.devConfigDir}`,
      // [Dev only] Server source files.
      `../server:${infraDef.devServerDir}`,
      // Templates.
      `../userland/templates:${infraDef.templateDir}`,
      // Compiled static files.
      `../userland/static:${infraDef.staticDir}`,
      // Localized strings.
      `../userland/langs/server:${infraDef.langsDir}`,
      // Schema folder.
      `../userland/config/schema:${infraDef.configSchemaDir}`,
      qingDataVolumeString,
    ],
    ports: ['8000:8000'],
    depends_on: [sMS, sDB, sImgProxy],
  };
  setRestartField(server, conf);

  const ms = {
    image: 'redis:7',
    ports: ['6379:6379'],
  };
  setRestartField(ms, conf);

  const dbConf = conf.db;
  const db = {
    image: 'mariadb:10.6',
    ports: ['3306:3306'],
    environment: {
      MYSQL_ROOT_PASSWORD: 'qing_dev_root_pwd',
      MYSQL_USER: dbConf.user,
      MYSQL_PASSWORD: dbConf.pwd,
      MYSQL_DATABASE: dbConf.database,
    },
  };
  setRestartField(db, conf);

  const migrate = {
    image: 'migrate/migrate',
    profiles: ['oth'],
    volumes: [`../migrations:${infraDef.migrationsDir}`],
    entrypoint: [
      'migrate',
      '-path',
      `${infraDef.migrationsDir}`,
      '-database',
      'mysql://qing_dev:qing_dev_pwd@tcp(db:3306)/qing_dev?multiStatements=true',
    ],
    depends_on: [sDB],
  };

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const img_proxy = {
    image: 'h2non/imaginary',
    ports: ['9000:9000'],
    command: '-enable-url-source',
    volumes: [qingDataVolumeString],
  };
  setRestartField(img_proxy, conf);

  const services = {
    [sServer]: server,
    [sMS]: ms,
    [sDB]: db,
    [sMigrate]: migrate,
    [sImgProxy]: img_proxy,
  };

  return {
    version: '3.9',
    services,
  };
}

async function buildDockerComposeFile(name: string, file: string) {
  const serverDir = qdu.serverPath();
  const confObj = await loadConfigFile(file);
  const dockerComposeObj = generateDockerComposeObj(name, confObj);
  const dest = np.join(serverDir, `${name}.docker-compose.yml`);
  const destContent = `${header}${yaml.dump(dockerComposeObj)}`;
  await mfs.writeFileAsync(dest, destContent);
}

await buildDockerComposeFile('dev', qdu.coreConfigPath('base'));
