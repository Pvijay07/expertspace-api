const { Sequelize } = require('sequelize');
const logger = require('../lib/logger');

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'mysql',
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 10,
      min: parseInt(process.env.DB_POOL_MIN) || 0,
      acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
      idle: parseInt(process.env.DB_POOL_IDLE) || 10000
    },
    logging: (msg) => logger.debug(msg),
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true, // Soft deletes
      deletedAt: 'deleted_at'
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('MySQL database connected successfully');

    // Sync models (use with caution in production)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('Database synchronized');
    }

  } catch (error) {
    logger.error(`MySQL connection failed: ${error.message}`);
    process.exit(1);
  }
};

// Handle connection events
sequelize
  .authenticate()
  .then(() => {
    logger.info('Connection to MySQL has been established successfully.');
  })
  .catch(err => {
    logger.error('Unable to connect to the MySQL database:', err);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await sequelize.close();
    logger.info('MySQL connection closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error closing MySQL connection:', error);
    process.exit(1);
  }
});

module.exports = { sequelize, connectDB };