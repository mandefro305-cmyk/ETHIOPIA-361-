# 🚀 Sevalla Auto-Deployer Setup with Git

## 📋 **Git Repository Setup for Sevalla Auto-Deployer**

### **Step 1: Initialize Git Repository**

Since Git isn't installed on your system, let's create a portable Git setup:

**Option A: Install Git (Recommended)**
1. **Download Git**: [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. **Install Git** with default settings
3. **Restart Command Prompt** or PowerShell
4. **Verify installation**: `git --version`

**Option B: Use GitHub Desktop (Alternative)**
1. **Download**: [https://desktop.github.com](https://desktop.github.com)
2. **Install GitHub Desktop**
3. **Create repository locally**
4. **Push to GitHub** when ready

### **Step 2: Create GitHub Repository**

1. **Go to GitHub**: [https://github.com](https://github.com)
2. **Login** to your account
3. **Click "New repository"**
4. **Repository name**: `ethiopia-tourism-website`
5. **Description**: Ethiopia 361° Tourism Website
6. **Visibility**: Public (or Private)
7. **Click "Create repository"**

### **Step 3: Connect Local to GitHub**

**Using Git Commands:**
```bash
# Navigate to your project
cd "c:\Users\natil\Downloads\jules_session_12101324484193057985\ethiopia-tourism-website"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: Ethiopia 361° Tourism Website"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/ethiopia-tourism-website.git

# Push to GitHub
git push -u origin main
```

**Using GitHub Desktop:**
1. **Open GitHub Desktop**
2. **File** → **Add Local Repository**
3. **Select your project folder**
4. **Create repository** (or link to existing one)
5. **Publish** to GitHub

### **Step 4: Configure Sevalla Auto-Deployer**

1. **Login to Sevalla**: [Sevalla website](https://sevalla.com)
2. **Navigate** to "Auto-Deployer" or "Git Deployment"
3. **Connect your Git repository**:
   - **Repository URL**: `https://github.com/YOUR_USERNAME/ethiopia-tourism-website.git`
   - **Branch**: `main` (or `master`)
   - **Authentication**: Provide GitHub credentials if needed

### **Step 5: Configure Deployment Settings**

**In Sevalla Auto-Deployer:**
1. **Build Command**: `npm install` (or `npm run build`)
2. **Output Directory**: `public` (or `dist`)
3. **Node.js Version**: Choose latest LTS (or default)
4. **Environment Variables**: Add any needed variables
5. **Deployment Trigger**: Automatic on push

**Server Configuration:**
1. **Document Root**: Point to your main folder
2. **Startup File**: `server.js` (or `server-mongodb.js`)
3. **Port**: Usually 3000 (auto-assign)
4. **Domains**: Configure your domain(s)

### **Step 6: Deploy!**

1. **Click "Deploy Now"** in Sevalla
2. **Monitor deployment** progress
3. **Test live website**
4. **Check logs** for any errors

## 🎯 **Files Ready for Git + Sevalla**

### **Core Files:**
- ✅ `server.js` - Main server (SQLite)
- ✅ `server-mongodb.js` - MongoDB version
- ✅ `package.json` - Dependencies
- ✅ `views/` - All EJS templates
- ✅ `public/` - Static assets
- ✅ `models/database.js` - MongoDB models
- ✅ `.gitignore` - Git exclusions

### **Git Repository Structure:**
```
ethiopia-tourism-website/
├── server.js                 # Main server file
├── server-mongodb.js         # MongoDB version
├── package.json             # Dependencies
├── vercel.json              # Vercel config (backup)
├── views/                  # EJS templates
│   ├── index.ejs
│   ├── place.ejs
│   ├── admin.ejs
│   ├── edit.ejs
│   └── login.ejs
├── public/                 # Static files
│   ├── css/
│   ├── js/
│   ├── videos/
│   └── images/
├── models/                 # Database models
│   └── database.js
├── .gitignore              # Git exclusions
└── README.md               # Documentation
```

## 🔄 **Auto-Deploy Benefits**

### **✅ Advantages of Sevalla Auto-Deployer:**
- **Automatic deployments** on every Git push
- **Version control** with full Git history
- **Rollback capability** to previous versions
- **Collaboration** with team members
- **Continuous integration** with testing
- **Zero-downtime** deployments
- **Environment management** for staging/production

### **🚀 Deployment Workflow:**

**Development Process:**
1. **Make changes** locally
2. **Test features** thoroughly
3. **Commit changes** with descriptive messages
4. **Push to GitHub**
5. **Auto-deploy** to Sevalla (automatic)
6. **Monitor deployment** results

**Branch Strategy:**
- **main/master**: Production deployments
- **develop**: Staging deployments
- **feature branches**: Testing environments

## 🌐 **Your Sevalla Website**

### **✅ Features After Auto-Deploy:**
- 🎬 **Video background** with your video
- 📱 **Mobile-responsive design** with hamburger menu
- 🖼️ **Photo galleries** with 6 images per place
- 🤖 **AI chat assistant** for tourism information
- 🌍 **Multi-language support** (English/Amharic)
- 🇪🇹 **Ethiopia 361°** branding throughout
- 🔄 **Automatic updates** via Git push

### **🔧 Configuration Options:**

**Option A: SQLite Version**
- **Server file**: `server.js`
- **Database**: In-memory SQLite
- **Pros**: Simple, no external services
- **Cons**: Data resets on deployment

**Option B: MongoDB Version**
- **Server file**: `server-mongodb.js`
- **Database**: MongoDB (persistent)
- **Pros**: Full admin functionality, data persistence
- **Cons**: Requires MongoDB setup

## 📋 **Pre-Deployment Checklist**

### **Before First Deploy:**
- [ ] **Install Git** from git-scm.com
- [ ] **Create GitHub repository**
- [ ] **Initialize local Git** repository
- [ ] **Add all files** to Git
- [ ] **Make initial commit**
- [ ] **Push to GitHub**
- [ ] **Configure Sevalla Auto-Deployer**
- [ ] **Test deployment** thoroughly
- [ ] **Monitor for errors**

### **Environment Variables for Sevalla:**
```bash
NODE_ENV=production
PORT=3000
MONGODB_URI=your-mongodb-connection-string
```

## 🎉 **Success!**

After setup:
- ✅ **Git repository** connected to Sevalla
- ✅ **Auto-deployment** configured
- ✅ **Website live** on Sevalla
- ✅ **Easy updates** via Git push
- ✅ **Version control** with full history

**Your Ethiopia 361° website will be automatically deployed on every Git push!**

## 📞 **Support Resources**

**For help:**
- **Sevalla Documentation**: Auto-Deployer guides
- **GitHub Support**: Repository management
- **Git Documentation**: Version control help
- **Community Forums**: Developer community

**Your Ethiopia 361° tourism website is ready for professional Git-based deployment!** 🚀✨

---

## 🎯 **Quick Start Commands**

**Once Git is installed:**
```bash
# Navigate to project
cd "c:\Users\natil\Downloads\jules_session_12101324484193057985\ethiopia-tourism-website"

# Initialize Git
git init

# Add files
git add .

# Commit
git commit -m "Ethiopia 361° Tourism Website - Ready for Sevalla Auto-Deployer"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/ethiopia-tourism-website.git

# Push to GitHub
git push -u origin main
```

**Then configure Sevalla Auto-Deployer to watch this repository!**

**Your website will auto-deploy on every push!** 🔄🌐
