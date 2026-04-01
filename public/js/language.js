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
            elements[i].innerText = elements[i].getAttribute("data-am");
        } else {
            elements[i].innerText = elements[i].getAttribute("data-en");
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