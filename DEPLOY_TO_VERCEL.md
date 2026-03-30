# 🚀 Deploy Ethiopia 361° to Vercel via GitHub

## 📋 **Step-by-Step Deployment Guide**

### **Step 1: Prepare Your Local Repository**

First, let's make sure all files are ready:

```bash
# Check your current directory
cd "c:\Users\natil\Downloads\jules_session_12101324484193057985\ethiopia-tourism-website"

# Install MongoDB dependency
npm install

# Test locally first (optional)
npm start
```

### **Step 2: Initialize Git Repository**

```bash
# Initialize git repository
git init

# Add all files
git add .

# Make initial commit
git commit -m "Ethiopia 361° Tourism Website - MongoDB Version"

# Create main branch
git branch -M main
```

### **Step 3: Create GitHub Repository**

1. **Go to GitHub**: [https://github.com](https://github.com)
2. **Click "New repository"**
3. **Repository name**: `ethiopia-tourism-website`
4. **Description**: Ethiopia 361° Tourism Website
5. **Visibility**: Public (or Private if you prefer)
6. **Click "Create repository"**

### **Step 4: Connect Local to GitHub**

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/ethiopia-tourism-website.git

# Replace YOUR_USERNAME with your actual GitHub username
# Example:
# git remote add origin https://github.com/johndoe/ethiopia-tourism-website.git

# Push to GitHub
git push -u origin main
```

### **Step 5: Deploy to Vercel**

1. **Go to Vercel**: [https://vercel.com](https://vercel.com)
2. **Login** with your GitHub account
3. **Click "New Project"**
4. **Import Git Repository**:
   - Select "GitHub"
   - Find `ethiopia-tourism-website`
   - Click "Import"
5. **Configure Project**:
   - Framework: "Other" (Vercel will detect Node.js)
   - Root Directory: "./"
   - Build Command: "npm install"
   - Output Directory: "public"
6. **Add Environment Variables**:
   - Go to "Environment Variables" tab
   - Add: `MONGODB_URI` (if using MongoDB)
   - Value: Your MongoDB connection string
7. **Click "Deploy"**

### **Step 6: Setup MongoDB (Optional but Recommended)**

If you want persistent data, follow the `MONGODB_SETUP.md` guide:

1. **Create MongoDB Atlas account**: [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Get connection string** from Atlas dashboard
3. **Add to Vercel**: In project settings → Environment Variables
4. **Variable name**: `MONGODB_URI`
5. **Value**: Your MongoDB connection string

### **Step 7: Verify Deployment**

After deployment, your site will be available at:
- **URL**: `https://ethiopia-tourism-website-yourusername.vercel.app`
- **HTTPS**: Automatic SSL certificate included
- **Global CDN**: Fast loading worldwide

## 🔧 **Configuration Files Ready**

### **vercel.json** - Optimized for Vercel
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server-mongodb.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server-mongodb.js"
    }
  ]
}
```

### **package.json** - Updated scripts
```json
{
  "scripts": {
    "start": "node server-mongodb.js",
    "dev": "node server-mongodb.js",
    "build": "echo 'Build complete'"
  }
}
```

## 🎯 **Two Deployment Options**

### **Option A: SQLite Version (Quick)**
- **Server**: `server.js` (original)
- **Database**: In-memory (resets on deployment)
- **Setup**: Deploy immediately
- **Limitations**: No persistent data

### **Option B: MongoDB Version (Recommended)**
- **Server**: `server-mongodb.js` (new)
- **Database**: MongoDB Atlas (persistent)
- **Setup**: 10 minutes extra
- **Benefits**: Full admin functionality

## 📱 **What Gets Deployed**

### ✅ **Features Working on Vercel**
- 🌐 **Responsive Design** - Mobile hamburger menu
- 🎬 **Video Background** - Hero section
- 🖼️ **Photo Galleries** - Multi-image with lightbox
- 🤖 **AI Chat Assistant** - Tourism information
- 🌍 **Multi-Language** - English/Amharic
- 📱 **Mobile Menu** - Row-style dropdown
- 🎨 **Modern UI** - Clean, professional design

### ⚠️ **Vercel Limitations**
- **File Uploads**: Limited on serverless
- **Database**: In-memory unless MongoDB configured
- **Admin Panel**: Limited without persistent database

## 🚀 **Quick Deploy Commands**

```bash
# One command to deploy (after GitHub setup)
git push origin main

# Vercel will auto-deploy on push
```

## 📞 **Troubleshooting**

### **Common Issues:**
1. **Build fails**: Check `package.json` scripts
2. **Database errors**: Verify environment variables
3. **404 errors**: Check `vercel.json` routes
4. **Static files**: Ensure `public/` directory exists

### **Get Help:**
- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)
- **GitHub Support**: Check repository settings
- **MongoDB Setup**: See `MONGODB_SETUP.md`

## 🎉 **Success!**

After following these steps:
1. ✅ **Code on GitHub** - Version controlled
2. ✅ **Deployed on Vercel** - Live website
3. ✅ **Global CDN** - Fast worldwide access
4. ✅ **Automatic HTTPS** - Secure connection
5. ✅ **Continuous Deployment** - Updates on git push

**Your Ethiopia 361° tourism website will be live at:**
`https://ethiopia-tourism-website-yourusername.vercel.app`

🇪🇹 **Ready to share Ethiopia's beauty with the world!** ✨
