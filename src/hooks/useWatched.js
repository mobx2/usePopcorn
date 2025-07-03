import { useLocalStorage } from "./useLocalStorage";

export function useWatched(selectedId, setSelectedId) {
  const { value: watched, setValue: setWatched } = useLocalStorage(
    "watched",
    []
  );

  const isWatched = watched.some((movie) => movie.imdbID === selectedId);

  function selectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleClose() {
    setSelectedId(null);
  }

  function handleAddMovieToWatched(newMovie) {
    setWatched([...watched, newMovie]);
  }

  function handleDeleteWatchedMovie(id) {
    setWatched(watched.filter((movie) => movie.imdbID !== id));
  }
  return {
    watched,
    isWatched,
    handleAddMovieToWatched,
    selectMovie,
    handleClose,
    handleDeleteWatchedMovie,
  };
}
