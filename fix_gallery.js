const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./tourism.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to the tourism SQLite database.');
});

// Update existing places to have proper gallery data
db.serialize(() => {
    // Update Simien Mountains National Park
    const simienGallery = JSON.stringify([
        '/img/simien.jpg',
        '/img/lalibela2.jpg',
        '/img/lalibela3.jpg', 
        '/img/lalibela4.jpg',
        '/img/lalibela5.jpg',
        '/img/lalibela6.jpg'
    ]);
    
    db.run("UPDATE places SET gallery_images = ? WHERE id = 2", [simienGallery], (err) => {
        if (err) {
            console.error('Error updating Simien Mountains:', err);
        } else {
            console.log('Updated Simien Mountains National Park with 6 gallery images');
        }
    });
    
    // Update Entoto Park
    const entotoGallery = JSON.stringify([
        '/img/danakil.svg',
        '/img/lalibela2.jpg',
        '/img/lalibela3.jpg', 
        '/img/lalibela4.jpg',
        '/img/lalibela5.jpg',
        '/img/lalibela6.jpg'
    ]);
    
    db.run("UPDATE places SET gallery_images = ? WHERE id = 3", [entotoGallery], (err) => {
        if (err) {
            console.error('Error updating Entoto Park:', err);
        } else {
            console.log('Updated Entoto Park with 6 gallery images');
        }
    });
    
    // Update kechene
    const kecheneGallery = JSON.stringify([
        '/uploads/images/image-177421059152-417034905.jpg',
        '/img/lalibela2.jpg',
        '/img/lalibela3.jpg', 
        '/img/lalibela4.jpg',
        '/img/lalibela5.jpg',
        '/img/lalibela6.jpg'
    ]);
    
    db.run("UPDATE places SET gallery_images = ? WHERE id = 4", [kecheneGallery], (err) => {
        if (err) {
            console.error('Error updating kechene:', err);
        } else {
            console.log('Updated kechene with 6 gallery images');
        }
        
        // Close the database connection
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('Database connection closed.');
            }
        });
    });
});
