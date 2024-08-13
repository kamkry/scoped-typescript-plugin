import path from 'path';
import { getPosixFilePath } from './utils';
import { getAbsolutePath } from './getAbsolutePath';
import { getProjectPathFromArgs } from './utils';

interface IsFileOnPathParams {
  filePath: string;
  targetPath: string;
  projectPath?: string;
}

export function isFileOnPath({
  filePath,
  targetPath,
  projectPath = getProjectPathFromArgs() ?? process.cwd(),
}: IsFileOnPathParams): boolean {
  if (!projectPath) {
    return false;
  }

  const absolutePathToStrictFiles = getAbsolutePath(projectPath, targetPath);

  const posixFilePath = getPosixFilePath(filePath);
  const posixStrictPath = getPosixFilePath(absolutePathToStrictFiles);
  return (
    posixFilePath === posixStrictPath || posixFilePath.startsWith(posixStrictPath + path.posix.sep)
  );
}
