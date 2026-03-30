const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./tourism.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to the tourism SQLite database.');
});

// Check what's in the places table
db.all("SELECT id, name, image_url, gallery_images FROM places", [], (err, rows) => {
    if (err) {
        console.error('Error querying places:', err);
        return;
    }
    
    console.log('Places in database:');
    rows.forEach(row => {
        console.log(`ID: ${row.id}, Name: ${row.name}`);
        console.log(`  Image URL: ${row.image_url}`);
        console.log(`  Gallery Images: ${row.gallery_images}`);
        console.log('---');
    });
    
    // Close the database connection
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
});
