import React, { useState, useEffect, FC } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { Package } from '../types';
import Watcher from '../watcher';

type Options = {
  debug?: boolean;
};

type PackageProps = {
  package: Package;
  project: Package;
  options: Options;
};

type Props = {
  packages: Package[];
  project: Package;
  options: Options;
};

const Package: FC<PackageProps> = ({ package: pkg, project, options }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const watcher = Watcher({
      package: pkg,
      project,
      ...options,
    });

    watcher.on('ready', () => {
      setLoading(false);
    });

    return () => { watcher.close() };

  }, []);
  return <Text>{pkg.name} {loading ? <Text color="blue"><Spinner /></Text> : ''}</Text>;
};

const UI: FC<Props> = ({ packages, project, options }) => {
  return (
    <Box flexDirection="column">
      <Text>Watching packages for <Text color="blue">{project.name}</Text></Text>
      {packages.map((pkg) => (
        <Package
          key={pkg.dir}
          package={pkg}
          project={project}
          options={options}
        />
      ))}
    </Box>
  );
};

export default UI;
