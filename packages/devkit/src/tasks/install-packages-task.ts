import { Tree } from '@nrwl/tao/src/shared/tree';
import { detectPackageManager } from '@nrwl/tao/src/shared/detect-package-manager';
import { execSync } from 'child_process';

let storedPackageJsonValue;
export function installPackagesTask(host: Tree, alwaysRun: boolean = false) {
  const packageJsonValue = host.read('package.json').toString();
  if (host.listChanges().find((f) => f.path === 'package.json')) {
    if (storedPackageJsonValue != packageJsonValue || alwaysRun) {
      storedPackageJsonValue = host.read('package.json').toString();
      execSync(`${detectPackageManager()} install`, {
        cwd: host.root,
        stdio: [0, 1, 2],
      });
    }
  }
}
