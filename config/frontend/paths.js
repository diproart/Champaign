const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

module.exports = {
  appBuild: resolveApp('public/webpack'),
  appPublic: resolveApp('public'),
  appIndexJs: resolveApp('app/frontend/components.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('app/frontend'),
  testsSetup: resolveApp('app/frontend/setupTests.js'),
  appNodeModules: resolveApp('node_modules'),
  ownNodeModules: resolveApp('node_modules'),
};
