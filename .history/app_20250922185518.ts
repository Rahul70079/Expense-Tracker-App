const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement;
const movieList = document.getElementById("movieList") as HTMLDivElement;
const movieModal = document.getElementById("movieModal") as HTMLDivElement;
const modalBody = document.getElementById("modalBody") as HTMLDivElement;
const closeModal = document.getElementById("closeModal") as HTMLSpanElement;

// Pagination controls
const prevBtn = document.getElementById("prevBtn") as HTMLButtonElement;
const nextBtn = document.getElementById("nextBtn") as HTMLButtonElement;
const pageInfo = document.getElementById("pageInfo") as HTMLSpanElement;

// 🔑 API Key
const API_KEY = "YOUR_API_KEY_HERE";

interface Movie {
  Title: string;
  Poster: string;
  Year: string;
  imdbID: string;
}

let currentQuery = "";
let currentPage = 1;
let totalResults = 0;

async function fetchMovies(query: string, page: number = 1) {
  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&page=${page}`);
    const data = await res.json();

    if (data.Response === "True") {
      totalResults = parseInt(data.totalResults, 10);
      renderMovies(data.Search);
      updatePagination();
    } else {
      movieList.innerHTML = `<p>No results found!</p>`;
      pageInfo.textContent = "";
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

async function fetchMovieDetails(imdbID: string) {
  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`);
  return await res.json();
}

function renderMovies(movies: Movie[]) {
  movieList.innerHTML = "";
  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>Year: ${movie.Year}</p>
      <button data-id="${movie.imdbID}">More Info</button>
    `;

    const infoBtn = card.querySelector("button")!;
    infoBtn.addEventListener("click", async () => {
      const details = await fetchMovieDetails(movie.imdbID);
      showModal(details);
    });

    movieList.appendChild(card);
  });
}

function showModal(details: any) {
  modalBody.innerHTML = `
    <h2>${details.Title} (${details.Year})</h2>
    <img src="${details.Poster !== "N/A" ? details.Poster : "https://via.placeholder.com/200"}" alt="${details.Title}">
    <p><strong>⭐ Rating:</strong> ${details.imdbRating}</p>
    <p><strong>Genre:</strong> ${details.Genre}</p>
    <p><strong>Actors:</strong> ${details.Actors}</p>
    <p><strong>Runtime:</strong> ${details.Runtime}</p>
    <p><strong>Plot:</strong> ${details.Plot}</p>
  `;

  movieModal.style.display = "block";
}

// Close modal
closeModal.addEventListener("click", () => {
  movieModal.style.display = "none";
});

// Close modal on outside click
window.addEventListener("click", (event) => {
  if (event.target === movieModal) {
    movieModal.style.display = "none";
  }
});

// Pagination update
function updatePagination() {
  pageInfo.textContent = `Page ${currentPage}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage * 10 >= totalResults;
}

// Event Listeners
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    currentQuery = query;
    currentPage = 1;
    fetchMovies(currentQuery, currentPage);
  }
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchMovies(currentQuery, currentPage);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage * 10 < totalResults) {
    currentPage++;
    fetchMovies(currentQuery, currentPage);
  }
});

