const express = require('express');
const path = require('path');
const app = express();

// Set up middleware
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Mock place data for testing
const mockPlace = {
    _id: '123456789012345678901234',
    id: '123456789012345678901234',
    name: 'Lalibela Rock Churches',
    name_am: 'ላሊበላ የድንጋይ ቤተክርስቲያን',
    description: 'Lalibela is a town in northern Ethiopia famous for its monolithic rock-cut churches. Built in the 12th and 13th centuries, these churches are a UNESCO World Heritage Site and one of Ethiopia\'s most sacred places.',
    description_am: 'ላሊበላ በሰሜን ኢትዮጵያ የምትገኘች ከተማ ሲሆን ለአንድ የድንጋይ የተቆረጠች ቤተክርስቲያንዋ ትታወቃለች። በ12ኛው እና 13ኛው ክፍለ ዘመን የተገነቡት እነዚህ ቤተክርስቲያናት የዩኔስኮ የዓለም ቅርስ ሆነው ከኢትዮጵያ በጣም ቅዱሳን ቦታዎች አንዱ ናቸው።',
    image_url: 'lalibela1.jpg',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'Historical',
    gallery_images: JSON.stringify(['lalibela1.jpg', 'lalibela2.jpg', 'lalibela3.jpg'])
};

// Routes
app.get('/', (req, res) => {
    res.render('index', { places: [mockPlace] });
});

app.get('/place/:id', (req, res) => {
    console.log('Place details requested for ID:', req.params.id);
    res.render('place', { place: mockPlace });
});

app.get('/admin', (req, res) => {
    res.render('admin', { places: [mockPlace] });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Test server running on http://localhost:${PORT}`);
    console.log('Test place details: http://localhost:3000/place/123456789012345678901234');
});
