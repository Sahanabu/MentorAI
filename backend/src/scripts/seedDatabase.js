const mongoose = require('mongoose');
const comprehensiveSeeder = require('../seeders/comprehensiveSeeder');
require('dotenv').config();

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mentortrack';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Run comprehensive seeding
    await comprehensiveSeeder.seedAll();
    
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;