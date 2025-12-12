const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define(
    'Booking',
    {
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
      booking_number: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
        comment: 'Format: BK-YYYY-MMDD-XXXX',
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'services',
          key: 'id',
        },
      },
      provider_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'addresses',
          key: 'id',
        },
      },
      schedule_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      schedule_time: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Time slot: 09:00-10:00',
      },
      preferred_time: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(
          'pending',
          'confirmed',
          'assigned',
          'ongoing',
          'completed',
          'cancelled',
          'rejected'
        ),
        defaultValue: 'pending',
      },
      base_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      addons_total: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      tax_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_status: {
        type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded', 'partial'),
        defaultValue: 'pending',
      },
      payment_method: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      payment_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      special_instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cancellation_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cancelled_by: {
        type: DataTypes.ENUM('customer', 'provider', 'system', 'admin'),
        allowNull: true,
      },
      cancellation_charge: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      provider_rating: {
        type: DataTypes.INTEGER,
        validate: { min: 1, max: 5 },
        allowNull: true,
      },
      provider_feedback: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      customer_rating: {
        type: DataTypes.INTEGER,
        validate: { min: 1, max: 5 },
        allowNull: true,
      },
      customer_feedback: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'bookings',
      timestamps: true,
      underscored: true,
      hooks: {
        beforeCreate: async (booking) => {
          if (!booking.booking_number) {
            const date = new Date();
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const random = Math.floor(1000 + Math.random() * 9000);
            booking.booking_number = `BK-${year}-${month}${day}-${random}`;
          }
        },
      },
    }
  );

  // Associations
  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: 'customer_id',
      as: 'customer',
    });
    Booking.belongsTo(models.User, {
      foreignKey: 'provider_id',
      as: 'provider',
    });
    Booking.belongsTo(models.Service, {
      foreignKey: 'service_id',
      as: 'service',
    });
    Booking.belongsTo(models.Address, {
      foreignKey: 'address_id',
      as: 'address',
    });
    Booking.hasMany(models.BookingAddon, {
      foreignKey: 'booking_id',
      as: 'addons',
    });
    Booking.hasOne(models.Review, {
      foreignKey: 'booking_id',
      as: 'review',
    });
    Booking.hasOne(models.Payment, {
      foreignKey: 'booking_id',
      as: 'payment',
    });
  };

  // Instance methods
  Booking.prototype.calculateTotal = function () {
    return (
      parseFloat(this.base_price) +
      parseFloat(this.addons_total) +
      parseFloat(this.tax_amount) -
      parseFloat(this.discount_amount)
    );
  };

  return Booking;
};
