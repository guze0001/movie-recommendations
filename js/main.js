//DOMContentLoaded Listener
//  get image config info with fetch
//autofocus on text field
//click listener on search button
//keypress listener for enter
//both click and enter call search func.
//  do afetch calll to run the search
//  handle the results - build a list of movies

//new movie content click listeneres
//click movie to do a fetch for recommended
//with recommended results back
// navigate to recommended page
//build and display the list of movie recommendations

//recommended - baseurl + 'movie/' + movie_id + '/recommendations?apikey=' + APIKEY + '&language=en-US'

const app = {
    pages: [],
    baseURL: 'https://api.themoviedb.org/3/',
    baseImageURL: '',
    configData: null,
    searchResultsPage: document.getElementById('search-results'),
    recommendationsPage: document.getElementById('recommend-results'),
    init: function () {
        let input = document.getElementById('search-input');
        input.focus();
        setTimeout(app.addHandlers, 1234);
        app.getConfiguration();
        
    },
    getConfiguration: function () {
        let url = app.baseURL + 'configuration?api_key=' + APIKEY;
        //url = `${app.baseURL}search/movie?api_key${APIKEY}&query=${input.value}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                app.configData = data;
                //base_url: "http://image.tmdb.org/t/p/"
                app.baseImageURL = data.images.base_url + data.images.poster_sizes[4];
            })
            .catch(err => {
                console.log(err);
            })
    },
    addHandlers: function () {
        let btn = document.getElementById('search-button');
        btn.addEventListener('click', app.searchMovie);
        //add sleep    
        let input = document.getElementById('search-input');
        input.addEventListener('keypress', function (ev) {
            let char = ev.char || ev.charCode || ev.which;
           app.goSearch();
            if (char == 10 || char == 13) {
                //we have an enter or return key
                btn.dispatchEvent(new MouseEvent('click'));
            }

        });
        let closeBtn = document.getElementById('close-button');
        closeBtn.addEventListener('click',app.goHome);
    },
    searchMovie: function (ev) {
        //do the fetch to get the list of movies
        console.log(ev.type);
        ev.preventDefault();
        app.goSearch();
        let page = 1;
        let input = document.getElementById('search-input');
        if (input.value) {
            //code will not run if the value is empty
            let url = app.baseURL + 'search/movie?api_key=' + APIKEY + '&query=' + input.value + '&page=' + page;
            //url = `${app.baseURL}search/movie?api_key${APIKEY}&query=${input.value}`;
            let loader = document.getElementById('loader');
            loader.classList.add('active');
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    app.showMovies(data);
                    loader.classList.remove('active');
                })
                .catch(err => {
                    console.log(err);
                })
        }
    },
    showMovies: function (movies) {
        let container = app.searchResultsPage.querySelector('.content');

        //clear old results


        app.togglePages(app.searchResultsPage, app.recommendationsPage);

        app.generateMovieHTML(movies, container);

    },
    generateMovieHTML: function (movies, container) {
        app.showMovieCount(movies);
        let df = document.createDocumentFragment();
        container.innerHTML = '';

        //        loader.classList.add('active');
        movies.results.forEach(
            function (movie, index) {
                let div = document.createElement('div');


                div.setAttribute('data-movie', movie.id);
                div.classList.add('movie');

                let h2 = document.createElement('h2');
                h2.textContent = movie.title;
                h2.classList.add('movie-title');

                let span = document.createElement('span');
                span.textContent = "Date: " + movie.release_date + " Average: " + movie.vote_average ;//+ " Votes: " + movie.vote_count;
                span.classList.add('movie-date');

                let p = document.createElement('p');
                if (movie.overview == null || movie.overview.length < 1)
                    movie.overview = "No overview found.";
                p.textContent = movie.overview;
                p.classList.add('movie-desc');

                let img = document.createElement('img');
                img.classList.add('poster');
                img.setAttribute('alt', 'poster image for ' + movie.title + ' movie')
                if (movie.poster_path) {
                    img.setAttribute('src', app.baseImageURL + movie.poster_path);
                } else {
                    img.setAttribute('src', '/img/no-image.png');
                }
                div.appendChild(img);
                div.appendChild(h2);
                div.appendChild(span);
                div.appendChild(p);
                div.addEventListener('click', app.getRecommended);

                setTimeout(function () {
                    div.classList.add('move');
                }, (index + 1) * 200);
                df.appendChild(div);


            }
        );
        container.appendChild(df);

    },
    showMovieCount: function (movies) {

        let movieCount = movies.total_results;
        let resultCount = document.getElementById('result-count');
        resultCount.innerHTML = movieCount;
        let resultSummary = document.getElementById('result-summary');
        resultSummary.classList.add('visible');
    },
    getRecommended: function (ev) {
        let movieId = ev.currentTarget.getAttribute('data-movie');
        let movieName = ev.currentTarget.parentElement.firstElementChild.querySelector('h2').textContent;
        let page = 1;
        let url = app.baseURL + 'movie/' + movieId + '/recommendations?api_key=' + APIKEY + '&page=' + page;
        //url = `${app.baseURL}search/movie?api_key${APIKEY}&query=${input.value}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                app.showRecommended(data, movieName);
            })
            .catch(err => {
                console.log(err);
            })

        // alert(movieId);
    },
    showRecommended: function (movies, movieName) {
        let content = app.recommendationsPage.querySelector('.content')
        app.togglePages(app.recommendationsPage, app.searchResultsPage);

        let movieCount = movies.total_results;
        let resultCount = document.getElementById('recommend-count');
        resultCount.innerHTML = movieCount;
        let resultSummary = document.getElementById('recommend-summary');
        resultSummary.classList.add('visible');
        let movieNameContainer = document.getElementById('movie-name');
        movieNameContainer.textContent = movieName;


        app.generateMovieHTML(movies, content);

    },
    togglePages(active, passive) {
        active.classList.add('active');
        passive.classList.remove('active');
    },
    goHome:function(){
         let header= document.querySelector('header');
            header.classList.add('home');
            let homeTitle=document.querySelector('.home-title');
            homeTitle.classList.remove('search');
        app.searchResultsPage.classList.remove('active');
        app.recommendationsPage.classList.remove('active');
        
    },
    goSearch:function(){
     let header= document.querySelector('header');
            header.classList.remove('home');
            let homeTitle=document.querySelector('.home-title');
            homeTitle.classList.add('search');
}
}

document.addEventListener('DOMContentLoaded', app.init);




/*************
        SAMPLE URLS
        
        1. To get the config data like image base urls
        https://api.themoviedb.org/3/configuration?api_key=<APIKEY>
        
        2. To fetch a list of movies based on a keyword
        https://api.themoviedb.org/3/search/movie?api_key=<APIKEY>&query=<keyword>
        
        3. To fetch more details about a movie
        https://api.themoviedb.org/3/movie/<movie-id>?api_key=<APIKEY>
        *************/
//const APIKEY is inside key.js
/*let baseURL = 'https://api.themoviedb.org/3/';
let configData = null;
let baseImageURL = null;

let getConfig = function () {
    let url = "".concat(baseURL, 'configuration?api_key=', APIKEY);
    fetch(url)
        .then((result) => {
            return result.json();
        })
        .then((data) => {
            baseImageURL = data.images.secure_base_url;
            configData = data.images;
            console.log('config:', data);
            console.log('config fetched');
            runSearch('jaws')
        })
        .catch(function (err) {
            alert(err);
        });
}

let runSearch = function (keyword) {
    let url = ''.concat(baseURL, 'search/movie?api_key=', APIKEY, '&query=', keyword);
    fetch(url)
        .then(result => result.json())
        .then((data) => {
            //process the returned data
            document.getElementById('output').innerHTML = JSON.stringify(data, null, 4);
            //work with results array...

        })
}

document.addEventListener('DOMContentLoaded', getConfig);*/
/*******************************
SAMPLE SEARCH RESULTS DATA
{ "vote_count": 2762, 
    "id": 578, 
    "video": false, 
    "vote_average": 7.5, 
    "title": "Jaws", 
    "popularity": 16.273358, 
    "poster_path": "/l1yltvzILaZcx2jYvc5sEMkM7Eh.jpg", 
    "original_language": "en", 
    "original_title": "Jaws", 
    "genre_ids": [ 27, 53, 12 ], 
    "backdrop_path": "/slkPgAt1IQgxZXNrazEcOzhAK8f.jpg", 
    "adult": false, 
    "overview": "An insatiable great white shark terrorizes the townspeople of Amity Island, The police chief, an oceanographer and a grizzled shark hunter seek to destroy the bloodthirsty beast.", 
    "release_date": "1975-06-18" 
}
*******************************/
