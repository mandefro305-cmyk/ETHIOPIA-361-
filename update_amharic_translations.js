// Script to add Amharic translations to existing places
const mongoose = require('mongoose');
const { Place } = require('./models/database');

// Connect to MongoDB
mongoose.connect('mongodb+srv://mandea:Mandea@cluster0.2pqdkpd.mongodb.net/?appName=Cluster0').then(() => {
    console.log('Connected to MongoDB database.');
    updateTranslations();
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

async function updateTranslations() {
    try {
        console.log('Updating Amharic translations for places...');
        
        // Common Amharic translations for places
        const translations = {
            'Lalibela Rock-Hewn Churches': {
                name_am: 'ላሊበላ የተቀደሱ የእንጨት ቤተ ክርስቲያኖች',
                description_am: 'ላሊበላ በእንጨት ውስጥ የተቀደሱ ቤተ ክርስቲያኖች የሚገኙበት ታሪካዊ ከተማ ናት። እነዚህ ቤተ ክርስቲያኖች በ12ኛው ክፍለ ዘመን ተሰርተው በዓለም አቀፍ የህንጻ ቅርስ ዝርዝር ውስጥ ይገኛሉ።'
            },
            'Simien Mountains National Park': {
                name_am: 'የሲሜን ተራሮች ብሔራዊ ፓርክ',
                description_am: 'የሲሜን ተራሮች ብሔራዊ ፓርክ በኢትዮጵያ ሰሜን የሚገኝ የተራራ ተፈጥሮን ያሳያል። ይህ ቦታ በዓለም አቀፍ የህይወት ብሄረሰቦች ተብሎ ተ��ዝግቧል እና የዋልያ እንስሳት መኖሪያ ነው።'
            },
            'Entoto Park': {
                name_am: 'እንጦጦ ፓርክ',
                description_am: 'እንጦጦ ፓርክ በአዲስ አበባ ዙሪያ የሚገኝ የተፈጥሮ ውበት ያለው ፓርን ነው። ከከተማዋ ውጭ ለመውደቅ እና ለመዝናናት ተስማሚ ቦታ ነው።'
            },
            'Axum': {
                name_am: 'አክሱም',
                description_am: 'አክሱም የኢትዮጵያ ጥንታዊ ዋና ከተማ እና የአክሱም መንግስታት ዋና ከተማ ነበረች። የንጉሠ ነገሥት ሰብእና ሰብእና የንጉሠ ነገሥት እህዳማ መንግስታት ዋና ከተማ ነበረች።'
            },
            'Gonder': {
                name_am: 'ጎንደር',
                description_am: 'ጎንደር የኢትዮጵያ ታሪካዊ ከተማ ነች፣ የጎንደር መንግስታት ዋና ከተማ ነበረች። በፋሲለደስ ተራሮች ላይ የምትገኝ እና ብዙ የታሪክ እንቅስቃሴዎችን የያሳያለች ነች።'
            },
            'Bahir Dar': {
                name_am: 'ባህር ዳር',
                description_am: 'ባህር ዳር የኢትዮጵያ ከተማ ነች፣ በታና ሃይቅ ዳርያ ላይ የምትገኝ። የታና ሃይቅ እና የሰማማት ውኃላቸው የተወሰኑ የቱሪዝም መስህቦች ናቸው።'
            },
            'Harar': {
                name_am: 'ሐረር',
                description_am: 'ሐረር የኢትዮጵያ ከተማ ነች፣ በምስራቅ ኢትዮጵያ ይገኛል። የኢስላም ቅርስ እና የግብጽ ግንባታዎችን የያሳያለች እና በቡና ንግድ ታዋቂ ናት።'
            },
            'Danakil Depression': {
                name_am: 'ዳናኪል ውቅያሰ',
                description_am: 'ዳናኪል ውቅያሰ በኢትዮጵያ ሰሜን ምስራቅ የሚገኝ በምድር ውስጥ ያለው በጣም ዝቅተኛ ቦታ ነው። በአለም ላይ በጣም ትኩረት የሚስብ እና በሙቀት የሚታወቅ ቦታ ነው።'
            }
        };

        // Get all places from database
        const places = await Place.find({});
        console.log(`Found ${places.length} places to update`);

        for (const place of places) {
            const translation = translations[place.name];
            if (translation) {
                place.name_am = translation.name_am;
                place.description_am = translation.description_am;
                await place.save();
                console.log(`✅ Updated: ${place.name} -> ${translation.name_am}`);
            } else {
                // Add basic Amharic fallback for places without specific translations
                place.name_am = place.name; // Keep English name as fallback
                place.description_am = place.description || 'ይህንን የሚያምር የኢትዮጵያን መዳረሻ ያግኙ';
                await place.save();
                console.log(`⚠️  Added fallback for: ${place.name}`);
            }
        }

        console.log('\n✅ All places updated with Amharic translations!');
        console.log('\nNow you can change the language to Amharic on your website and see the translated content.');
        
    } catch (error) {
        console.error('Error updating translations:', error);
    } finally {
        mongoose.connection.close();
    }
}
