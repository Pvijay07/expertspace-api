const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: [3, 200],
        notEmpty: true,
      },
    },
    slug: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    subcategory: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 2000],
        notEmpty: true,
      },
    },
    images: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error('Images must be an array');
          }
        },
      },
    },
    base_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
        isDecimal: true,
      },
    },
    pricing_type: {
      type: DataTypes.ENUM('fixed', 'hourly', 'sqft', 'per_item'),
      defaultValue: 'fixed',
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Duration in minutes',
      validate: {
        min: 15,
      },
    },
    features: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    requirements: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    rating_average: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.00,
      validate: {
        min: 0,
        max: 5,
      },
    },
    rating_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    booking_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    tableName: 'services',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: (service) => {
        if (!service.slug) {
          service.slug = service.name
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        }
      },
      beforeUpdate: (service) => {
        if (service.changed('name')) {
          service.slug = service.name
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        }
      },
    },
  });

  // Associations
  Service.associate = (models) => {
    Service.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
    Service.belongsToMany(models.ServiceProvider, {
      through: 'service_provider_services',
      foreignKey: 'service_id',
      otherKey: 'provider_id',
      as: 'providers',
    });
    Service.hasMany(models.Booking, {
      foreignKey: 'service_id',
      as: 'bookings',
    });
    Service.hasMany(models.Review, {
      foreignKey: 'service_id',
      as: 'reviews',
    });
    Service.hasMany(models.CartItem, {
      foreignKey: 'service_id',
      as: 'cart_items',
    });
  };

  // Class methods
  Service.findBySlug = async function(slug) {
    return await this.findOne({ where: { slug } });
  };

  Service.incrementView = async function(serviceId) {
    return await this.increment('view_count', { where: { id: serviceId } });
  };

  return Service;
};