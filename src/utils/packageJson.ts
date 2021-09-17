import path from 'node:path';
import { existsSync } from 'node:fs';
import { promises as fs } from 'node:fs';

const packageJson = async (projectDir: string) => {
  const packageJsonPath = path.join(projectDir, 'package.json');

  if (!existsSync(packageJsonPath)) {
    console.log(`Warning: Missing package.json in ${projectDir}.`);
    return;
  }

  const packageJson = await fs.readFile(packageJsonPath, 'utf8');
  return JSON.parse(packageJson);
}

export default packageJson;
