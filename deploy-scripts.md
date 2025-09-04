# 🚀 Quick Deploy Scripts

## 📋 Pre-Deployment Checklist

```bash
# 1. Test local build
cd client && npm run build
cd ../backend && npm start

# 2. Check environment files
cat client/.env.production
cat backend/.env.production

# 3. Verify MongoDB Atlas connection
# - IP Whitelist: 0.0.0.0/0 (allow all)
# - Database user created
# - Connection string ready
```

## 🔧 **RENDER DEPLOYMENT**

### **Quick Deploy Commands:**
```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for production deployment"
git push origin main

# 2. Create Render service (via dashboard or CLI)
# Use the provided render.yaml file

# 3. Set environment variables in Render dashboard:
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/bloodbank
JWT_SECRET=your_super_secure_jwt_secret_key
NODE_ENV=production
DEV_MODE=production
PORT=10000
FRONTEND_URL=https://your-app.vercel.app
```

### **Render Environment Variables:**
```bash
# Copy these to Render dashboard:
NODE_ENV=production
PORT=10000
DEV_MODE=production
MONGO_URL=mongodb+srv://sbhshivam:manishbc@shivamproject.4bhzh1t.mongodb.net/?retryWrites=true&w=majority&appName=shivamproject
JWT_SECRET=bloodbank_super_secret_jwt_key_2024_secure
FRONTEND_URL=https://your-vercel-app.vercel.app
```

## ⚡ **VERCEL DEPLOYMENT**

### **Method 1: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: bloodbank-frontend
# - In which directory is your code located? ./client
# - Want to override settings? Y
# - Build Command: npm run build
# - Output Directory: build
# - Development Command: npm start

# Set environment variable
vercel env add REACT_APP_BASEURL production
# Enter: https://bloodbank-backend.onrender.com/api/v1

# Deploy to production
vercel --prod
```

### **Method 2: GitHub Integration**
```bash
# 1. Push code to GitHub
git add .
git commit -m "Ready for Vercel deployment"
git push origin main

# 2. Go to vercel.com
# 3. Import GitHub repository
# 4. Configure:
#    - Framework: React
#    - Root Directory: client
#    - Build Command: npm run build
#    - Output Directory: build
# 5. Add environment variable:
#    REACT_APP_BASEURL = https://bloodbank-backend.onrender.com/api/v1
# 6. Deploy
```

### **Method 3: Using vercel.json**
```bash
# The vercel.json file is already configured
# Just push to GitHub and import in Vercel dashboard
# Update the backend URL in vercel.json first:

# Edit vercel.json:
{
  "env": {
    "REACT_APP_BASEURL": "https://your-actual-backend-url.onrender.com/api/v1"
  }
}
```

## 🌐 **NETLIFY DEPLOYMENT (Alternative)**

### **Deploy to Netlify:**
```bash
# 1. Build the frontend
cd client
npm run build

# 2. Drag and drop the build folder to netlify.com
# OR use Netlify CLI:

npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=client/build

# 3. Set environment variable in Netlify dashboard:
REACT_APP_BASEURL = https://bloodbank-backend.onrender.com/api/v1
```

## 🔗 **UPDATE CORS AFTER DEPLOYMENT**

```bash
# After getting your frontend URL, update backend CORS:
# 1. Update backend/server.js (already done)
# 2. Set FRONTEND_URL in Render:
FRONTEND_URL=https://your-actual-vercel-app.vercel.app

# 3. Redeploy backend on Render
```

## 🌱 **SEED PRODUCTION DATABASE**

```bash
# Option 1: Manual seeding via API call
curl -X POST https://bloodbank-backend.onrender.com/api/v1/seed

# Option 2: Add seed endpoint (create this route)
# GET https://bloodbank-backend.onrender.com/api/v1/admin/seed

# Option 3: Run seed script on Render (if you add it)
# In Render dashboard, go to Shell and run:
npm run seed
```

## 📊 **MONITORING & TESTING**

### **Test Deployment:**
```bash
# 1. Test backend API
curl https://bloodbank-backend.onrender.com/api/v1/test

# 2. Test frontend
open https://your-app.vercel.app

# 3. Test full flow:
# - Register new user
# - Login
# - Create donation
# - Check inventory
```

### **Monitor Logs:**
```bash
# Render logs: Check in Render dashboard
# Vercel logs: Check in Vercel dashboard
# Or use CLI:
vercel logs
```

## 🚨 **TROUBLESHOOTING COMMANDS**

### **Common Fixes:**
```bash
# 1. Clear Vercel cache
vercel --prod --force

# 2. Rebuild on Render
# Go to Render dashboard → Manual Deploy

# 3. Check environment variables
# Render: Dashboard → Environment
# Vercel: Dashboard → Settings → Environment Variables

# 4. Test CORS locally
curl -H "Origin: https://your-app.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://bloodbank-backend.onrender.com/api/v1/test
```

## 📝 **DEPLOYMENT TIMELINE**

### **Estimated Time:**
- **Backend (Render)**: 5-10 minutes
- **Frontend (Vercel)**: 2-5 minutes
- **DNS Propagation**: 5-15 minutes
- **Testing**: 10-15 minutes
- **Total**: 30-45 minutes

### **Order of Operations:**
1. ✅ Deploy Backend to Render first
2. ✅ Get backend URL
3. ✅ Update frontend environment variables
4. ✅ Deploy Frontend to Vercel
5. ✅ Update CORS with frontend URL
6. ✅ Test complete flow
7. ✅ Seed database

## 🎯 **FINAL CHECKLIST**

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Environment variables set correctly
- [ ] CORS configured with actual URLs
- [ ] Database seeded
- [ ] All API endpoints working
- [ ] Frontend can communicate with backend
- [ ] User registration/login working
- [ ] SSL certificates active (https)

**Your Blood Bank Management System is now live! 🩸🚀**