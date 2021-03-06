const path = require('path');

module.exports = shipit => {
  // Load shipit-deploy tasks
  require('shipit-deploy')(shipit)

  shipit.initConfig({
    default: {
      workspace: './dist',
      deployTo: '/home/ubuntu/api',
      ignores: ['.git', 'node_modules'],
      key: '~/.ssh/guesswithme-aws.pem',
    },
    // Set custom Variables
    production: {
      servers: 'ubuntu@ec2-18-188-243-232.us-east-2.compute.amazonaws.com',
      build : 'tsc'
    }
  });


  shipit.task('default', () => {
    return shipit.local(shipit.config.build)
  });


  shipit.task('sync', ['default'], async () => {
    shipit.log('Build:Finished');
    const releaseTimestamp = +new Date();
    const targetDir = `${shipit.config.deployTo}/${releaseTimestamp}`

    // Making a directory for the new release
    await shipit.remote(`mkdir ${targetDir}`);

    // Copying new relase files
    await shipit.copyToRemote(path.resolve('./dist/*'), targetDir+'/src');

    // Copy package.json
    await shipit.copyToRemote(path.resolve('./') + '/package.json', targetDir);

    // Copy tsconfig.json
    await shipit.copyToRemote(path.resolve('./') + '/tsconfig.json', targetDir);

    // Copy ecosystem.prod.json
    await shipit.copyToRemote(path.resolve('./') + '/ecosystem.prod.js', targetDir);

    await shipit.remote(`npm install`, {
      cwd: targetDir
    });

    // Removing old symlink (current)
    await shipit.remote(`rm -rf ${shipit.config.deployTo}/current`);

    // Create a symlink to the new release
    await shipit.remote(`ln -s ${targetDir}/ ${shipit.config.deployTo}/current`);

    await shipit.remote(`pm2 delete all`, { cwd: targetDir });

    // return shipit.remote(`pm2 start ecosystem.prod.js`, { cwd: targetDir });
    return shipit.remote(`NODE_ENV=production pm2 start index.js --node-args="-r tsconfig-paths/register"`, { cwd: `${targetDir}/src` });
  });


  shipit.task('cleanup', ['sync'], async () => {
    // Getting the amount of versions + 1
    const versionCount = await shipit.remote(`find ${shipit.config.deployTo} -maxdepth 1 -type d | wc -l`);

    if (Number(versionCount[0]['stdout']) > 5) {
      await shipit.remote(`rm -R ${shipit.config.deployTo}/$(ls -lt ${shipit.config.deployTo} | grep '^d' | tail -1  | tr " " "\n" | tail -1)`);
    }
  });

  shipit.start('default', 'sync', 'cleanup');
}
