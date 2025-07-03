import WatchedMovie from "./WatchedMovieLayOut";
export default function ListForWatched({ watched, handleDeleteWatchedMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          handleDeleteWatchedMovie={handleDeleteWatchedMovie}
        />
      ))}
    </ul>
  );
}
