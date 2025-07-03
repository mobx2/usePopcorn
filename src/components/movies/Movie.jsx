export function Movie({ movie, selectedId, setSelectedId, selectMovie }) {
  const { Title: title, Year: year, imdbID, Poster: poster } = movie;

  return (
    <li
      onClick={(e) => {
        selectMovie(imdbID);
      }}
    >
      <img
        src={
          poster === "N/A"
            ? "https://placehold.co/800?text=No+Poster&font=roboto"
            : poster
        }
        alt={`${title},movie Poster`}
      />
      <h3>{title}</h3>
      <div>
        <p>
          <span>📅</span>
          <span>{year}</span>
        </p>
      </div>
    </li>
  );
}
