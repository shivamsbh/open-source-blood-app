# Blood Bank Management System (MERN)

A full‑stack application to manage blood bank operations connecting Donors, Hospitals, and Organisations with Admin oversight. Built with MongoDB, Express, React, and Node.

## Contents
- Overview
- Architecture & Tech
- Environment & Setup
- Running (Dev/Prod) and Seeding
- Data Model & Relationships
- Role‑based End‑to‑End Flows
- REST API Overview (key endpoints)
- Frontend Structure & Navigation
- Security & Best Practices
- Troubleshooting
- Contributing / License

## Overview
This system enables:
- Organisations to manage inventory, connect with donors and hospitals, and track flows.
- Donors to subscribe to organisations and view their capacity/donation info.
- Hospitals to discover organisations, subscribe to them, and receive inventory.
- Admins to manage users and audit system data.

## Architecture & Tech
- Frontend: React 18, React Router 6, Redux Toolkit, Axios, Moment
- Backend: Node, Express, Mongoose, JWT, bcryptjs, CORS, Morgan
- Database: MongoDB (Mongoose ODM)
- Auth: JWT in Authorization: Bearer <token>

Directory layout
```
.
├── backend/
│   ├── config/              # Mongo connection (db.js)
│   ├── controllers/         # Business logic for routes
│   ├── middlewares/         # authMiddleware, role middlewares
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express routers
│   ├── seeders/             # seed.js (unified seeder) + README
│   └── server.js            # Express app entry
└── client/
    ├── public/
    └── src/                 # Components, pages, redux, services
```

## Environment & Setup
Create .env files.

Backend (.env in backend/):
```
PORT=8080
DEV_MODE=development
MONGO_URL=mongodb://localhost:27017/lifeflow
JWT_SECRET=your_jwt_secret_key
```

Frontend (.env in client/):
```
REACT_APP_BASEURL=http://localhost:8080/api/v1
```

Install dependencies:
```
cd backend && npm install
cd ../client && npm install
```

## Running and Seeding
Dev (runs server + client concurrently from backend):
```
cd backend
npm run dev
```

Seed database (clears all and inserts comprehensive dummy data):
```
cd backend
npm run seed   # also available as seed:all / seed:clear
```
Seeder: backend/seeders/seed.js
- Clears collections: users, subscriptions, donations, donorcapacities, inventories
- Inserts:
  - 10 admins: admin1@bloodbank.com … admin10@bloodbank.com
  - 10 donors (named, with blood groups)
  - 10 hospitals
  - 10 organisations: org1@bloodbank.org … org10@bloodbank.org
  - Donor capacities (1 per donor)
  - Subscriptions (donors↔organisations, hospitals→organisations, organisations→hospitals)
  - Donations (1–3 per donor subscription)
  - Inventory: 50 inbound (in), 30 outbound (out)
- Password for ALL users: 1password2

## Data Model & Relationships
Models (backend/models):
- User: { role: admin|organisation|donor|hospital, name|organisationName|hospitalName, email, password, address, phone, website?, bloodGroup?, dateOfBirth? }
- Inventory: { inventoryType: in|out, bloodGroup, quantity, email, organisation, donor?, hospital?, createdAt }
- Subscription: { donor, organisation, status, subscribedAt, notificationPreferences? }
  - Design note: we reuse the same schema to represent different directions:
    - donor(userId: donor) → organisation(userId: organisation)
    - hospital(userId: hospital) → organisation(userId: organisation)
    - organisation(userId: organisation) → hospital(userId: hospital)
- Donation: { donor, organisation, subscription, bloodGroup, quantity, donationType, donationDate, status, notes, screening }
- DonorCapacity: { donor, bloodGroup, totalCapacity, availableCapacity, lastDonationDate, nextEligibleDate, donationFrequency, isActive, healthStatus, restrictions, notes }

Relationships:
- User(donor) —1:1→ DonorCapacity
- User(donor|hospital|organisation) —N:1→ Subscription —1:N→ User(organisation|hospital)
- Donation references: donor + organisation + subscription
- Inventory in: donor → organisation; Inventory out: organisation → hospital

## Role‑based End‑to‑End Flows

Donor
- Register/Login → Auth token issued
- Subscribe to organisations:
  - GET /subscription/available-organisations
  - POST /subscription/subscribe { organisationId }
  - GET /subscription/my-subscriptions
  - POST /subscription/unsubscribe { organisationId }
- View capacity and history (DonorCapacity, Donations)

Hospital
- Register/Login
- Discover organisations and subscriptions:
  - GET /inventory/get-organisation-for-hospital
    - Returns organisations from: inventory links, hospital→org subscriptions, org→hospital subscriptions; falls back to all organisations if none
  - GET /subscription/available-organisations (now role‑aware; works for hospitals too)
  - POST /subscription/subscribe { organisationId }
  - GET /subscription/my-subscriptions (returns orgs a hospital is subscribed to)
- Receive inventory (out transactions are created by an organisation to a hospital)

Organisation
- Register/Login
- Inventory management:
  - POST /inventory/create-inventory (in: from donor, out: to hospital)
  - GET /inventory/get-inventory, /get-filtered-inventory, /get-recent-inventory
- Network management:
  - Donors: GET /inventory/get-donors
  - Hospitals: GET /inventory/get-hospitals (union of inventory links, org→hospital subs, hospital→org subs; fallback to all hospitals)
  - Subscribers:
    - GET /subscription/my-subscribers (donors subscribed to this organisation)
    - GET /subscription/hospital-subscribers (hospitals subscribed to this organisation)
  - Organisation→Hospital subscriptions:
    - GET /subscription/available-hospitals
    - POST /subscription/subscribe-hospital { hospitalId }
    - GET /subscription/my-hospital-subscriptions
    - POST /subscription/unsubscribe-hospital { hospitalId }

Admin
- View and manage lists:
  - Donors: /admin/donor-list
  - Hospitals: /admin/hospital-list
  - Organisations: /admin/org-list

## REST API Overview (Key Endpoints)
Base URL: http://localhost:8080/api/v1
All protected routes require Authorization: Bearer <JWT>.

Auth
- POST /auth/register
- POST /auth/login
- GET  /auth/current-user

Inventory
- POST /inventory/create-inventory
- GET  /inventory/get-inventory (org)
- GET  /inventory/get-filtered-inventory (org)
- GET  /inventory/get-recent-inventory (org)
- GET  /inventory/get-donors (org)
- GET  /inventory/get-hospitals (org; union + fallback)
- GET  /inventory/get-organisation (donor; from inventory)
- GET  /inventory/get-organisation-for-hospital (hospital; union + fallback)

Subscriptions (Donor/Hospital → Organisation)
- POST /subscription/subscribe { organisationId }
- POST /subscription/unsubscribe { organisationId }
- GET  /subscription/my-subscriptions
- GET  /subscription/available-organisations
- GET  /subscription/my-subscribers (org, donors)
- GET  /subscription/hospital-subscribers (org, hospitals)
- GET  /subscription/check-status?organisationId=...

Org → Hospital Subscriptions
- GET  /subscription/available-hospitals
- POST /subscription/subscribe-hospital { hospitalId }
- POST /subscription/unsubscribe-hospital { hospitalId }
- GET  /subscription/my-hospital-subscriptions
- GET  /subscription/organisation-subscribers (hospital; orgs subscribed to it)

Donor Capacity & Donations
- Capacity: routes under /capacity (see backend)
- Donations: routes under /donation (create/list/query donations)

## Frontend Structure & Navigation
Key pages:
- HomePage (role‑aware quick links)
- OrganisationHome / HospitalHome / DonorHome / AdminHome
- OrganisationSubscription: unified UI for managing subscriptions to organisations (works for donors and hospitals)
- OrganisationPage: for hospitals/donors to view organisations connected to them
- Hospitals: organisations can view hospitals connected/subscribable
- Inventory views: list, filtered, recent

Set REACT_APP_BASEURL to point to backend’s /api/v1.

## Security & Best Practices
- JWT stored client‑side; sent via Authorization header.
- Passwords hashed with bcryptjs.
- Role guards on routes where applicable (via middlewares and frontend checks).
- Mongoose validation for schema integrity.

## Troubleshooting
- Available organisations empty (for hospitals):
  - Ensure you’re logged in (valid JWT present) and that OrganisationSubscription page is accessible to hospitals (it now loads for any authenticated user).
  - Check Network tab for GET /subscription/available-organisations; response should be success:true with organisations array.
  - Verify REACT_APP_BASEURL and backend is running.
- Hospitals page empty: GET /inventory/get-hospitals now returns union of relationships with fallback to all hospitals; if still empty, verify seed ran and check server logs.
- Auth 401: ensure JWT_SECRET set in backend .env and client is sending Authorization header.

## Contributing / License
PRs welcome. Licensed under ISC.

Made with care to help save lives.
