const global = {
    currentPage: window.location.pathname,
};


function showSpinner() {
    document.querySelector('.spinner').classList.add('show');
};

function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show');
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

async function displaymovieDetails() {
  const movieId = window.location.search.split('=');
  console.log(movieId[1]);
}

async function displayePopularShows() {
    const { results }  = await fetchAPIData('tv/popular');
    results.forEach(show => {
        const showDiv = document.createElement('div');
        showDiv.classList.add('card');
        showDiv.innerHTML = `<a href="movie-details.html?id=${show.id}">
            ${
            show.poster_path? `<img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />`:
            `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Air Date: ${show.first_air_date}</small>
            </p>
          </div>`;
        document.querySelector('#popular-shows').appendChild(showDiv);
    });
    
};

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
    // Registering the key at https://www.themoviedb.org/settings/api is free
    // This is only for development of very small projects. I'm aware I should store the key and make requests from a server
    const API_KEY = '36c558c21777358450a92bc1e4e6b241';
    const API_URL = 'https://api.themoviedb.org/3/';
    showSpinner();
    const res = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();
    hideSpinner();
    return data;
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
            displayePopularMovies();
            break;
        case '/shows.html':
            console.log('Shows');
            displayePopularShows();
            break;
        case '/movie-details.html':
        console.log('movie details');
        displaymovieDetails();
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