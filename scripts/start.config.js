module.exports = {
  apps: [
    {
      name: 'xyra-bot',
      script: 'index.js',
      node_args: '-r esm',

      exec_mode: 'cluster',
      max_memory_restart: '1G',

      instances: 1,
      autorestart: true,
      wait_ready: true,
    },
  ],
};
