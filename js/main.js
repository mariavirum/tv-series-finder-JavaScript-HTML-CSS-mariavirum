"use strict";

const inputElement = document.querySelector(".js-input");
const buttonElement = document.querySelector(".js-button");
const searchesListElement = document.querySelector(".js-searches-list");

//Coger datos API
function callToApi() {
  let inputValue = inputElement.value;
  fetch("http://api.tvmaze.com/search/shows?q=" + inputValue)
    .then((response) => response.json())
    .then((data) => {
      paintShows(data);
    });
}

buttonElement.addEventListener("click", callToApi);
//PINTAR PELICULAS
function paintShows(movies) {
  let htmlCode = "";

  for (const movie of movies) {
    htmlCode += `<li class="list__item">`;
    htmlCode += `<p class="title__item">Título: ${movie.show.name}</p>`;
    if (movie.show.image !== null) {
      let image = movie.show.image.medium;
      htmlCode += `<img src= "${image}"/>`;
    } else {
      let image = "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
      htmlCode += `<img src= "${image}"/>`;
    }
    htmlCode += "</li>";
    console.log(movie);
  }
  searchesListElement.innerHTML = htmlCode;
}

//EVENTO BÚSQUEDA
/*function handleSearch() {
  callToApi();
  //setInLocalStorage(searchElement.value);
}*/
