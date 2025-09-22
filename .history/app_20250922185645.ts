const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement;
const movieList = document.getElementById("movieList") as HTMLDivElement;

// 🔑 Get free API key from https://www.omdbapi.com/apikey.aspx
const API_KEY = "YOUR_API_KEY_HERE";

interface Movie {
  Title: string;
  Poster: string;
  Year: string;
  imdbRating?: string;
}

async function fetchMovies(query: string) {
  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
    const data = await res.json();

    if (data.Response === "True") {
      renderMovies(data.Search);
    } else {
      movieList.innerHTML = `<p>No results found!</p>`;
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

async function fetchMovieDetails(imdbID: string): Promise<string> {
  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
  const data = await res.json();
  return data.imdbRating || "N/A";
}

async function renderMovies(movies: Movie[]) {
  movieList.innerHTML = "";
  for (const movie of movies) {
    const rating = await fetchMovieDetails((movie as any).imdbID);

    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>Year: ${movie.Year}</p>
      <p>⭐ Rating: ${rating}</p>
    `;

    movieList.appendChild(card);
  }
}

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchMovies(query);
});

