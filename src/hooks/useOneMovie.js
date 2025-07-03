import { useEffect, useState } from "react";

export function useOneMovie(selectedId, KEY) {
  const [selectedMovie, setSelectedMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controler = new AbortController();

    async function getMovie() {
      setIsLoading(true);
      try {
        const movieResponse = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`,
          { signal: controler.signal }
        );

        const data = await movieResponse.json();

        setSelectedMovie(data);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Something went wrong", err);
      } finally {
        setIsLoading(false);
      }
    }

    getMovie();

    return () => {
      controler.abort();
    };
  }, [selectedId, KEY]);

  return { selectedMovie, isLoading };
}
