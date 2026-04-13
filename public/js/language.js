function changeLanguage(){
    var lang = document.getElementById("language").value;
    
    // Save language preference
    localStorage.setItem('selectedLanguage', lang);
    
    // Update all elements
    updateLanguage(lang);
}

function updateLanguage(lang) {
    var elements = document.querySelectorAll("[data-en]");
    
    for(var i = 0; i < elements.length; i++) {
        if(lang === "am"){
            elements[i].textContent = elements[i].getAttribute("data-am");
        } else {
            elements[i].textContent = elements[i].getAttribute("data-en");
        }
    }
}

// Load saved language on page load
document.addEventListener('DOMContentLoaded', function() {
    var savedLang = localStorage.getItem('selectedLanguage') || 'en';
    var langSelect = document.getElementById("language");
    
    if(langSelect) {
        langSelect.value = savedLang;
        updateLanguage(savedLang);
    }
});

// Dark Mode Toggle
function toggleDarkMode() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
    
    body.classList.toggle('dark-mode');
    themeToggle.classList.toggle('light');
    
    // Save preference
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Update theme toggle icon
    if (isDarkMode) {
        themeToggle.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2))';
    } else {
        themeToggle.style.background = 'rgba(255,255,255,0.1)';
    }
}

// Load dark mode preference
document.addEventListener('DOMContentLoaded', function() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.classList.add('light');
    }
});

// Mobile Menu Toggle
function toggleMobileMenu() {
    const nav = document.getElementById('mobile-nav');
    nav.classList.toggle('active');
    
    // Close menu when clicking outside
    document.addEventListener('click', function closeMenu(e) {
        if (!nav.contains(e.target) && !e.target.closest('.mobile-menu-btn')) {
            nav.classList.remove('active');
            document.removeEventListener('click', closeMenu);
        }
    });
}