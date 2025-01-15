const global = {
    currentPage: window.location.pathname,
};

//Highlight active link
function highlightLink() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        if (link.getAttribute('href') === global.currentPage) {
            link.classList.add('active');
        }
    });   
};

// init App
function init() {
    switch (global.currentPage) {
        case '/':
        case '/index.hmtl':
            console.log('Home');
            break;
        case '/shows.html':
            console.log('Shows');
            break;
        case '/movie-details.html':
            console.log('movie details');
            break;
        case '/tv-details.html':
            console.log('show details');
            break;
        case '/search.html':
            console.log('search');
            break;

    }
    highlightLink();   
}

document.addEventListener('DOMContentLoaded', init);