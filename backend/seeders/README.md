# Unified Database Seeder (Complete Data Reference)

This project uses a single, unified seeder that clears MongoDB and populates it with realistic dummy data across all features.

- Seeder entrypoint: `backend/seeders/seed.js`
- Run from `backend/`:
  - `npm run seed` (also aliased as `npm run seed:all`, `npm run seed:clear`)
- Requires `.env` with `MONGO_URL`

Example `.env`:
```
MONGO_URL=mongodb://localhost:27017/lifeflow
DEV_MODE=development
PORT=8080
```

## What the seeder does
1) Connects to MongoDB.
2) Clears collections: `users`, `subscriptions`, `donorcapacities`, `donations`, `inventories`.
3) Inserts complete, consistent data for all app features.
4) Prints a summary with sample credentials.

Password for ALL seeded users: `1password2`

---

## Collections and Data Seeded

The following collections are created/populated. Field descriptions are based on the Mongoose models in `backend/models/`.

### 1) users
Model: `User` (`backend/models/userModel.js`)

Common fields:
- role: "admin" | "donor" | "hospital" | "organisation"
- email (unique), password (hashed), address, phone
- name (for admin/donor), hospitalName (for hospital), organisationName (for organisation)
- Optional: website (hospitals/organisations), bloodGroup (donors), dateOfBirth (donors)

Seeded counts: 40
- 10 admins
- 10 donors
- 10 hospitals
- 10 organisations

Admins (email):
- admin1@bloodbank.com
- admin2@bloodbank.com
- admin3@bloodbank.com
- admin4@bloodbank.com
- admin5@bloodbank.com
- admin6@bloodbank.com
- admin7@bloodbank.com
- admin8@bloodbank.com
- admin9@bloodbank.com
- admin10@bloodbank.com

Donors (name • email • bloodGroup):
- John Smith • john.smith@email.com • A+
- Sarah Johnson • sarah.johnson@email.com • O+
- Michael Brown • michael.brown@email.com • B+
- Emily Davis • emily.davis@email.com • AB+
- David Wilson • david.wilson@email.com • A-
- Lisa Anderson • lisa.anderson@email.com • O-
- James Taylor • james.taylor@email.com • B-
- Jennifer Martinez • jennifer.martinez@email.com • AB-
- Robert Garcia • robert.garcia@email.com • A+
- Amanda Rodriguez • amanda.rodriguez@email.com • O+

Hospitals (name • email):
- City General Hospital • admin@citygeneral.com
- St. Mary's Medical Center • contact@stmarys.org
- Metro Emergency Hospital • emergency@metrohospital.com
- Children's Healthcare Center • info@childrenshealthcare.org
- Regional Medical Complex • admin@regionalmedical.com
- University Hospital • contact@universityhospital.edu
- Heart & Vascular Institute • info@heartvascular.org
- Cancer Treatment Center • support@cancercenter.org
- Trauma & Emergency Care • trauma@emergencycare.com
- Women's Health Hospital • contact@womenshealth.org

Organisations (name • email):
- Red Cross Blood Bank • org1@bloodbank.org
- Community Blood Services • org2@bloodbank.org
- Metro Blood Bank Network • org3@bloodbank.org
- LifeSaver Blood Foundation • org4@bloodbank.org
- Regional Blood Center • org5@bloodbank.org
- Blood Donors United • org6@bloodbank.org
- Hope Blood Bank • org7@bloodbank.org
- Central Blood Repository • org8@bloodbank.org
- Emergency Blood Supply • org9@bloodbank.org
- National Blood Alliance • org10@bloodbank.org

Login password for all above: `1password2`

---

### 2) donorcapacities
Model: `DonorCapacity` (`backend/models/donorCapacityModel.js`)

Fields:
- donor (ref User, unique)
- bloodGroup (A+/A-/B+/B-/AB+/AB-/O+/O-)
- totalCapacity (ml), availableCapacity (ml)
- lastDonationDate, nextEligibleDate
- donationFrequency: monthly | quarterly | biannual | annual
- isActive, healthStatus, restrictions[], notes

Seeded counts: 10 (one per donor)
- Values are realistic and randomized (e.g., total 400–500ml, next eligible ~3 months after last donation)

---

### 3) subscriptions
Model: `Subscription` (`backend/models/subscriptionModel.js`)

Fields:
- donor (ref User)
- organisation (ref User)
- status: active | inactive | pending (default: active)
- subscribedAt (Date)
- notificationPreferences: { emailNotifications, urgentRequests, monthlyUpdates }

Seeded pattern:
- Donors: each subscribes to 2–4 random organisations (active)
- Hospitals: each subscribes to 1–2 organisations (active)
  - Note: hospital subscribers are stored in the `donor` field by schema design

Expected counts: ~ (10 donors × 2–4) + (10 hospitals × 1–2) = 30–60 total subscriptions
- Exact number varies due to randomness

---

### 4) donations
Model: `Donation` (`backend/models/donationModel.js`)

Fields:
- donor (ref User), organisation (ref User), subscription (ref Subscription)
- bloodGroup
- quantity (100–500 ml)
- donationType: whole_blood | plasma | platelets | red_cells
- donationDate, status (completed | pending | cancelled)
- notes, screening (hemoglobin, bloodPressure, temperature, weight)

Seeded pattern:
- 1–3 donations created for each donor subscription (only subscriptions where `donor.role === 'donor'`)

Expected counts: roughly 20–90
- Exact number varies due to randomness

---

### 5) inventories
Model: `Inventory` (`backend/models/inventoryModel.js`)

Fields:
- inventoryType: "in" | "out"
- bloodGroup, quantity, email (contact email)
- organisation (ref User)
- donor (ref User, required when inventoryType === "in")
- hospital (ref User, required when inventoryType === "out")

Seeded counts: 80 total
- 50 inbound ("in"): from random donors to random organisations
- 30 outbound ("out"): from random organisations to random hospitals

---

## Relationships
- User (donor) —1:1→ DonorCapacity (unique per donor)
- User (donor/hospital) —N:1→ Subscription —1:N→ User (organisation)
- Donation references: donor, organisation, and the specific Subscription
- Inventory "in": links donor→organisation; Inventory "out": links organisation→hospital

---

## How to Run the Seeder
From the `backend` directory:
```
npm install
npm run seed
```
You should see console output summarizing counts and sample credentials.

---

## Verification and Inspection
Quick counts (Node one-liner):
```
node -e "require('dotenv').config(); const connect=require('./config/db'); const User=require('./models/userModel'); const Sub=require('./models/subscriptionModel'); const Inv=require('./models/inventoryModel'); const DonCap=require('./models/donorCapacityModel'); const Don=require('./models/donationModel'); (async()=>{await connect(); const [admins, donors, hospitals, orgs, subs, invs, caps, dons]=await Promise.all([User.countDocuments({role:'admin'}),User.countDocuments({role:'donor'}),User.countDocuments({role:'hospital'}),User.countDocuments({role:'organisation'}),Sub.countDocuments(),Inv.countDocuments(),DonCap.countDocuments(),Don.countDocuments()]); console.log({admins, donors, hospitals, orgs, subscriptions:subs, inventory:invs, donorCapacities:caps, donations:dons}); process.exit(0)})().catch(e=>{console.error(e);process.exit(1)})"
```

Sample lookups (Node one-liner):
- First organisation’s subscribers (donors):
```
node -e "require('dotenv').config(); const connect=require('./config/db'); const User=require('./models/userModel'); const Sub=require('./models/subscriptionModel'); (async()=>{await connect(); const org=await User.findOne({role:'organisation'}); const subs=await Sub.find({organisation:org._id,status:'active'}).populate('donor','role name email hospitalName'); console.log(org.organisationName, subs.length, 'subs'); console.log(subs.slice(0,5)); process.exit(0)})()"
```
- Recent donations:
```
node -e "require('dotenv').config(); const connect=require('./config/db'); const Don=require('./models/donationModel'); (async()=>{await connect(); const d=await Don.find({}).sort({donationDate:-1}).limit(5).lean(); console.log(d); process.exit(0)})()"
```

---

## Notes
- The seeder is deterministic in structure but uses randomness for distribution and dates, so exact counts of subscriptions/donations vary per run.
- Rerunning the seeder resets the database (it clears collections first).
- If you need partial seeding (e.g., only organisations) or a super-admin with a custom password via env, this can be added easily.
