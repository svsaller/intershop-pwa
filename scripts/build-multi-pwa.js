const cp = require('child_process');
const fs = require('fs');

const configurations = (process.env.npm_config_active_themes || process.env.npm_package_config_active_themes)
  .split(',')
  .map((theme, index) => ({ theme, port: 4000 + index }));

const builds = [];

if (process.argv.length === 2 || process.argv[2] === 'client')
  builds.push(
    ...configurations.map(
      ({ theme }) =>
        `build client --configuration=${theme},production -- --output-path=dist/${theme}/browser --progress=false`
    )
  );

if (process.argv.length === 2 || process.argv[2] === 'server')
  builds.push(
    ...configurations.map(
      ({ theme }) =>
        `build server --configuration=${theme},production -- --output-path=dist/${theme}/server --progress=false`
    )
  );

const cores = require('os').cpus().length / 3 || 2;
cp.execSync(`npx npm-run-all ngcc --max-parallel ${cores} --parallel ${builds.map(b => `"${b}"`).join(' ')}`, {
  stdio: 'inherit',
});

fs.writeFileSync(
  'dist/ecosystem.yml',
  `
apps:
  - script: dist/server.js
    name: distributor
    instances: max
    exec_mode: cluster
    time: true
` +
    configurations
      .map(
        config => `
  - script: dist/${config.theme}/server/main.js
    name: ${config.theme}
    instances: 2
    exec_mode: cluster
    time: true
    env:
      BROWSER_FOLDER: dist/${config.theme}/browser
      PORT: ${config.port}
`
      )
      .join('')
);

fs.writeFileSync(
  'dist/ecosystem-ports.js',
  `exports.ports = {
${configurations.map(config => `    '${config.theme}': ${config.port},`).join('\n')}
}
`
);
