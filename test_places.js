const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./tourism.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to the tourism SQLite database.');
});

// Check all places with their video URLs
db.all("SELECT id, name, image_url, video_url, gallery_images FROM places", [], (err, rows) => {
    if (err) {
        console.error('Error querying places:', err);
        return;
    }
    
    console.log('=== DETAILED PLACE ANALYSIS ===');
    rows.forEach(row => {
        console.log(`\n--- Place ID: ${row.id} ---`);
        console.log(`Name: ${row.name}`);
        console.log(`Image URL: ${row.image_url}`);
        console.log(`Video URL: ${row.video_url}`);
        
        if (row.gallery_images) {
            try {
                const gallery = JSON.parse(row.gallery_images);
                console.log(`Gallery Images (${gallery.length}):`);
                gallery.forEach((img, index) => {
                    console.log(`  ${index + 1}. ${img}`);
                });
            } catch (e) {
                console.log('Error parsing gallery_images:', e);
            }
        } else {
            console.log('Gallery Images: null');
        }
    });
    
    // Close the database connection
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('\nDatabase connection closed.');
        }
    });
});
