export default function SummaryData({ watched }) {
  const avg = (arr) => arr.reduce((acc, curr) => acc + curr, 0) / arr.length;

  const avgImdbRating = watched.length
    ? avg(watched.map((movie) => Number(movie.imdbRating)))
    : 0;

  const avgUserRating = watched.length
    ? avg(watched.map((movie) => Number(movie.userRating)))
    : 0;

  const avgRunTime = watched.length
    ? avg(watched.map((movie) => parseInt(movie.runtime) || 0))
    : 0;

  return (
    <div>
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating.toFixed(1)}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating.toFixed(1)}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRunTime.toFixed(1)} min</span>
      </p>
    </div>
  );
}
