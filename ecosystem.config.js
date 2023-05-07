module.exports = {
  apps: [
    {
      name: 'VPNP-Stali',
      script: 'dist/main.js',
      instances: 2,
      autorestart: true,
      watch: false,
    },
  ],
};
