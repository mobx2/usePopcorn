// ============================================
// ========= React & Custom Hooks =============
// ============================================
import { useState } from "react";

import { useMovies } from "./hooks/useMovies,";

import { useWatched } from "./hooks/useWatched";

// ============================================
// ========== NavBar Components ===============
// ============================================

import { NavBar } from "./components/navBar/NavBar";

import { Search } from "./components/navBar/Search";

import { NumbResults } from "./components/navBar/NumbResult";

// ============================================
// ========== Layout Components ===============
// ============================================

import { Main } from "./components/layout/Main";

import { Box } from "./components/layout/Box";

// ============================================
// =========== Movies Components ==============
// ============================================

import { BoxForListBox } from "./components/movies/BoxForListBox";

// ============================================
// ========== Watched Components ==============
// ============================================

import { MovieDetails } from "./components/watched/WatchedMovie";

import { WatchedBoxSummary } from "./components/watched/WatchedSummery";

import ListForWatched from "./components/watched/ListForWatched";
// ============================================
// ============ UI Components =================
// ============================================

import Loader from "./components/ui/Loader";

import ErrorMeassage from "./components/ui/ErrorMeassage";

// ============================================
// ============ App Component =================
// ============================================

export default function App() {
  const [query, setQuery] = useState("");

  const [selectedId, setSelectedId] = useState();

  const { movies, err, isLoading, KEY } = useMovies(query);

  const {
    watched,
    isWatched,
    handleAddMovieToWatched,
    selectMovie,
    handleClose,
    handleDeleteWatchedMovie,
  } = useWatched(selectedId, setSelectedId);

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumbResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading ? (
            <Loader />
          ) : err ? (
            <ErrorMeassage err={err} />
          ) : (
            <BoxForListBox
              movies={movies}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              selectMovie={selectMovie}
            />
          )}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              selectMovie={selectMovie}
              setSelectedId={setSelectedId}
              handleClose={handleClose}
              handleAddMovieToWatched={handleAddMovieToWatched}
              isWatched={isWatched}
              watched={watched}
              KEY={KEY}
            />
          ) : (
            <>
              <WatchedBoxSummary watched={watched} />
              <ListForWatched
                watched={watched}
                handleDeleteWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
