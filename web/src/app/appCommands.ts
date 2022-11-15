/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { appdef } from '@qing/def';

export enum AppCommands {
  newEntity,
}

type Runner = (arg: unknown) => void;

const runners = new Map<AppCommands, Runner>();

function runCommand(cmd: AppCommands, arg: unknown) {
  const runner = runners.get(cmd);
  if (!runner) {
    throw new Error(`Unknown command ${cmd}`);
  }
  runner(arg);
}

export function runNewEntityCommand(entityType: appdef.ContentBaseType, forumID: string | null) {
  runCommand(AppCommands.newEntity, [entityType, forumID ?? '']);
}

export function setCommand(cmd: AppCommands, runner: Runner) {
  const prev = runners.get(cmd);
  if (prev) {
    throw new Error(`Command ${cmd} has been set`);
  }
  runners.set(cmd, runner);
}
