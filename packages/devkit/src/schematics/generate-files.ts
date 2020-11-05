import * as path from 'path';
import * as fs from 'fs';
import { Tree } from '@nrwl/tao/src/shared/tree';

const ejs = require('ejs');

export function generateFiles(
  srcFolder: string,
  target: string,
  substitutions: { [k: string]: any }
) {
  return (host: Tree) => {
    allFilesInDir(srcFolder).forEach((f) => {
      const relativeToTarget = replaceSegmentsInPath(
        f.substring(srcFolder.length),
        substitutions
      );
      const newContent = ejs.render(
        fs.readFileSync(f).toString(),
        substitutions
      );
      host.write(path.join(target, relativeToTarget), newContent);
    });
  };
}

function replaceSegmentsInPath(
  filePath: string,
  substitutions: { [k: string]: any }
) {
  Object.entries(substitutions).forEach(([t, r]) => {
    filePath = filePath.replace(`__${t}__`, r);
  });
  return filePath;
}

function allFilesInDir(parent: string) {
  let res = [];
  try {
    fs.readdirSync(parent).forEach((c) => {
      const child = path.join(parent, c);
      try {
        const s = fs.statSync(child);
        if (!s.isDirectory()) {
          res.push(child);
        } else if (s.isDirectory()) {
          res = [...res, ...allFilesInDir(child)];
        }
      } catch (e) {}
    });
  } catch (e) {}
  return res;
}
