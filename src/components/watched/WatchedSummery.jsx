import SummaryData from "./SummeryData";

export function WatchedBoxSummary({ watched }) {
  return (
    <div className="summary">
      <h2>Movies you watched</h2>

      <SummaryData watched={watched} />
    </div>
  );
}
