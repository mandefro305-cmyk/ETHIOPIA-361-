// Common JavaScript for Premium Interactions - Used across all pages

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (header && window.scrollY > 50) {
        header.classList.add('scrolled');
    } else if (header) {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobile-nav');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (!mobileNav || !menuBtn) return;
    
    mobileNav.classList.toggle('active');
    
    // Animate hamburger menu
    const spans = menuBtn.querySelectorAll('span');
    if (mobileNav.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const mobileNav = document.getElementById('mobile-nav');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileNav && menuBtn && !mobileNav.contains(event.target) && !menuBtn.contains(event.target)) {
        mobileNav.classList.remove('active');
        
        // Reset hamburger menu
        const spans = menuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Add entrance animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all place cards after they're loaded
function observeCards() {
    document.querySelectorAll('.place-card').forEach(card => {
        if (card.style.opacity !== '1') {
            card.style.opacity = '0';
            observer.observe(card);
        }
    });
}

// Utility function to generate premium destination cards
function generateDestinationCards(places, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    if (places.length === 0) {
        container.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1;">
                <i class="fas fa-search"></i>
                <h3 data-en="No places found" data-am="ምንም ቦታዎች አልተገኙም">No places found</h3>
                <p data-en="Try different filters or search terms" data-am="የተለየ ማጣሪያዎች ወይም ፍለጋ ቃላላት ይሞክሩ">Try different filters or search terms</p>
            </div>
        `;
        return;
    }
    
    // Generate cards using the premium template
    places.forEach(place => {
        const card = createPremiumCard(place);
        container.appendChild(card);
    });
    
    // Observe new cards for animations
    setTimeout(observeCards, 100);
}

// Create a premium destination card element
function createPremiumCard(place) {
    const card = document.createElement('div');
    card.className = 'place-card';
    card.onclick = () => window.location.href = `/place/${place._id}`;
    
    // Get image URL
    let imageUrl = '';
    if (place.image_url && place.image_url !== '') {
        if (place.image_url.startsWith('http')) {
            imageUrl = place.image_url;
        } else if (place.image_url.startsWith('/uploads/')) {
            imageUrl = place.image_url;
        } else {
            imageUrl = `/img/${place.image_url}`;
        }
    } else {
        imageUrl = `https://picsum.photos/seed/${place.name}/400/250.jpg`;
    }
    
    // Get category icon
    const categoryIcons = {
        'Historical & Cultural Sites': '🏛️',
        'Nature & Mountains': '🌄',
        'Lakes & Water Attractions': '🌊',
        'Unique & Adventure Destinations': '🌋',
        'Cities & Urban Tourism': '🏙️',
        'Relaxation & Resort Areas': '🌿'
    };
    const categoryIcon = categoryIcons[place.category] || '📍';
    
    card.innerHTML = `
        <div class="place-card-image">
            <img src="${imageUrl}" alt="${place.name}" loading="lazy" 
                 onerror="this.src='https://picsum.photos/seed/${place.name}/400/250.jpg'">
            
            <div class="place-card-overlay"></div>
            <div class="place-card-category">
                ${categoryIcon} ${place.category || 'Destination'}
            </div>
        </div>
        
        <div class="place-card-content">
            <h3>${place.name}</h3>
            <p>${place.description ? place.description.substring(0, 120) + '...' : 'Discover this amazing destination in Ethiopia.'}</p>
            
            <div class="place-card-actions">
                <a href="/place/${place._id}" class="btn btn-primary">
                    <i class="fas fa-info-circle"></i>
                    <span data-en="View Details" data-am="ዝርዝሮችን ይመልከቱ">View Details</span>
                </a>
                
                ${place.video_url && place.video_url !== '' ? `
                    <a href="/place/${place._id}#video" class="btn btn-secondary">
                        <i class="fas fa-play"></i>
                        <span data-en="Watch Video" data-am="ቪዲዮ ይመልከቱ">Watch Video</span>
                    </a>
                ` : `
                    <a href="/place/${place._id}#gallery" class="btn btn-secondary">
                        <i class="fas fa-images"></i>
                        <span data-en="View Gallery" data-am="ጋለሪ ይመልከቱ">View Gallery</span>
                    </a>
                `}
            </div>
        </div>
    `;
    
    return card;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { observeCards, generateDestinationCards, createPremiumCard };
}
