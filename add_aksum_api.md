# 🔧 Add Aksum via API Call

## Option 1: Use Browser Developer Console

1. Go to your website: https://ethiopia-361-bg5k5.sevalla.app
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Copy and paste this code:

```javascript
fetch('/admin/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: "Aksum",
    name_am: "አክሱም",
    category: "Historical & Cultural Sites",
    description: "Aksum is an ancient city in northern Ethiopia and one of the most important archaeological and historical sites in Africa. It was the center of the powerful Aksumite Kingdom and is famous for its towering obelisks (stelae), ancient tombs, and rich cultural heritage. Aksum is also considered sacred in Ethiopian Orthodox Christianity and is believed to be the resting place of the Ark of the Covenant.",
    description_am: "አክሱም በሰሜን ኢትዮጵያ የሚገኝ እና በታሪክ በጣም ታላቅ ከተማ ናት። የአክሱም ንጉሥነት ማዕከል ነበረች እና ታላላቅ ሐውልቶች፣ መቃብሮች እና ባህላዊ ቅርሶች ያሏት ናት። በኢትዮጵያ ኦርቶዶክስ እምነትም በጣም ቅዱስ ቦታ ናት።",
    image_url: "aksum_obelisk.jpg",
    video_url: "https://youtu.be/o3euZ38gQXQ?si=uGraLaK96TIze4JT",
    gallery_images: JSON.stringify([
      "aksum_obelisk.jpg",
      "aksum_stelae.jpg",
      "st_mary_of_zion.jpg",
      "aksum_ruins.jpg"
    ]),
    travel_guide: {
      best_time: "October to March",
      how_to_get_there: "Fly to Aksum Airport, then take a short drive to the city",
      what_to_bring: "Comfortable walking shoes, camera, sunscreen, water",
      local_tips: "Hire a local guide to fully understand the history and significance",
      entrance_fees: "Around 200–500 ETB for foreigners (varies by site)",
      opening_hours: "8:00 AM – 6:00 PM",
      accommodation: "Hotels and guesthouses available in Aksum town",
      nearby_attractions: "St. Mary of Zion Church, Queen of Sheba's Palace, Northern Stelae Field"
    }
  })
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

5. Press Enter
6. If successful, you'll see "Success:" in the console
7. Refresh your website to see Aksum

## Option 2: Create a Simple Add Place Page

I can create a simple HTML page that you can open locally to add places. Would you like me to create that?

## Option 3: Contact Your Developer

If you have a developer who manages the website, they can:
1. Access the admin panel at https://ethiopia-361-bg5k5.sevalla.app/admin
2. Add Aksum using the details provided
3. Or add it directly to the MongoDB database

## Why I Can't Do It Directly

- I don't have access to your admin credentials
- I cannot make authenticated requests to your admin panel
- The database requires proper authentication
- Only you or your authorized developer can access the admin panel

## Quick Solution

The easiest way is to:
1. Log into your admin panel
2. Use the "Add New Place" form
3. Copy-paste the information from the AKSUM_PLACE_INFO.md file

This will ensure Aksum is properly added with all the correct data!
