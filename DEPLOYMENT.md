# Ethiopia 361° - Vercel Deployment Guide

## 🚀 Deploy to Vercel

### Prerequisites
- Vercel account (free)
- GitHub account
- This project code

### Step 1: Push to GitHub
1. Create a new repository on GitHub
2. Push your code to the repository

```bash
git init
git add .
git commit -m "Initial commit - Ethiopia 361° Tourism Website"
git branch -M main
git remote add origin https://github.com/yourusername/ethiopia-tourism-website.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Node.js project
5. Click "Deploy"

### Step 3: Environment Variables
After deployment, add environment variables in Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add any needed variables (currently none required)

### Step 4: Access Your Site
Your site will be available at:
- `https://your-project-name.vercel.app`

## 📱 Features Available on Vercel

### ✅ Working Features
- ✅ Responsive design
- ✅ Mobile hamburger menu
- ✅ Place listings
- ✅ Multi-language support (English/Amharic)
- ✅ Video background on homepage
- ✅ Photo galleries
- ✅ AI chat assistant
- ✅ All navigation

### ⚠️ Limitations on Vercel
- ⚠️ **File uploads disabled** - Vercel's serverless functions don't support persistent file storage
- ⚠️ **Database resets** - In-memory database resets on each deployment
- ⚠️ **No admin panel** - Admin functions won't persist data

### 🔧 For Full Functionality
For complete functionality with file uploads and persistent data:
1. Use traditional hosting (DigitalOcean, AWS, etc.)
2. Or use Vercel with external database (PostgreSQL/MongoDB)
3. Or use Vercel with cloud storage (AWS S3) for files

## 🌐 Deployment Notes

### Database
- Uses in-memory SQLite on Vercel
- Automatically initializes with sample data
- Data resets on each deployment

### File Storage
- Uses placeholder images on Vercel
- Video background works (uses public/video)
- Upload functionality disabled

### Performance
- Fast loading with Vercel's CDN
- Global edge distribution
- Automatic HTTPS

## 📞 Support

If you need help with deployment:
1. Check Vercel's documentation
2. Review this guide
3. Ensure all files are committed to GitHub

Your Ethiopia 361° tourism website will be live and accessible worldwide! 🇪🇹✨
