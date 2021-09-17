import path from 'node:path';
import chokidar from 'chokidar';
import cpFile from 'cp-file';
import packageJson from './utils/packageJson';

const projectDir = './test';

const watchDir = async (node_module_dir: string) => {
  const dir = path.resolve(node_module_dir);
  const pkg = await packageJson(dir);
  if (!pkg) return;
  const peerDependencies = pkg.peerDependencies
    ? Object.keys(pkg.peerDependencies)
    : [];
  const peerDependenciesDirs = peerDependencies.map(
    (dep) => `${dir}/node_modules/${dep}`
  );

  const watchDir = `${dir}/**/*.*`;
  const watcher = chokidar.watch(watchDir, {
    ignoreInitial: false,
    followSymlinks: true,
    ignored: [`${dir}/.git`].concat(peerDependenciesDirs),
    persistent: true,
  });

  const projectNodeModuleDir = path.resolve(
    path.join(projectDir, 'node_modules', pkg.name)
  );
  console.log(projectNodeModuleDir);

  watcher
    .on('add', async (filePath) => {
      const distName = filePath.replace(`${dir}/`, '');
      await cpFile(filePath, path.join(projectNodeModuleDir, distName));
    })
    .on('change', async (filePath) => {
      console.log(`File ${filePath} has been changed`);
      const distName = filePath.replace(`${dir}/`, '');
      await cpFile(filePath, path.join(projectNodeModuleDir, distName));
    })
    .on('unlink', (filePath) => {
      console.log(`File ${filePath} has been removed`);
    })
    .on('ready', () => console.log(`Listening for changes in ${pkg.name}`));
};

watchDir('../urge/theme');
