# Database Seeders

This directory contains scripts to populate the database with sample data for development and testing.

## Organization Seeder

Seeds the database with sample blood bank organizations.

### Usage

```bash
# From the backend directory
npm run seed:organizations
```

### What it creates

- 5 sample blood bank organizations
- Each with realistic names, addresses, and contact info
- All organizations use password: `password123`

### Sample Organizations Created

1. **Red Cross Blood Bank** - contact@redcrossblood.org
2. **City General Hospital Blood Center** - bloodcenter@citygeneral.com  
3. **Community Blood Services** - info@communityblood.org
4. **Metro Blood Bank Network** - support@metrobloodbank.com
5. **LifeSaver Blood Foundation** - hello@lifesaverblood.org

### Notes

- The seeder will skip creation if organizations already exist
- All passwords are hashed using bcrypt
- Organizations can be used immediately for testing the subscription system

### Testing the Subscription System

After seeding:
1. Register as a donor
2. Navigate to "Organisations" in the donor dashboard
3. You should see the 5 organizations available for subscription
4. Test subscribing/unsubscribing functionality