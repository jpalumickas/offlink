import path from 'node:path';
import getPackageJson from './packageJson';
import { Package } from '../types';

const getPackage = async (packageDir: string): Promise<Package> => {
  const dir = path.resolve(packageDir);
  const folderName = dir.split(path.sep).pop()
  const packageJson = await getPackageJson(dir);

  if (!folderName) {
    throw new Error('Failed to get folder name.')
  }

  return {
    dir,
    name: packageJson.name || folderName,
    packageJson,
  }
}

export default getPackage;
