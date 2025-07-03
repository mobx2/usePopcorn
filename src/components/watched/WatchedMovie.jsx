import { useState, useEffect, useRef } from "react";

import { useOneMovie } from "../../hooks/useOneMovie";

import Loader from "../ui/Loader";

import StarRating from "../ui/StarRating";

export function MovieDetails({
  isWatched,
  setSelectedId,
  selectedId,
  selectMovie,
  handleClose,
  handleAddMovieToWatched,
  watched,
  KEY,
}) {
  const [userRating, setUserRating] = useState(0);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const { selectedMovie, isLoading } = useOneMovie(selectedId, KEY);

  // useRef for counting user rating dissecsions

  const counterRating = useRef(0);

  useEffect(() => {
    function escCallBack(e) {
      if (e.code === "Escape") {
        handleClose();
      }
    }

    document.addEventListener("keydown", escCallBack);

    return () => {
      document.removeEventListener("keydown", escCallBack);
    };
  });

  // useEffect for counting user rating dissision

  useEffect(() => {
    if (userRating) counterRating.current++;
  }, [userRating]);

  const {
    Title: title,
    Year: year,
    Released: released,
    Runtime: runtime,
    Genre: genre,
    Director: director,
    Actors: actors,
    Plot: plot,
    imdbRating,
    Poster: poster,
  } = selectedMovie;

  function halndeAddMovie() {
    const newMovie = {
      imdbID: selectedId,
      title,
      year,
      runtime,
      released,
      genre,
      actors,
      plot,
      imdbRating,
      userRating,
      poster,
      ratingCount: counterRating.current,
    };
    handleAddMovieToWatched(newMovie);
    handleClose();
  }

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button onClick={handleClose} className="btn-back">
              &larr;
            </button>
            <img src={poster} alt={`${poster} for ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} • {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating}
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <StarRating
                  maxRating={10}
                  size={24}
                  rating={userRating}
                  setUserRating={setUserRating}
                />
              ) : (
                <p>You rated this movie before ( {watchedUserRating} ⭐ ) </p>
              )}
              {userRating > 0 && (
                <button onClick={halndeAddMovie} className="btn-add">
                  + Add to list
                </button>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
