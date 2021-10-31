export type PackageJson = {
  name?: string;
  peerDependencies?: {
    [pkgName: string]: string
  }
}

export type Package = {
  dir: string;
  name: string;
  packageJson: PackageJson;
}
