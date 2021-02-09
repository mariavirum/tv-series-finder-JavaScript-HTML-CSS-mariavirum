"use strict";

const inputElement = document.querySelector(".js-input");
const buttonElement = document.querySelector(".js-button");
const searchesListElement = document.querySelector(".js-searches-list");
const formElement = document.querySelector(".js-form");
const favoritesListElement = document.querySelector(".js-favorites-container");

let movies = "";
let favorites = [];

//Coger datos API
function callToApi() {
  let inputValue = inputElement.value;
  fetch("http://api.tvmaze.com/search/shows?q=" + inputValue)
    .then((response) => response.json())
    .then((data) => {
      movies = data;
      paintShows();
    });
}
buttonElement.addEventListener("click", callToApi);

//PREVENT DEFAULT FORM
function handleForm(ev) {
  ev.preventDefault();
}
formElement.addEventListener("submit", handleForm);

//PINTAR PELICULAS
function paintShows() {
  let htmlCode = "";

  for (const movie of movies) {
    //console.log(movie.show.id);
    htmlCode += `<li class="list__item js-item" id="${movie.show.id}">`;
    htmlCode += `<p class="title__item">Título: ${movie.show.name}</p>`;
    if (movie.show.image !== null) {
      let image = movie.show.image.medium;
      htmlCode += `<img src= "${image}"/>`;
    } else {
      let image = "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
      htmlCode += `<img src= "${image}"/>`;
    }
    htmlCode += "</li>";
  }
  searchesListElement.innerHTML = htmlCode;

  listenMovieEvents();
}

//DEFINIR PALETAS FAVORITAS
function isFavoriteMovie() {
  const favoriteFound = favorites.find((favorite) => {
    return favorite.id === movie.show.id;
  });
  if (favoriteFound === undefined) {
    return false;
  } else {
    return true;
  }
}

//ESCUCHAR EVENTOS FAVORITAS
function listenMovieEvents() {
  const movieElements = document.querySelectorAll(".js-item");
  for (const movieElement of movieElements) {
    movieElement.addEventListener("click", handleMovie);
  }
}

function handleMovie(ev) {
  const clickedMovieId = parseInt(ev.currentTarget.id);
  //console.log("me han clickado", clickedMovieId);
  const movieFound = movies.find(function (movie) {
    return movie.show.id === clickedMovieId;
  });

  favorites.push(movieFound);
  console.log(favorites);
  //paintFavoriteShows();
}
