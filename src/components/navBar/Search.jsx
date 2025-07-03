import { useRef, useEffect } from "react";

export function Search({ query, setQuery }) {
  const searchBar = useRef(0);

  useEffect(() => {
    function callBack(e) {
      if (document.activeElement === searchBar.current) {
        return;
      }

      if (e.code === "Enter") {
        searchBar.current.focus();
        setQuery("");
      }
    }

    document.addEventListener("keydown", callBack);

    return () => {
      document.removeEventListener("keydown", callBack);
    };
  }, [setQuery]);

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
