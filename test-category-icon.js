// Test the category icon function
const testCategoryIcon = () => {
    const category = 'Historical & Cultural Sites';
    
    // Test the inline function approach
    const category_icon = (() => {
        const icons = {
            'Historical & Cultural Sites': '🏛️',
            'Nature & Mountains': '🌄',
            'Unique & Adventure Destinations': '🌋',
            'Lakes & Water Attractions': '🌊',
            'Cities & Urban Tourism': '🏙️',
            'Relaxation & Resort Areas': '🌿',
            'Religious': '⛪'
        };
        return icons[category] || '🏛️';
    })();
    
    console.log('Category:', category);
    console.log('Icon:', category_icon);
    
    // Test all categories
    const categories = [
        'Historical & Cultural Sites',
        'Nature & Mountains',
        'Unique & Adventure Destinations',
        'Lakes & Water Attractions',
        'Cities & Urban Tourism',
        'Relaxation & Resort Areas',
        'Religious',
        'Unknown Category'
    ];
    
    console.log('\nTesting all categories:');
    categories.forEach(cat => {
        const icon = (() => {
            const icons = {
                'Historical & Cultural Sites': '🏛️',
                'Nature & Mountains': '🌄',
                'Unique & Adventure Destinations': '🌋',
                'Lakes & Water Attractions': '🌊',
                'Cities & Urban Tourism': '🏙️',
                'Relaxation & Resort Areas': '🌿',
                'Religious': '⛪'
            };
            return icons[cat] || '🏛️';
        })();
        console.log(`${cat}: ${icon}`);
    });
};

testCategoryIcon();
