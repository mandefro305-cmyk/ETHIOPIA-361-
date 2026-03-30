const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./tourism.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to the tourism SQLite database.');
});

// Add gallery_images column to places table
db.serialize(() => {
    // Check if column already exists
    db.all("PRAGMA table_info(places)", [], (err, columns) => {
        if (err) {
            console.error('Error checking table info:', err);
            return;
        }
        
        const hasGalleryColumn = columns.some(col => col.name === 'gallery_images');
        
        if (!hasGalleryColumn) {
            db.run("ALTER TABLE places ADD COLUMN gallery_images TEXT", (err) => {
                if (err) {
                    console.error('Error adding column:', err.message);
                } else {
                    console.log('Added gallery_images column to places table successfully.');
                }
                
                // Close the database connection after adding column
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                });
            });
        } else {
            console.log('gallery_images column already exists.');
            
            // Close the database connection
            db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err.message);
                } else {
                    console.log('Database connection closed.');
                }
            });
        }
    });
});
