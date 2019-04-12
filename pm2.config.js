module.exports = {
  apps: [
    {
      name: "rsshub",
      script: "lib/index.js",
      watch: 'lib',
      port: 1200,
      cwd: './',
      max_restarts: 5
    }
  ]
};
