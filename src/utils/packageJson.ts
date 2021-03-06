import path from 'node:path';
import { existsSync } from 'node:fs';
import { promises as fs } from 'node:fs';
import { PackageJson } from '../types';

const packageJson = async (dir: string): Promise<PackageJson> => {
  const packageJsonPath = path.join(dir, 'package.json');

  if (!existsSync(packageJsonPath)) {
    throw new Error(`Failed to get package.json for ${dir}`);
  }

  const packageJson = await fs.readFile(packageJsonPath, 'utf8');
  return JSON.parse(packageJson);
};

export default packageJson;
