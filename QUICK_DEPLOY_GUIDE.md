# 🚀 Quick GitHub + Vercel Deployment

## 📋 **Since Git isn't installed, here's the manual process:**

### **Step 1: Install Git (Required)**
1. **Download Git**: [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. **Install Git**: Run the installer with default settings
3. **Restart Command Prompt** or PowerShell
4. **Verify installation**: Open new terminal and run `git --version`

### **Step 2: Create GitHub Repository**
1. **Go to GitHub**: [https://github.com](https://github.com)
2. **Click "New repository"**
3. **Fill details**:
   - Repository name: `ethiopia-tourism-website`
   - Description: `Ethiopia 361° Tourism Website`
   - Public: ✅ (or Private if preferred)
4. **Click "Create repository"**

### **Step 3: Upload Files to GitHub**
1. **On your new repository page**, click "uploading an existing file"
2. **Drag and drop** all files from your project folder:
   - `server.js` (or `server-mongodb.js` for MongoDB)
   - `package.json`
   - `vercel.json`
   - `models/` folder (if using MongoDB)
   - `views/` folder
   - `public/` folder
   - `README.md`
   - `.gitignore`
3. **Add commit message**: "Initial commit - Ethiopia 361° Tourism Website"
4. **Click "Commit changes"**

### **Step 4: Deploy to Vercel**
1. **Go to Vercel**: [https://vercel.com](https://vercel.com)
2. **Login with GitHub**
3. **Click "New Project"**
4. **Select GitHub repository**: `ethiopia-tourism-website`
5. **Configure deployment**:
   - Framework: "Other" (Vercel auto-detects Node.js)
   - Root Directory: "./"
   - Build Command: `npm install`
   - Output Directory: "public"
6. **Add Environment Variables** (if using MongoDB):
   - Go to Environment Variables tab
   - Name: `MONGODB_URI`
   - Value: Your MongoDB connection string
7. **Click "Deploy"**

### **Step 5: Your Website Goes Live! 🎉**

**Your site will be available at:**
`https://ethiopia-tourism-website-[your-username].vercel.app`

## 🔧 **Choose Your Server Version**

### **Option A: SQLite Version (Easiest)**
- **Use files**: `server.js`, `package.json`, `vercel.json` (current)
- **Database**: In-memory (resets on each deployment)
- **Pros**: Quick setup, no external services needed
- **Cons**: Data doesn't persist between deployments

### **Option B: MongoDB Version (Recommended)**
- **Use files**: `server-mongodb.js`, `models/database.js`, updated `package.json`
- **Database**: MongoDB Atlas (persistent data)
- **Pros**: Full admin functionality, data persistence
- **Cons**: Requires MongoDB Atlas setup (5 extra minutes)

## 📱 **What Gets Deployed**

### ✅ **Live Features on Vercel**
- 🌐 **Responsive Design** - Mobile hamburger menu
- 🎬 **Video Background** - Hero section with your video
- 🖼️ **Photo Galleries** - Multi-image with lightbox
- 🤖 **AI Chat Assistant** - Tourism information
- 🌍 **Multi-Language** - English/Amharic support
- 📱 **Mobile Menu** - Row-style dropdown
- 🎨 **Modern UI** - Clean, professional design

### ⚠️ **Vercel Limitations**
- **File Uploads**: Limited on serverless functions
- **Database**: In-memory unless MongoDB configured
- **Admin Panel**: Limited without persistent database

## 🎯 **Quick Start Checklist**

### **For Immediate Deployment (SQLite):**
- [ ] Install Git from git-scm.com
- [ ] Create GitHub repository
- [ ] Upload all project files
- [ ] Deploy to Vercel
- [ ] Test website functionality

### **For Full Functionality (MongoDB):**
- [ ] Install Git from git-scm.com
- [ ] Create MongoDB Atlas account
- [ ] Get MongoDB connection string
- [ ] Create GitHub repository
- [ ] Upload MongoDB version files
- [ ] Add MONGODB_URI to Vercel
- [ ] Deploy to Vercel
- [ ] Test admin panel functionality

## 🌐 **Alternative: GitHub Desktop**

If command line is difficult:

1. **Download GitHub Desktop**: [https://desktop.github.com](https://desktop.github.com)
2. **Install and login**
3. **Create new repository**
4. **Drag your project folder** into GitHub Desktop
5. **Commit and push**
6. **Deploy to Vercel** (same as above)

## 📞 **Need Help?**

### **Common Issues:**
- **Git not found**: Install from git-scm.com
- **Deployment fails**: Check file structure
- **Database errors**: Add environment variables
- **404 errors**: Check vercel.json routes

### **Support:**
- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)
- **GitHub Docs**: [https://docs.github.com](https://docs.github.com)
- **MongoDB Atlas**: [https://docs.mongodb.com/manual/atlas](https://docs.mongodb.com/manual/atlas)

## 🎉 **Success!**

After completing these steps:
- ✅ **Website live** on Vercel
- ✅ **Global CDN** for fast loading
- ✅ **Automatic HTTPS** security
- ✅ **Continuous deployment** ready

**Your Ethiopia 361° tourism website will be accessible worldwide!**

🇪🇹 **Share Ethiopia's beauty with the world!** ✨
