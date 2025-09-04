# 🚀 Deployment Guide: Blood Bank Management System

## 📋 Overview

This guide covers deploying the MERN Blood Bank app to:
- **Render**: Backend API + Database
- **Vercel**: Frontend React App

## 🎯 Deployment Strategy

### **Architecture:**
```
Frontend (Vercel) → Backend API (Render) → MongoDB Atlas
```

---

## 🔧 **RENDER DEPLOYMENT (Backend + Database)**

### **Step 1: Prepare Backend**

1. **Update package.json** (already done):
   ```json
   {
     "scripts": {
       "start": "node server.js"  // Production script
     },
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

2. **Environment Variables Needed:**
   ```env
   NODE_ENV=production
   PORT=10000
   MONGO_URL=your_mongodb_atlas_url
   JWT_SECRET=your_super_secret_key
   DEV_MODE=production
   ```

### **Step 2: Deploy to Render**

#### **Option A: Using render.yaml (Blueprint)**
1. **Push code to GitHub**
2. **Connect Render to GitHub repo**
3. **Use the provided `render.yaml`** (already created)
4. **Deploy automatically**

#### **Option B: Manual Setup**
1. **Create New Web Service**:
   - **Name**: `bloodbank-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

2. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/bloodbank
   JWT_SECRET=bloodbank_super_secret_jwt_key_2024_secure
   DEV_MODE=production
   ```

3. **Deploy and Get URL**: `https://bloodbank-backend.onrender.com`

### **Step 3: Database Options**

#### **Option A: MongoDB Atlas (Recommended)**
- Use existing Atlas connection
- Update `MONGO_URL` in Render environment variables
- **Pros**: Managed, reliable, free tier available

#### **Option B: Render PostgreSQL**
- Would require changing from MongoDB to PostgreSQL
- **Not recommended** for this project (major code changes needed)

---

## ⚡ **VERCEL DEPLOYMENT (Frontend)**

### **Step 1: Prepare Frontend**

1. **Update Environment Variable**:
   ```env
   # client/.env.production
   REACT_APP_BASEURL=https://bloodbank-backend.onrender.com/api/v1
   ```

2. **Ensure Build Works**:
   ```bash
   cd client
   npm run build
   ```

### **Step 2: Deploy to Vercel**

#### **Option A: Using vercel.json (Recommended)**
1. **Use provided `vercel.json`** (already created)
2. **Update backend URL** in vercel.json:
   ```json
   {
     "env": {
       "REACT_APP_BASEURL": "https://your-actual-backend-url.onrender.com/api/v1"
     }
   }
   ```
3. **Deploy via Vercel CLI or GitHub**

#### **Option B: Vercel Dashboard**
1. **Import GitHub repo**
2. **Framework**: React
3. **Root Directory**: `client`
4. **Build Command**: `npm run build`
5. **Output Directory**: `build`
6. **Environment Variables**:
   ```
   REACT_APP_BASEURL=https://bloodbank-backend.onrender.com/api/v1
   ```

#### **Option C: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from client directory
cd client
vercel

# Set environment variables
vercel env add REACT_APP_BASEURL production
# Enter: https://bloodbank-backend.onrender.com/api/v1
```

---

## 🔗 **CONNECTING FRONTEND & BACKEND**

### **CORS Configuration**
Update `backend/server.js`:
```javascript
const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-vercel-app.vercel.app"
  ],
  credentials: true
}));
```

### **Environment Variables Summary**

#### **Render (Backend)**:
```env
NODE_ENV=production
PORT=10000
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/bloodbank
JWT_SECRET=your_jwt_secret_key
DEV_MODE=production
```

#### **Vercel (Frontend)**:
```env
REACT_APP_BASEURL=https://bloodbank-backend.onrender.com/api/v1
```

---

## 📝 **DEPLOYMENT CHECKLIST**

### **Pre-Deployment:**
- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas database ready
- [ ] Environment variables prepared
- [ ] Local build tested (`npm run build`)

### **Backend (Render):**
- [ ] Web service created
- [ ] Environment variables set
- [ ] Build successful
- [ ] API endpoints accessible
- [ ] Database connection working

### **Frontend (Vercel):**
- [ ] Project imported/deployed
- [ ] Environment variables set
- [ ] Build successful
- [ ] App loads correctly
- [ ] API calls working

### **Post-Deployment:**
- [ ] Test user registration/login
- [ ] Test API endpoints
- [ ] Seed database if needed
- [ ] Monitor logs for errors

---

## 🐛 **TROUBLESHOOTING**

### **Common Issues:**

#### **1. CORS Errors**
```javascript
// backend/server.js
app.use(cors({
  origin: ["https://your-vercel-app.vercel.app"],
  credentials: true
}));
```

#### **2. Environment Variables Not Loading**
- Check variable names (exact match)
- Restart services after adding variables
- Use Render/Vercel dashboard to verify

#### **3. Build Failures**
```bash
# Check Node version compatibility
"engines": {
  "node": ">=18.0.0"
}
```

#### **4. Database Connection Issues**
- Verify MongoDB Atlas IP whitelist (0.0.0.0/0 for all)
- Check connection string format
- Test connection locally first

#### **5. API Not Responding**
- Check Render service logs
- Verify PORT environment variable
- Test endpoints with Postman

---

## 🎉 **FINAL URLS**

After successful deployment:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://bloodbank-backend.onrender.com/api/v1`
- **Test Endpoint**: `https://bloodbank-backend.onrender.com/api/v1/test`

---

## 💡 **COST BREAKDOWN**

### **Free Tier Limits:**
- **Render**: 750 hours/month (enough for 1 service)
- **Vercel**: 100GB bandwidth, unlimited static sites
- **MongoDB Atlas**: 512MB storage

### **Scaling Options:**
- **Render Pro**: $7/month (better performance)
- **Vercel Pro**: $20/month (more bandwidth)
- **Atlas M10**: $9/month (dedicated cluster)

---

## 🔄 **CI/CD Setup**

### **Auto-Deploy on Git Push:**
1. **Render**: Auto-deploys from main branch
2. **Vercel**: Auto-deploys from main branch
3. **Environment**: Use different branches for staging/production

### **Database Seeding in Production:**
```bash
# After backend deployment, seed database
curl -X POST https://bloodbank-backend.onrender.com/api/v1/seed
```

---

**Ready to deploy! Follow the steps above and your Blood Bank Management System will be live! 🩸**