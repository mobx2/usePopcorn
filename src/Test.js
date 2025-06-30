import { useEffect, useState } from "react";
import StarRating from "./Star";

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "a9bb670b";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("interstellar");
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function openMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function removeFromWatched(id) {
    setWatched(watched.filter((watched) => watched.imdbID !== id));
  }

  function handleWatched(movie) {
    setWatched([...watched, movie]);
  }

  useEffect(
    function () {
      const getData = async () => {
        setIsLoading(true);
        setErr("");
        setMovies([]);

        try {
          const response = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );

          const moviesData = await response.json();

          if (!response.ok) throw new Error("Somthing went wrong");

          if (moviesData.Response === "False")
            throw new Error("Movie not found!");

          setMovies(moviesData.Search);
        } catch (error) {
          setErr(error.message);
        } finally {
          setIsLoading(false);
        }
      };

      getData();
    },
    [query]
  );

  return (
    <>
      {/* <StarRating messages={["Tearable", "Bad", "Okay", "Good", "Amazing"]} /> */}
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumbResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !err && (
            <BoxForListBox movies={movies} openMovie={openMovie} />
          )}
          {err && <ErrorMsg err={err} />}
        </Box>

        <Box>
          <>
            {selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                handleCloseMovie={handleCloseMovie}
                handleWatched={handleWatched}
                watched={watched}
              />
            ) : (
              <>
                <WatchedBoxSummary watched={watched} />
                <ListForWatched
                  watched={watched}
                  removeFromWatched={removeFromWatched}
                />
              </>
            )}
          </>
        </Box>
      </Main>
    </>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumbResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function BoxForListBox({ movies, openMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie openMovie={openMovie} key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMsg({ err }) {
  return <p className="error">{err}</p>;
}

function Movie({ movie, openMovie }) {
  return (
    <li key={movie.imdbID} onClick={(e) => openMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </div>
    </li>
  );
}

function MovieDetails({
  selectedId,
  handleCloseMovie,
  watched,
  handleWatched,
}) {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState(null);
  const [isLoading, setIsLoading] = useState("");

  const isWatched = watched.some((movie) => movie.imdbID === selectedId);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function addNewMovieToWatched() {
    const newMovieWatche = {
      imdbID: selectedId,
      Title: title,
      Year: year,
      Poster: poster,
      runtime: Number(runtime.split(" ")[0]),
      imdbRating: Number(imdbRating),
      userRating,
    };

    handleWatched(newMovieWatche);
  }

  useEffect(
    function () {
      async function getMovie() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );

        const data = await res.json();

        setMovie(data);
        setIsLoading(false);
      }
      getMovie();
    },

    [selectedId]
  );

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="details">
          <header>
            <button onClick={handleCloseMovie} className="btn-back">
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />{" "}
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB Rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    setUserRating={setUserRating}
                  />
                  {userRating !== null ? (
                    <button
                      className="btn-add"
                      onClick={() => {
                        addNewMovieToWatched();
                        handleCloseMovie();
                      }}
                    >
                      + Add to list
                    </button>
                  ) : null}
                </>
              ) : (
                <p>You rated this movie {watchedUserRating} 🌟</p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director} </p>
          </section>
        </div>
      )}
    </>
  );
}

function WatchedBoxSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <SummaryHeader />
      <SummaryData
        watched={watched}
        avgImdbRating={avgImdbRating}
        avgUserRating={avgUserRating}
        avgRuntime={avgRuntime}
      />
    </div>
  );
}

function SummaryHeader() {
  return <h2>Movies you watched</h2>;
}

function SummaryData({ watched, avgRuntime, avgUserRating, avgImdbRating }) {
  return (
    <div>
      <div>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </div>

      <div>
        <span>⭐️</span>
        <span>{Math.round(avgImdbRating)}</span>
      </div>
      <div>
        <span>🌟</span>
        <span>{Math.round(avgUserRating)}</span>
      </div>
      <div>
        <span>⏳</span>
        <span>{Math.round(avgRuntime)} min</span>
      </div>
    </div>
  );
}

function ListForWatched({ watched, removeFromWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          removeFromWatched={removeFromWatched}
          key={movie.imdbID}
          movie={movie}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, removeFromWatched }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <span
          className="btn-delete"
          onClick={() => removeFromWatched(movie.imdbID)}
        ></span>
      </div>
    </li>
  );
}
