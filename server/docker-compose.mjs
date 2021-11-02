/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import devConf from '../userland/dev.json';

// App dir in containers.
const conAppDir = '/qing';
// App data dir in containers.
const conAppDataDir = '/qing_data';
// App tmp dir in containers.
const conAppTmpDir = '/qing_tmp';

const sServer = 'server';
const sDB = 'db';
const sMS = 'ms';
const sMigrate = 'migrate';
const sImgProxy = 'img_proxy';

const server = {
  build: '.',
  volumes: [
    `.:${conAppDir}/server`,
    `../web:${conAppDir}/web`,
    `../userland:${conAppDir}/userland`,
    `../qing_tmp:${conAppTmpDir}`,
  ],
  ports: ['8000:8000'],
  depends_on: [sMS, sDB, sImgProxy],
};

const ms = {
  image: 'redis:6',
  ports: ['6379:6379'],
};

const db = {
  image: 'mariadb:10.6',
  ports: ['3306:3306'],
};

const services = {
  [sServer]: server,
  [sMS]: ms,
  [sDB]: db,
};

const config = {
  version: '3.9',
  services,
};

export default config;
