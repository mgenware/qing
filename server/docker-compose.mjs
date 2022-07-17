/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import devConf from '../userland/config/dev.json' assert { type: 'json' };

// App dir in containers.
const conAppDir = '/qing';
// App data dir in containers.
const conAppDataDir = '/qing_data';

const sServer = 'server';
const sDB = 'db';
const sMS = 'ms';
const sMigrate = 'migrate';
const sImgProxy = 'img_proxy';

const volumesSrcDir = '../volumes';
const volumeAppData = `${volumesSrcDir}/qing_data:${conAppDataDir}`;

function applyCommonSettings(service) {
  service.restart = 'always';
}

const server = {
  build: '.',
  volumes: [
    `.:${conAppDir}/server`,
    `../web:${conAppDir}/web`,
    `../userland:${conAppDir}/userland`,
    volumeAppData,
  ],
  ports: ['8000:8000'],
  depends_on: [sMS, sDB, sImgProxy],
};
applyCommonSettings(server);

const ms = {
  image: 'redis:6',
  ports: ['6379:6379'],
};
applyCommonSettings(ms);

const dbConf = devConf.db;
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
applyCommonSettings(db);

const migrate = {
  image: 'migrate/migrate',
  profiles: ['oth'],
  volumes: [`../migrations:${conAppDir}/migrations`],
  entrypoint: [
    'migrate',
    '-path',
    `${conAppDir}/migrations`,
    '-database',
    'mysql://qing_dev:qing_dev_pwd@tcp(db:3306)/qing_dev?multiStatements=true',
  ],
  depends_on: [sDB],
};

const img_proxy = {
  image: 'h2non/imaginary',
  ports: ['9000:9000'],
  command: '-enable-url-source',
  volumes: [volumeAppData],
};
applyCommonSettings(img_proxy);

const services = {
  [sServer]: server,
  [sMS]: ms,
  [sDB]: db,
  [sMigrate]: migrate,
  [sImgProxy]: img_proxy,
};

const config = {
  version: '3.9',
  services,
};

export default config;
