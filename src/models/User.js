const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
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
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        len: [10, 20],
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [6, 255],
        notEmpty: true,
      },
    },
    role: {
      type: DataTypes.ENUM('customer', 'provider', 'admin'),
      defaultValue: 'customer',
    },
    avatar: {
      type: DataTypes.STRING(500),
      defaultValue: 'default-avatar.png',
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    email_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    phone_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    preferences: {
      type: DataTypes.JSON,
      defaultValue: {
        notifications: {
          email: true,
          sms: true,
          push: true,
        },
        language: 'en',
        currency: 'INR',
      },
    },
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    paranoid: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  });

  // Instance methods
  User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    delete values.deleted_at;
    return values;
  };

  // Associations
  User.associate = (models) => {
    User.hasMany(models.Address, {
      foreignKey: 'user_id',
      as: 'addresses',
    });
    User.hasMany(models.Booking, {
      foreignKey: 'customer_id',
      as: 'customer_bookings',
    });
    User.hasMany(models.Booking, {
      foreignKey: 'provider_id',
      as: 'provider_bookings',
    });
    User.hasOne(models.ServiceProvider, {
      foreignKey: 'user_id',
      as: 'service_provider',
    });
    User.hasMany(models.Review, {
      foreignKey: 'customer_id',
      as: 'reviews_given',
    });
    User.hasMany(models.Review, {
      foreignKey: 'provider_id',
      as: 'reviews_received',
    });
    User.hasMany(models.Cart, {
      foreignKey: 'user_id',
      as: 'cart_items',
    });
    User.hasMany(models.Order, {
      foreignKey: 'user_id',
      as: 'orders',
    });
    User.hasMany(models.Payment, {
      foreignKey: 'user_id',
      as: 'payments',
    });
    User.hasMany(models.Notification, {
      foreignKey: 'user_id',
      as: 'notifications',
    });
  };

  return User;
};