"use strict";

const inputElement = document.querySelector(".js-input");
const buttonElement = document.querySelector(".js-button");
const searchesListElement = document.querySelector(".js-searches-list");
const formElement = document.querySelector(".js-form");
const favoritesListElement = document.querySelector(".js-favorite-list");
const buttonResetElement = document.querySelector(".js-buttonReset");

let movies = [];
let favorites = [];
let defaultImage = "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";

//Coger datos API
function callToApi() {
  let inputValue = inputElement.value;
  fetch("http://api.tvmaze.com/search/shows?q=" + inputValue)
    .then((response) => response.json())
    .then((data) => {
      movies = data;
      paintShows();
      setInLocalStorage();
    });
}

buttonElement.addEventListener("click", callToApi);

//LOCAL STORAGE
function setInLocalStorage() {
  const stringFavorites = JSON.stringify(favorites);
  localStorage.setItem("favorites", stringFavorites);
}

function getFromLocalStorage() {
  const localStorageFavorites = localStorage.getItem("favorites");
  if (localStorageFavorites === null) {
  } else {
    const arrayFavorites = JSON.parse(localStorageFavorites);
    favorites = arrayFavorites;
    paintFavoriteShows();
  }
}

//PREVENT DEFAULT FORM
function handleForm(ev) {
  ev.preventDefault();
}
formElement.addEventListener("submit", handleForm);

//PINTAR EL ARRAY DE LAS SERIES BUSCADAS
function paintShows() {
  let htmlCode = "";

  for (const movie of movies) {
    //EL "IF" PINTA EL MARCADO DE FAVORITA EN LA LISTA DE BUSQUEDA
    if (isFavoriteMovie(movie) === true) {
      htmlCode += `<li class="list__item js-item selected-container" id="${movie.show.id}">`;
      htmlCode += `<p class="title__item selected-title">Título: ${movie.show.name}</p>`;
    } else {
      htmlCode += `<li class="list__item js-item " id="${movie.show.id}">`;
      htmlCode += `<p class="title__item">Título: ${movie.show.name}</p>`;
    }

    if (movie.show.image !== null) {
      let image = movie.show.image.medium;
      htmlCode += `<img class="photo__item" src= "${image}"/>`;
    } else {
      let image = defaultImage;
      htmlCode += `<img class="photo__itemReplace" src= "${image}"/>`;
    }
    htmlCode += "</li>";
  }
  searchesListElement.innerHTML = htmlCode;

  listenMovieEvents();
}

//GESTIONA MARCADO DE FAVORITAS EN LA LISTA DE BÚSQUEDA
function isFavoriteMovie(movie) {
  const favoriteFound = favorites.find((favorite) => {
    return favorite.show.id === movie.show.id;
  });
  //OPERADOR TERNARIO en vez de If/else
  const favoriteValue = favoriteFound === undefined ? false : true;
  return favoriteValue;
}

//ESCUCHAR EVENTO trae todos los <li> y con un bucle hace que se escuche el evento en cada <li>
function listenMovieEvents() {
  const movieElements = document.querySelectorAll(".js-item");
  for (const movieElement of movieElements) {
    movieElement.addEventListener("click", handleMovie);
  }
}

//CREA ARRAY DE FAVORITAS
function handleMovie(ev) {
  const clickedMovieId = parseInt(ev.currentTarget.id);
  const favoritesFoundIndex = favorites.findIndex(function (favorite) {
    return favorite.show.id === clickedMovieId;
  });
  //if -> SI EL INDEX NO ESTÁ EN EL ARRAY DE FAVORITAS SE AÑADE
  if (favoritesFoundIndex === -1) {
    const movieFound = movies.find(function (movie) {
      return movie.show.id === clickedMovieId;
    });
    favorites.push(movieFound);
  } else {
    //SI EL INDEX YA ESTÁ EN EL ARRAY SE ELIMINA
    favorites.splice(favoritesFoundIndex, 1);
  }
  paintShows();
  paintFavoriteShows();
  setInLocalStorage();
}

//PINTAR FAVORITAS EN SU LISTA
function paintFavoriteShows() {
  let htmlCode = "";

  for (const favorite of favorites) {
    htmlCode += `<li class="list__itemFav js-item" id="${favorite.show.id}">`;
    htmlCode += `<p class="title__itemFav">Título: ${favorite.show.name}</p>`;
    if (favorite.show.image !== null) {
      let image = favorite.show.image.medium;
      htmlCode += `<img class="photo__itemFav" src= "${image}"/>`;
    } else {
      let image = defaultImage;
      htmlCode += `<img src= "${image}"/>`;
    }
    htmlCode += "</li>";
  }
  favoritesListElement.innerHTML = htmlCode;

  listenMovieEvents();
}

//BOTON ELIMINAR LISTA ENTERA DE FAVORITOS

function resetFavoritesList() {
  favorites = [];

  paintShows();
  paintFavoriteShows();
  setInLocalStorage();
}

buttonResetElement.addEventListener("click", resetFavoritesList);

//ARRANCAR
getFromLocalStorage();
