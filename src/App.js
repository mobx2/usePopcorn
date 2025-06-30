import { useEffect, useRef, useState } from "react";
import StarRating from "./Star";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "a9bb670b";

export default function App() {
  const [query, setQuery] = useState("");

  const [selectedId, setSelectedId] = useState(null);

  const [watched, setWatched] = useLocalStorageState("wathced", []);

  const { movies, error, isLoading } = useMovies(query);

  function handelSelectedMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function hendelAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handleDeletWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />

        <NumbResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <BoxForListBox
              onSelectMovie={handelSelectedMovie}
              movies={movies}
            />
          )}
          {error && <ErrorMeassage mess={error} />}
        </Box>

        <Box>
          <>
            {selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                handleCloseMovie={handleCloseMovie}
                onAddWatched={hendelAddWatched}
                watched={watched}
              />
            ) : (
              <>
                <WatchedBoxSummary watched={watched} />
                <ListForWatched
                  watched={watched}
                  handleDeletWatched={handleDeletWatched}
                />
              </>
            )}
          </>
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMeassage({ mess }) {
  return <p className="error">{mess}</p>;
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
  const searchBar = useRef(null);

  useEffect(
    function () {
      function callBack(e) {
        if (document.activeElement === searchBar.current) return;

        if (e.code === "Enter") {
          setQuery("");
          searchBar.current.focus();
        }
      }

      document.addEventListener("keydown", callBack);

      return () => {
        document.removeEventListener("keydown", callBack);
      };
    },
    [query, setQuery]
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={searchBar}
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

function BoxForListBox({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)} key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>📅</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, handleCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(null);

  const counterRef = useRef(0);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  useEffect(
    function () {
      if (userRating) counterRef.current++;
    },
    [userRating]
  );

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

  function handelAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countUserRatingDecisions: counterRef.current,
    };
    onAddWatched(newWatchedMovie);
    handleCloseMovie();
  }

  useEffect(
    function () {
      function eventCallBack(e) {
        if (e.code === "Escape") {
          handleCloseMovie();
        }
      }
      document.addEventListener("keydown", eventCallBack);

      return () => {
        document.removeEventListener("keydown", eventCallBack);
      };
    },
    [handleCloseMovie]
  );

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );

        const data = await res.json();

        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return () => {
        document.title = "usePopcorn";
      };
    },
    [title]
  );
  return (
    <>
      <div className="details">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {" "}
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

                    {userRating !== null && (
                      <button className="btn-add" onClick={handelAdd}>
                        + Add to list
                      </button>
                    )}
                  </>
                ) : (
                  <p>You rated this movie {watchedUserRating} 🌟</p>
                )}
              </div>
              <p>
                <em>{plot}</em>
              </p>
              <p>Starring {actors}</p>
              <p>Directed by {director}</p>
            </section>{" "}
          </>
        )}
      </div>
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
        avgRuntime={Math.trunc(avgRuntime)}
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
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{Math.round(avgImdbRating)}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{Math.round(avgUserRating)}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{Math.round(avgRuntime)} min</span>
      </p>
    </div>
  );
}

function ListForWatched({ watched, handleDeletWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          handleDeletWatched={handleDeletWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, handleDeletWatched }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
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

        <button
          className="btn-delete"
          onClick={() => handleDeletWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
