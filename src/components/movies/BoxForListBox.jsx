import { Movie } from "./Movie";
export function BoxForListBox({
  movies,
  selectedId,
  setSelectedId,
  selectMovie,
}) {
  return (
    <ul className="list list-movies">
      {movies.map((movie) => (
        <Movie
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          movie={movie}
          key={movie.imdbID}
          selectMovie={selectMovie}
        />
      ))}
    </ul>
  );
}
