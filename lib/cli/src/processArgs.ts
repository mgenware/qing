/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

export interface ProcessArgsResult {
  list: string[];
  stringMap: Record<string, string>;
  boolMap: Set<string>;
}

export default function processArgs(args: string[]) {
  const list: string[] = [];
  const stringMap: Record<string, string> = {};
  const boolMap = new Set<string>();

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    if (arg.startsWith('--')) {
      const name = arg.slice(2);
      if (i + 1 < args.length && !args[i + 1]!.startsWith('--')) {
        stringMap[name] = args[i + 1]!;
        i++;
      } else {
        boolMap.add(name);
      }
    } else {
      list.push(arg);
    }
  }

  return { list, stringMap, boolMap };
}
