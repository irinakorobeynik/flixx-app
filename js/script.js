const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPage: 1
  },
    // Registering the key at https://www.themoviedb.org/settings/api is free
    // This is only for development of very small projects. I'm aware I should store the key and make requests from a server
  apiKey: '36c558c21777358450a92bc1e4e6b241',
  apiUrl: 'https://api.themoviedb.org/3/'
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
  const movieId = window.location.search.split('=')[1];
  const movie = await fetchAPIData(`movie/${movieId}`);
  displayBackgroundImage('movie', movie.backdrop_path);
  const div = document.createElement('div');
  div.innerHTML = `<div class="details-top">
          <div>
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
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)}/10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
             ${movie.overview} 
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${movie.genres.map((genre)=> `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${addCommasToNumber(movie.runtime)} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies.map((prod)=> `<span>${prod.name}</span>`).join(', ')}</div>
        </div>`;
  
  document.querySelector('#movie-details').appendChild(div);
};


function  displayBackgroundImage(type, path) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${path})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.1';
  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
};

async function search() {
  const quesryString = window.location.search;
  const urlParams = new URLSearchParams(quesryString);
  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');
  if (global.search.term !=+ '' && global.search.term !== null) {
    const { results, total_pages, page } = await searchAPIData();
    if (results.lenght === 0) {
      showAlert('No results found', 'alert-success');
      return;
    }

    displaySearchResults(results);

    document.querySelector('#search-term').value = '';
  } else {
    showAlert('Please Enter Serach Term');
  }
  
};

function displaySearchResults(results) {
    results.forEach(result => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `<a href="${global.search.type}-details.html?id=${result.id}">
            ${
            result.poster_path? `<img
              src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
              class="card-img-top"
              alt="${global.search.type ==='movie'? result.title: result.name}"
            />`:
            `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${global.search.type ==='movie'? result.title: result.name}"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${global.search.type ==='movie'? result.title: result.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${global.search.type ==='movie'? result.release_date: result.first_air_date}</small>
            </p>
          </div>`;
        document.querySelector('#search-results').appendChild(div);
    });
    
  
}

async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');
  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `<a href="movie-details.html?id=${movie.id}">
             <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}"/>
            </a>
             <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average}/ 10
            </h4>`;
    document.querySelector('.swiper-wrapper').appendChild(div);

    initSwiper();
  });

};

function initSwiper() {
const swiper = new Swiper('.swiper', {
  slidesPerView: 1, 
  spaceBetween: 30,
  freeMode: true,
  loop: true,
  autoPlay: {
    disableOnInteraction: false,
    delay: 4000
  },
  breakpoints: {
    500: {
      slidesPerView: 2
    },
    700: {
      slidesPerView: 3
    },
    1200: {
      slidesPerView: 4
    }
  }
});
}

async function displayePopularShows() {
    const { results }  = await fetchAPIData('tv/popular');
    results.forEach(show => {
        const showDiv = document.createElement('div');
        showDiv.classList.add('card');
        showDiv.innerHTML = `<a href="tv-details.html?id=${show.id}">
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

async function displayShowDetails() {
  const seriesId = window.location.search.split('=')[1];
  console.log(seriesId);
  const show = await fetchAPIData(`tv/${seriesId}`);
  displayBackgroundImage('show', show.backdrop_path);
  const div = document.createElement('div');
  div.innerHTML = `<div class="details-top">
          <div>
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
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${show.first_air_date}</p>
            <p>
              ${show.overview} 
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
        ${show.genres.map((genre)=> `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span>${show.number_of_episodes}</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.air_date}
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies.map((prod)=> `<span>${prod.name}</span>`).join(', ')}</div>
        </div>`;
  
  document.querySelector('#show-details').appendChild(div);
};

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {

    showSpinner();
    const res = await fetch(`${global.apiUrl}${endpoint}?api_key=${global.apiKey}&language=en-US`);
    const data = await res.json();
    hideSpinner();
    return data;
};

async function searchAPIData(endpoint) {

    showSpinner();
    const res = await fetch(`${global.apiUrl}search/${global.search.type}?api_key=${global.apiKey}&language=en-US&query=${global.search.term}`);
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

function showAlert(message, className = 'alert-error') {
  const alertL = document.createElement('div');
  alertL.classList.add('alert', className);
  alertL.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertL);
  setTimeout(() =>  alertL.remove(), 3000);
  
}

function addCommasToNumber(number) {
      number = number.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(number))
    number = number.replace(pattern, "$1,$2");
    return number;
}

// init App
function init() {
    switch (global.currentPage) {
        case '/':
        case '/index.hmtl':
        console.log('Home');
        displaySlider();
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
        displayShowDetails();
            break;
        case '/search.html':
        console.log('search');
        search();
            break;

    }
  //  highlightLink();   
}

document.addEventListener('DOMContentLoaded', init);