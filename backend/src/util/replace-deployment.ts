import { fileOrFolderExistsSync } from './file-exists-sync';
import { runCommandSync } from './run-command-sync';

export const replaceDeployment = (
  dirToDeploy: string,
  deploymentDir: string,
) => {
  // move to the location
  const tempFolderName = `${deploymentDir}${new Date().getTime()}`;
  runCommandSync(`mv ${dirToDeploy} ${tempFolderName}`); // replace with new build

  // rename the exising folder
  let folderExistedBefore = false;
  const tempFolderName2 = `${deploymentDir}${new Date().getTime()}2`;
  if (fileOrFolderExistsSync(deploymentDir)) {
    runCommandSync(`mv ${deploymentDir} ${tempFolderName2}`); // rename the existing folder
    folderExistedBefore = true;
  }

  // rename the durrent folder
  runCommandSync(`mv ${tempFolderName} ${deploymentDir}`); // rename the existing folder

  if (folderExistedBefore) {
    // remove the old folder
    runCommandSync(`rm -rf ${tempFolderName2}`); // delete the old build
  }
};
