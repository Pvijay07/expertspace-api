module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First create categories table
    await queryInterface.createTable('categories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      icon: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      display_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    // Then create services table
    await queryInterface.createTable('services', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      subcategory: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      images: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: JSON.stringify([]),
      },
      base_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      pricing_type: {
        type: Sequelize.ENUM('fixed', 'hourly', 'sqft', 'per_item'),
        defaultValue: 'fixed',
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Duration in minutes',
      },
      features: {
        type: Sequelize.JSON,
        defaultValue: JSON.stringify([]),
      },
      requirements: {
        type: Sequelize.JSON,
        defaultValue: JSON.stringify([]),
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      rating_average: {
        type: Sequelize.DECIMAL(3, 2),
        defaultValue: 0.0,
      },
      rating_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      view_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      booking_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    // Create indexes for services
    await queryInterface.addIndex('services', ['slug'], { unique: true });
    await queryInterface.addIndex('services', ['category_id']);
    await queryInterface.addIndex('services', ['is_active']);
    await queryInterface.addIndex('services', ['base_price']);
    await queryInterface.addIndex('services', ['rating_average']);
    await queryInterface.addIndex('services', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('services');
    await queryInterface.dropTable('categories');
  },
};
