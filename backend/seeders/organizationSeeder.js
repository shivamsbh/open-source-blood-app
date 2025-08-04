const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const connectDB = require("../config/db");
require("dotenv").config();

// Sample organizations data
const organizations = [
  {
    role: "organisation",
    organisationName: "Red Cross Blood Bank",
    email: "contact@redcrossblood.org",
    password: "password123",
    address: "123 Main Street, Downtown, City 12345",
    phone: "+1-555-0101",
    website: "https://redcrossblood.org"
  },
  {
    role: "organisation", 
    organisationName: "City General Hospital Blood Center",
    email: "bloodcenter@citygeneral.com",
    password: "password123",
    address: "456 Hospital Avenue, Medical District, City 12346",
    phone: "+1-555-0102",
    website: "https://citygeneral.com/blood-center"
  },
  {
    role: "organisation",
    organisationName: "Community Blood Services",
    email: "info@communityblood.org",
    password: "password123", 
    address: "789 Community Drive, Suburb, City 12347",
    phone: "+1-555-0103",
    website: "https://communityblood.org"
  },
  {
    role: "organisation",
    organisationName: "Metro Blood Bank Network",
    email: "support@metrobloodbank.com",
    password: "password123",
    address: "321 Metro Plaza, Business District, City 12348", 
    phone: "+1-555-0104",
    website: "https://metrobloodbank.com"
  },
  {
    role: "organisation",
    organisationName: "LifeSaver Blood Foundation",
    email: "hello@lifesaverblood.org",
    password: "password123",
    address: "654 Foundation Way, Charity District, City 12349",
    phone: "+1-555-0105",
    website: "https://lifesaverblood.org"
  }
];

const seedOrganizations = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to MongoDB for seeding...");

    // Check if organizations already exist
    const existingOrgs = await userModel.find({ role: "organisation" });
    if (existingOrgs.length > 0) {
      console.log(`Found ${existingOrgs.length} existing organizations. Skipping seeding.`);
      console.log("Existing organizations:");
      existingOrgs.forEach(org => {
        console.log(`- ${org.organisationName} (${org.email})`);
      });
      process.exit(0);
    }

    console.log("No existing organizations found. Starting seeding...");

    // Hash passwords and create organizations
    const hashedOrganizations = await Promise.all(
      organizations.map(async (org) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(org.password, salt);
        
        return {
          ...org,
          password: hashedPassword
        };
      })
    );

    // Insert organizations
    const createdOrgs = await userModel.insertMany(hashedOrganizations);
    
    console.log(`✅ Successfully created ${createdOrgs.length} organizations:`);
    createdOrgs.forEach(org => {
      console.log(`- ${org.organisationName} (${org.email})`);
    });

    console.log("\n🔐 Login credentials for all organizations:");
    console.log("Password: password123");
    console.log("\n📧 Organization emails:");
    organizations.forEach(org => {
      console.log(`- ${org.organisationName}: ${org.email}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding organizations:", error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedOrganizations();
}

module.exports = { seedOrganizations, organizations };