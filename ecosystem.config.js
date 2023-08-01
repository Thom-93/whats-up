module.exports = {
  apps: [
    {
      name: "Whats-up",
      script: "./bin/www",
      instances: "max",
      autorestart: true,
      watch: false,
      ignore_watch: ["*.log"],
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
