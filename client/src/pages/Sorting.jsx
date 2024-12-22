import { useEffect, useState } from "react";
import "../Styles/Sorting.css";

const Sorting = () => {
  const [data, setData] = useState([]);
  const [maxOccurrence, setMaxOccurrence] = useState(null);
  const [minOccurrence, setMinOccurrence] = useState(null);

  useEffect(() => {
    fetch("https://rake-detection.onrender.com/api/v3/wagon/reasons")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const reasons = Object.entries(data.reasonOccurrences).map(
            ([reason, count]) => ({ reason, count })
          );
          setData(reasons);

          const counts = reasons.map((item) => item.count);
          setMaxOccurrence(Math.max(...counts));
          setMinOccurrence(Math.min(...counts));
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="container">
      <h1>Reason Occurrences</h1>
      <table className="reasons-table">
        <thead>
          <tr>
            <th>Reason</th>
            <th>Occurrences</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={
                item.count === maxOccurrence
                  ? "max"
                  : item.count === minOccurrence
                    ? "min"
                    : ""
              }
            >
              <td>{item.reason}</td>
              <td>{item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="occurrences-info" style={{display:'flex', gap:'50rem'}}>
        <p>
          <strong>Greatest Occurrence:</strong> {maxOccurrence}
        </p>
        <p>
          <strong>Smallest Occurrence:</strong> {minOccurrence}
        </p>
      </div>
    </div>
  );
};

export default Sorting;
