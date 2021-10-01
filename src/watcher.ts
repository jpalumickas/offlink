import path from 'node:path';
import chokidar from 'chokidar';
import cpFile from 'cp-file';
import del from 'del';
import { Package } from './types';

type Options = {
  package: Package;
  project: Package;
  followSymlinks?: boolean;
  ignoreInitial?: boolean;
}

const chokidarWatcher = ({ package: pkg, project, followSymlinks = true, ignoreInitial = false }: Options) => {
  const peerDependencies = pkg.packageJson.peerDependencies
    ? Object.keys(pkg.packageJson.peerDependencies)
    : [];
  const peerDependenciesDirs = peerDependencies.map(
    (dep) => `${pkg.dir}/node_modules/${dep}`
  );

  const watchDir = `${pkg.dir}/**/*.*`;
  const watcher = chokidar.watch(watchDir, {
    ignoreInitial,
    followSymlinks,
    ignored: [`${pkg.dir}/.git`].concat(peerDependenciesDirs),
    persistent: true,
  });

  const projectNodeModuleDir = path.resolve(
    path.join(project.dir, 'node_modules', pkg.name)
  );

  if (!ignoreInitial) {
    del.sync(path.join(projectNodeModuleDir, '**'), { force: true });
  }

  watcher
    .on('add', async (filePath) => {
      const distName = filePath.replace(`${pkg.dir}/`, '');
      const distPath = path.join(projectNodeModuleDir, distName);
      await cpFile(filePath, distPath);
    })
    .on('change', async (filePath) => {
      // console.log(`File ${filePath} has been changed`);
      const distName = filePath.replace(`${pkg.dir}/`, '');
      const distPath = path.join(projectNodeModuleDir, distName);
      await cpFile(filePath, distPath);
    })
    .on('unlink', async (filePath) => {
      // console.log(`File ${filePath} has been removed`);
      const distName = filePath.replace(`${pkg.dir}/`, '');
      const distPath = path.join(projectNodeModuleDir, distName);
      await del(distPath, { force: true });
    })

  return watcher;
};

export default chokidarWatcher;
