import React from 'react';
import process from 'node:process';
import { Command } from 'commander';
import { render } from 'ink';
import UI from './app';
import getPackage from './utils/getPackage';

const program = new Command();
program.version('0.0.1');

program.option('-d, --debug', 'Output more logs');

const options = program.opts();

program
  .argument(
    '<package-dir>',
    'Package directory to watch. Separate multiple by comma.'
  )
  .argument(
    '[dist]',
    'Project directory where packages will be copied',
    process.cwd()
  )
  .action(async (packageDir: string, projectDir: string) => {
    const packageDirs = packageDir.split(',');
    const packages = await Promise.all(packageDirs.map(getPackage));
    const project = await getPackage(projectDir);
    render(<UI packages={packages} project={project} options={options} />);
  });

program.parse();
