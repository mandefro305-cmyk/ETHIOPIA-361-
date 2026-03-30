# MongoDB Setup for Ethiopia 361° Tourism Website

## 🗄️ MongoDB Atlas Setup (Recommended)

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for free account
3. Create a new project
4. Create a new cluster (free M0 Sandbox)

### Step 2: Get Connection String
1. In your cluster, click "Connect"
2. Choose "Connect your application"
3. Select "Node.js" driver
4. Copy the connection string

**Important:** Replace `<password>` with your actual password and add your IP address to access list.

### Step 3: Update Environment Variables

**For Vercel Deployment:**
1. Go to your Vercel project dashboard
2. Go to Settings → Environment Variables
3. Add: `MONGODB_URI` = your-connection-string

**For Local Development:**
Create a `.env` file in your project root:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ethiopia-tourism?retryWrites=true&w=majority
```

### Step 4: Install Dependencies
```bash
npm install mongoose
```

### Step 5: Update Server Configuration

**Option A: Use new MongoDB server**
- Rename `server-mongodb.js` to `server.js`
- Or update `vercel.json` to use `server-mongodb.js`

**Option B: Keep both servers**
- Use `server.js` for local SQLite development
- Use `server-mongodb.js` for Vercel deployment

## 🚀 MongoDB Benefits

### ✅ **Advantages over SQLite**
- **Persistent Data** - Survives deployments and restarts
- **Scalability** - Handle multiple users simultaneously
- **Cloud-based** - No local database management
- **Professional** - Production-ready database
- **Full Admin** - Add/edit/delete places permanently
- **File Uploads** - Store image metadata permanently

### 📊 **Database Schema**

**Users Collection:**
```javascript
{
  _id: ObjectId,
  username: String (unique),
  password: String (hashed)
}
```

**Places Collection:**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  image_url: String,
  video_url: String,
  gallery_images: [String] // Array of image paths
}
```

## 🔧 **Migration Notes**

### From SQLite to MongoDB:
- **Data preserved** - All existing places and users
- **Same functionality** - All features work identically
- **Better performance** - Faster queries and indexing
- **Automatic backup** - MongoDB Atlas handles backups

### **File Storage:**
- **Images**: Stored in `/public/uploads/images/`
- **Videos**: Stored in `/public/uploads/videos/`
- **Metadata**: Stored in MongoDB gallery_images array

## 🌐 **Deployment with MongoDB**

### **Vercel Deployment:**
1. Push code to GitHub
2. Import to Vercel
3. Add `MONGODB_URI` environment variable
4. Deploy automatically

### **Local Development:**
```bash
# Set environment variables
export MONGODB_URI="your-connection-string"

# Start server
npm start
```

## 📱 **Features Working with MongoDB**

✅ **Persistent Admin Panel**
- Add new places permanently
- Edit existing places
- Delete places
- Manage galleries

✅ **Data Persistence**
- Survives server restarts
- Survives Vercel deployments
- Automatic backups

✅ **File Uploads**
- Image uploads work
- Video uploads work
- Gallery management
- File deletion

✅ **All Existing Features**
- Multi-language support
- Mobile responsive design
- Video backgrounds
- AI chat assistant

## 🛠️ **Troubleshooting**

### **Connection Issues:**
- Check IP whitelist in MongoDB Atlas
- Verify connection string format
- Ensure password is URL-encoded

### **Deployment Issues:**
- Verify environment variables in Vercel
- Check MongoDB Atlas cluster status
- Review Vercel function logs

## 🎯 **Next Steps**

1. **Set up MongoDB Atlas** (5 minutes)
2. **Update environment variables** (2 minutes)
3. **Deploy to Vercel** (3 minutes)
4. **Test all functionality** (5 minutes)

Your Ethiopia 361° website will have **persistent data** and **full admin functionality**! 🗄️✨
