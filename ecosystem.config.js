module.exports = {
    apps : [{
      name: 'VPNP-Stali',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
    }],
  }