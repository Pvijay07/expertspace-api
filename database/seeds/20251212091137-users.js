module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create categories
    const categories = await queryInterface.bulkInsert(
      'categories',
      [
        {
          name: 'Home Cleaning',
          slug: 'home-cleaning',
          description: 'Professional home cleaning services',
          icon: 'broom',
          is_active: true,
          display_order: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Plumbing',
          slug: 'plumbing',
          description: 'Expert plumbing services',
          icon: 'pipe',
          is_active: true,
          display_order: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Electrical',
          slug: 'electrical',
          description: 'Electrical repair and installation',
          icon: 'lightbulb',
          is_active: true,
          display_order: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Beauty & Salon',
          slug: 'beauty-salon',
          description: 'Beauty and salon services',
          icon: 'scissors',
          is_active: true,
          display_order: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { returning: true }
    );

    // Create admin user
    const bcrypt = require('bcryptjs');
    const adminPassword = await bcrypt.hash('admin123', 10);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin User',
        email: 'admin@servicebooking.com',
        phone: '9999999999',
        password: adminPassword,
        role: 'admin',
        is_verified: true,
        is_active: true,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'John Customer',
        email: 'customer@servicebooking.com',
        phone: '8888888888',
        password: adminPassword,
        role: 'customer',
        is_verified: true,
        is_active: true,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Jane Provider',
        email: 'provider@servicebooking.com',
        phone: '7777777777',
        password: adminPassword,
        role: 'provider',
        is_verified: true,
        is_active: true,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Create services
    await queryInterface.bulkInsert('services', [
      {
        name: 'Full Home Deep Cleaning',
        slug: 'full-home-deep-cleaning',
        category_id: categories[0].id,
        description: 'Complete deep cleaning of entire home including kitchen, bathrooms, bedrooms',
        images: JSON.stringify([
          'https://example.com/cleaning1.jpg',
          'https://example.com/cleaning2.jpg',
        ]),
        base_price: 2999.0,
        pricing_type: 'fixed',
        duration: 240,
        features: JSON.stringify([
          'Kitchen deep cleaning',
          'Bathroom sanitization',
          'Floor cleaning',
          'Dusting and wiping',
        ]),
        requirements: JSON.stringify([
          'Clear the areas',
          'Provide water connection',
          'Keep pets secured',
        ]),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Pipe Leak Repair',
        slug: 'pipe-leak-repair',
        category_id: categories[1].id,
        description: 'Professional pipe leak detection and repair service',
        images: JSON.stringify(['https://example.com/plumbing1.jpg']),
        base_price: 1500.0,
        pricing_type: 'fixed',
        duration: 120,
        features: JSON.stringify(['Leak detection', 'Pipe repair', 'Water testing', 'Cleanup']),
        requirements: JSON.stringify(['Access to water main', 'Clear work area']),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('services', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  },
};
