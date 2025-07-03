import { useEffect, useState } from "react";

export function useMovies(query) {
  const KEY = "a9bb670b";
  const [movies, setMovies] = useState([]);
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controler = new AbortController();

    async function getMovies() {
      if (query.length < 3) {
        setMovies([]);
        setErr("");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controler.signal }
        );
        if (!response.ok) {
          throw new Error("Somthing went wrong");
        }

        const data = await response.json();

        if (data.Response === "False") {
          throw new Error("Movie not found");
        }

        setMovies(data.Search || []);
      } catch (err) {
        if (err.name === "AbortError") return;
        setErr(err?.message || "Unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    getMovies();

    return () => {
      controler.abort();
    };
  }, [query]);

  return { movies, err, isLoading, KEY };
}
