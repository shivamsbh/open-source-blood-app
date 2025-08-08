const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const userModel = require("../models/userModel");
const inventoryModel = require("../models/inventoryModel");
const subscriptionModel = require("../models/subscriptionModel");
const donorCapacityModel = require("../models/donorCapacityModel");
const donationModel = require("../models/donationModel");
require("dotenv").config();

// -----------------------------
// Config
// -----------------------------
const COMMON_PASSWORD = "1password2"; // Single password for all dummy users
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const DONATION_TYPES = ["whole_blood", "plasma", "platelets", "red_cells"];

// -----------------------------
// Helpers
// -----------------------------
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomPastDate = (days) => {
  const now = Date.now();
  const past = now - getRandomNumber(1, days) * 24 * 60 * 60 * 1000;
  return new Date(past);
};

const hashPassword = async (plain) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

// -----------------------------
// Sample Data Generators
// -----------------------------
const generateAdmins = () =>
  Array.from({ length: 10 }).map((_, i) => ({
    role: "admin",
    name: [
      "John Administrator",
      "Sarah Manager",
      "Michael Supervisor",
      "Emily Director",
      "David Chief",
      "Lisa Coordinator",
      "Robert Head",
      "Jennifer Lead",
      "William Boss",
      "Amanda Master",
    ][i],
    email: `admin${i + 1}@bloodbank.com`,
    password: COMMON_PASSWORD,
    address: `${100 + i} Admin Street, Admin City, AC 100${i}`,
    phone: `+1-555-10${(i + 1).toString().padStart(2, "0")}`,
  }));

const generateDonors = () => [
  {
    role: "donor",
    name: "John Smith",
    email: "john.smith@email.com",
    password: COMMON_PASSWORD,
    phone: "+1-555-2001",
    address: "123 Oak Street, Downtown, City 12345",
    bloodGroup: "A+",
    dateOfBirth: new Date("1990-05-15"),
  },
  {
    role: "donor",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    password: COMMON_PASSWORD,
    phone: "+1-555-2002",
    address: "456 Pine Avenue, Suburb, City 12346",
    bloodGroup: "O+",
    dateOfBirth: new Date("1985-08-22"),
  },
  {
    role: "donor",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    password: COMMON_PASSWORD,
    phone: "+1-555-2003",
    address: "789 Maple Drive, Eastside, City 12347",
    bloodGroup: "B+",
    dateOfBirth: new Date("1992-12-03"),
  },
  {
    role: "donor",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    password: COMMON_PASSWORD,
    phone: "+1-555-2004",
    address: "321 Elm Street, Westside, City 12348",
    bloodGroup: "AB+",
    dateOfBirth: new Date("1988-03-17"),
  },
  {
    role: "donor",
    name: "David Wilson",
    email: "david.wilson@email.com",
    password: COMMON_PASSWORD,
    phone: "+1-555-2005",
    address: "654 Cedar Lane, Northside, City 12349",
    bloodGroup: "A-",
    dateOfBirth: new Date("1995-07-09"),
  },
  {
    role: "donor",
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    password: COMMON_PASSWORD,
    phone: "+1-555-2006",
    address: "987 Birch Road, Southside, City 12350",
    bloodGroup: "O-",
    dateOfBirth: new Date("1991-11-28"),
  },
  {
    role: "donor",
    name: "James Taylor",
    email: "james.taylor@email.com",
    password: COMMON_PASSWORD,
    phone: "+1-555-2007",
    address: "147 Spruce Court, Central, City 12351",
    bloodGroup: "B-",
    dateOfBirth: new Date("1987-04-14"),
  },
  {
    role: "donor",
    name: "Jennifer Martinez",
    email: "jennifer.martinez@email.com",
    password: COMMON_PASSWORD,
    phone: "+1-555-2008",
    address: "258 Willow Way, Heights, City 12352",
    bloodGroup: "AB-",
    dateOfBirth: new Date("1993-09-06"),
  },
  {
    role: "donor",
    name: "Robert Garcia",
    email: "robert.garcia@email.com",
    password: COMMON_PASSWORD,
    phone: "+1-555-2009",
    address: "369 Poplar Place, Valley, City 12353",
    bloodGroup: "A+",
    dateOfBirth: new Date("1989-01-25"),
  },
  {
    role: "donor",
    name: "Amanda Rodriguez",
    email: "amanda.rodriguez@email.com",
    password: COMMON_PASSWORD,
    phone: "+1-555-2010",
    address: "741 Ash Avenue, Riverside, City 12354",
    bloodGroup: "O+",
    dateOfBirth: new Date("1994-06-12"),
  },
];

const generateHospitals = () =>
  Array.from({ length: 10 }).map((_, i) => ({
    role: "hospital",
    hospitalName: [
      "City General Hospital",
      "St. Mary's Medical Center",
      "Metro Emergency Hospital",
      "Children's Healthcare Center",
      "Regional Medical Complex",
      "University Hospital",
      "Heart & Vascular Institute",
      "Cancer Treatment Center",
      "Trauma & Emergency Care",
      "Women's Health Hospital",
    ][i],
    email: [
      "admin@citygeneral.com",
      "contact@stmarys.org",
      "emergency@metrohospital.com",
      "info@childrenshealthcare.org",
      "admin@regionalmedical.com",
      "contact@universityhospital.edu",
      "info@heartvascular.org",
      "support@cancercenter.org",
      "trauma@emergencycare.com",
      "contact@womenshealth.org",
    ][i],
    password: COMMON_PASSWORD,
    address: `${100 + i} Medical Ave, Health District, City 12${360 + i}`,
    phone: `+1-555-30${(i + 1).toString().padStart(2, "0")}`,
    website: [
      "https://citygeneral.com",
      "https://stmarys.org",
      "https://metrohospital.com",
      "https://childrenshealthcare.org",
      "https://regionalmedical.com",
      "https://universityhospital.edu",
      "https://heartvascular.org",
      "https://cancercenter.org",
      "https://emergencycare.com",
      "https://womenshealth.org",
    ][i],
  }));

const generateOrganisations = () =>
  Array.from({ length: 10 }).map((_, i) => ({
    role: "organisation",
    organisationName: [
      "Red Cross Blood Bank",
      "Community Blood Services",
      "Metro Blood Bank Network",
      "LifeSaver Blood Foundation",
      "Regional Blood Center",
      "Blood Donors United",
      "Hope Blood Bank",
      "Central Blood Repository",
      "Emergency Blood Supply",
      "National Blood Alliance",
    ][i],
    email: `org${i + 1}@bloodbank.org`,
    password: COMMON_PASSWORD,
    address: `${200 + i} Organisation Blvd, Org City, OC 12${345 + i}`,
    phone: `+1-555-40${(i + 1).toString().padStart(2, "0")}`,
    website: [
      "https://redcrossblood.org",
      "https://communityblood.org",
      "https://metrobloodbank.com",
      "https://lifesaverblood.org",
      "https://regionalblood.org",
      "https://blooddonorsunited.org",
      "https://hopebloodbank.org",
      "https://centralblood.org",
      "https://emergencyblood.org",
      "https://nationalbloodalliance.org",
    ][i],
  }));

// -----------------------------
// Main Seeder
// -----------------------------
const seed = async () => {
  try {
    console.log("\n🚀 Starting unified database seeding...");
    await connectDB();

    // 1) Clear DB
    console.log("🗑️  Clearing existing collections...");
    await Promise.all([
      inventoryModel.deleteMany({}),
      subscriptionModel.deleteMany({}),
      donorCapacityModel.deleteMany({}),
      donationModel.deleteMany({}),
      userModel.deleteMany({}),
    ]);
    console.log("✅ Collections cleared");

    // 2) Create users
    console.log("👥 Creating users (admins, donors, hospitals, organisations)...");
    const admins = generateAdmins();
    const donors = generateDonors();
    const hospitals = generateHospitals();
    const organisations = generateOrganisations();

    const allUsersPlain = [...admins, ...donors, ...hospitals, ...organisations];
    const allUsersHashed = await Promise.all(
      allUsersPlain.map(async (u) => ({ ...u, password: await hashPassword(u.password) }))
    );

    const createdUsers = await userModel.insertMany(allUsersHashed);
    console.log(`✅ Created ${createdUsers.length} users`);

    const createdDonors = createdUsers.filter((u) => u.role === "donor");
    const createdHospitals = createdUsers.filter((u) => u.role === "hospital");
    const createdOrganisations = createdUsers.filter((u) => u.role === "organisation");

    // 3) Donor capacities
    console.log("🩸 Creating donor capacities...");
    const capacities = createdDonors.map((donor) => {
      const total = getRandomNumber(400, 500);
      const donated = getRandomNumber(0, 200);
      const lastDonationDate = donated > 0 ? getRandomPastDate(120) : null;
      let nextEligibleDate = null;
      if (lastDonationDate) {
        nextEligibleDate = new Date(lastDonationDate);
        nextEligibleDate.setMonth(nextEligibleDate.getMonth() + 3);
      }
      return {
        donor: donor._id,
        bloodGroup: donor.bloodGroup || getRandomElement(BLOOD_GROUPS),
        totalCapacity: total,
        availableCapacity: Math.max(0, total - donated),
        lastDonationDate,
        nextEligibleDate,
        donationFrequency: getRandomElement(["monthly", "quarterly", "biannual", "annual"]),
        isActive: true,
        healthStatus: getRandomElement(["excellent", "good", "fair"]),
        restrictions: [],
        notes: `Sample capacity for ${donor.name}`,
      };
    });
    await donorCapacityModel.insertMany(capacities);
    console.log(`✅ Created ${capacities.length} donor capacities`);

    // 4) Subscriptions (donors -> orgs)
    console.log("🔗 Creating subscriptions (donors & hospitals -> organisations)...");
    const subscriptions = [];

    // Donor subscriptions (2-4 orgs each)
    for (const donor of createdDonors) {
      const num = getRandomNumber(2, 4);
      const shuffled = [...createdOrganisations].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, num);
      for (const org of selected) {
        subscriptions.push({
          donor: donor._id,
          organisation: org._id,
          status: "active",
          subscribedAt: getRandomPastDate(240),
          notificationPreferences: {
            emailNotifications: Math.random() > 0.2,
            urgentRequests: Math.random() > 0.2,
            monthlyUpdates: Math.random() > 0.5,
          },
        });
      }
    }

    // Hospital "subscriptions" to orgs (1-2 each)
    for (const hospital of createdHospitals) {
      const num = getRandomNumber(1, 2);
      const shuffled = [...createdOrganisations].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, num);
      for (const org of selected) {
        subscriptions.push({
          donor: hospital._id, // stored in donor field by design of schema/routes
          organisation: org._id,
          status: "active",
          subscribedAt: getRandomPastDate(365),
          notificationPreferences: {
            emailNotifications: true,
            urgentRequests: true,
            monthlyUpdates: true,
          },
        });
      }
    }

    const createdSubscriptions = await subscriptionModel.insertMany(subscriptions);
    console.log(`✅ Created ${createdSubscriptions.length} subscriptions`);

    // 5) Donations from donor subscriptions (1-3 each)
    console.log("🧾 Creating donations from active donor subscriptions...");
    const donorSubs = createdSubscriptions.filter((s) => {
      const subDonor = createdDonors.find((d) => d._id.toString() === s.donor.toString());
      return !!subDonor;
    });

    const donations = donorSubs.flatMap((s) => {
      const donor = createdDonors.find((d) => d._id.toString() === s.donor.toString());
      const num = getRandomNumber(1, 3);
      return Array.from({ length: num }).map((_, i) => ({
        donor: s.donor,
        organisation: s.organisation,
        subscription: s._id,
        bloodGroup: donor?.bloodGroup || getRandomElement(BLOOD_GROUPS),
        quantity: getRandomNumber(250, 500),
        donationType: getRandomElement(DONATION_TYPES),
        donationDate: getRandomPastDate(120),
        status: "completed",
        notes: `Seeded donation #${i + 1} from ${donor?.name}`,
        screening: {
          hemoglobin: parseFloat((Math.random() * 4 + 12).toFixed(1)),
          bloodPressure: {
            systolic: getRandomNumber(110, 140),
            diastolic: getRandomNumber(70, 90),
          },
          temperature: parseFloat((Math.random() * 1 + 36.5).toFixed(1)),
          weight: getRandomNumber(55, 90),
        },
      }));
    });

    await donationModel.insertMany(donations);
    console.log(`✅ Created ${donations.length} donations`);

    // 6) Inventory records (independent of donations feature)
    console.log("📦 Creating inventory records (in/out)...");
    const inventory = [];

    // in (donations to org)
    for (let i = 0; i < 50; i++) {
      const donor = getRandomElement(createdDonors);
      const organisation = getRandomElement(createdOrganisations);
      inventory.push({
        inventoryType: "in",
        bloodGroup: getRandomElement(BLOOD_GROUPS),
        quantity: getRandomNumber(250, 500),
        email: donor.email,
        organisation: organisation._id,
        donor: donor._id,
        createdAt: getRandomPastDate(200),
      });
    }

    // out (distributions to hospitals)
    for (let i = 0; i < 30; i++) {
      const hospital = getRandomElement(createdHospitals);
      const organisation = getRandomElement(createdOrganisations);
      inventory.push({
        inventoryType: "out",
        bloodGroup: getRandomElement(BLOOD_GROUPS),
        quantity: getRandomNumber(150, 400),
        email: hospital.email,
        organisation: organisation._id,
        hospital: hospital._id,
        createdAt: getRandomPastDate(120),
      });
    }

    await inventoryModel.insertMany(inventory);
    console.log(`✅ Created ${inventory.length} inventory records`);

    // Summary
    console.log("\n🎉 Seeding complete! Summary:");
    console.log(`- Users: ${createdUsers.length} (10 admins, 10 donors, 10 hospitals, 10 organisations)`);
    console.log(`- Donor capacities: ${capacities.length}`);
    console.log(`- Subscriptions: ${createdSubscriptions.length}`);
    console.log(`- Donations: ${donations.length}`);
    console.log(`- Inventory records: ${inventory.length}`);
    console.log("\n🔐 Login password for ALL users:", COMMON_PASSWORD);
    console.log("📧 Sample emails:");
    console.log("  Admin:", admins[0].email);
    console.log("  Donor:", donors[0].email);
    console.log("  Hospital:", hospitals[0].email);
    console.log("  Organisation:", organisations[0].email);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

if (require.main === module) {
  seed();
}

module.exports = { seed };
