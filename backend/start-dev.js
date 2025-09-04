const mongoose = require('mongoose');
const { spawn } = require('child_process');
const connectDB = require('./config/db');
const userModel = require('./models/userModel');

async function startDevelopment() {
  try {
    console.log('🚀 Starting Blood Bank Development Server...');
    
    // Connect to database
    await connectDB();
    
    // Check if database is empty (no users)
    const userCount = await userModel.countDocuments();
    
    if (userCount === 0) {
      console.log('📊 Database is empty, running seed script...');
      
      // Run seed script
      const seedProcess = spawn('node', ['seeders/seed.js'], {
        stdio: 'inherit',
        cwd: __dirname
      });
      
      await new Promise((resolve, reject) => {
        seedProcess.on('close', (code) => {
          if (code === 0) {
            console.log('✅ Database seeded successfully!');
            resolve();
          } else {
            reject(new Error(`Seed process exited with code ${code}`));
          }
        });
      });
    } else {
      console.log(`📊 Database already has ${userCount} users, skipping seed.`);
    }
    
    // Start the main server
    console.log('🌐 Starting Express server...');
    require('./server.js');
    
  } catch (error) {
    console.error('❌ Startup failed:', error);
    process.exit(1);
  }
}

startDevelopment();