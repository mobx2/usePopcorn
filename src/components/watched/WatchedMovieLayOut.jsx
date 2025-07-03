export default function WatchedMovie({ movie, handleDeleteWatchedMovie }) {
  const { imdbID, title, runtime, imdbRating, userRating, poster } = movie;

  return (
    <li>
      <img src={poster} alt="Poster" />
      <h3>{title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{runtime}</span>
        </p>
        <button
          onClick={() => {
            handleDeleteWatchedMovie(imdbID);
          }}
          className="btn-delete"
        >
          X
        </button>
      </div>
    </li>
  );
}
