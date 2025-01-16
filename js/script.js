const global = {
    currentPage: window.location.pathname,
};
async function displayePopularMovies() {
    const { results }  = await fetchAPIData('movie/popular');
    results.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('card');
        movieDiv.innerHTML = `<a href="movie-details.html?id=${movie.id}">
            ${
            movie.poster_path? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`:
            `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>`;
        document.querySelector('#popular-movies').appendChild(movieDiv);
    });
    
};



// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
    const API_KEY = '36c558c21777358450a92bc1e4e6b241';
    const API_URL = 'https://api.themoviedb.org/3/';
    const res = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();
    return data;
}

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
            displayePopularMovies();
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