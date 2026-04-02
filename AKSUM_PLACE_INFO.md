# 📝 Aksum Place Information

## 🏛️ Basic Information

**Place Name:** Aksum  
**Name in Amharic:** አክሱም  
**Category:** Historical & Cultural Sites  

## 📄 Descriptions

### English Description:
Aksum is an ancient city in northern Ethiopia and one of the most important archaeological and historical sites in Africa. It was the center of the powerful Aksumite Kingdom and is famous for its towering obelisks (stelae), ancient tombs, and rich cultural heritage. Aksum is also considered sacred in Ethiopian Orthodox Christianity and is believed to be the resting place of the Ark of the Covenant.

### Amharic Description:
አክሱም በሰሜን ኢትዮጵያ የሚገኝ እና በታሪክ በጣም ታላቅ ከተማ ናት። የአክሱም ንጉሥነት ማዕከል ነበረች እና ታላላቅ ሐውልቶች፣ መቃብሮች እና ባህላዊ ቅርሶች ያሏት ናት። በኢትዮጵያ ኦርቶዶክስ እምነትም በጣም ቅዱስ ቦታ ናት።

## 🖼️ Media Files

**Main Image:** aksum_obelisk.jpg  
**Video URL:** https://youtu.be/o3euZ38gQXQ?si=uGraLaK96TIze4JT  

**Additional Images:**
-ackle_stelae.jpg
- st_mary_of_zion.jpg
- aksum_ruins.jpg

## 📍 Travel Guide Information

**Best Time to Visit:** October to March  

**How to Get There:** Fly to Aksum Airport, then take a short drive to the city  

**What to Bring:** Comfortable walking shoes, camera, sunscreen, water  

**Local Tips:** Hire a local guide to fully understand the history and significance  

**Entrance Fees:** Around 200–500 ETB for foreigners (varies by site)  

**Opening Hours:** 8:00 AM – 6:00 PM  

**Accommodation:** Hotels and guesthouses available in Aksum town  

**Nearby Attractions:** St. Mary of Zion Church, Queen of Sheba's Palace, Northern Stelae Field  

---

## 🔧 How to Add This Place

### Option 1: Through Admin Panel
1. Go to your website admin panel
2. Click "Add New Place" or "Edit Place"
3. Fill in all the information above
4. Upload the images to `/public/img/` directory
5. Save the place

### Option 2: Direct Database Entry
If you prefer to add directly to MongoDB, use the following JSON structure:

```json
{
  "name": "Aksum",
  "name_am": "አክሱም",
  "category": "Historical & Cultural Sites",
  "description": "Aksum is an ancient city in northern Ethiopia and one of the most important archaeological and historical sites in Africa. It was the center of the powerful Aksumite Kingdom and is famous for its towering obelisks (stelae), ancient tombs, and rich cultural heritage. Aksum is also considered sacred in Ethiopian Orthodox Christianity and is believed to be the resting place of the Ark of the Covenant.",
  "description_am": "አክሱም በሰሜን ኢትዮጵያ የሚገኝ እና በታሪክ በጣም ታላቅ ከተማ ናት። የአክሱም ንጉሥነት ማዕከል ነበረች እና ታላላቅ ሐውልቶች፣ መቃብሮች እና ባህላዊ ቅርሶች ያሏት ናት። በኢትዮጵያ ኦርቶዶክስ እምነትም በጣም ቅዱስ ቦታ ናት።",
  "image_url": "aksum_obelisk.jpg",
  "video_url": "https://youtu.be/o3euZ38gQXQ?si=uGraLaK96TIze4JT",
  "gallery_images": "[\"aksum_obelisk.jpg\", \"aksum_stelae.jpg\", \"st_mary_of_zion.jpg\", \"aksum_ruins.jpg\"]",
  "travel_guide": {
    "best_time": "October to March",
    "how_to_get_there": "Fly to Aksum Airport, then take a short drive to the city",
    "what_to_bring": "Comfortable walking shoes, camera, sunscreen, water",
    "local_tips": "Hire a local guide to fully understand the history and significance",
    "entrance_fees": "Around 200–500 ETB for foreigners (varies by site)",
    "opening_hours": "8:00 AM – 6:00 PM",
    "accommodation": "Hotels and guesthouses available in Aksum town",
    "nearby_attractions": "St. Mary of Zion Church, Queen of Sheba's Palace, Northern Stelae Field"
  }
}
```

### 📸 Image Preparation
Make sure to:
1. Download/place the images in `/public/img/` directory
2. Ensure images are optimized for web (max width 1200px)
3. Use proper naming conventions as listed above
